const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const UserModel = require("../../users/models")
const StockModel = require("../../stocks/models")

class Service {
  async getAll(data) {
    const response = await Model.aggregate([
      {
        $match: {
          created_by: ObjectId(data.userId),
          status: data.status || { $ne: "quotation" },
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "created_for",
          foreignField: "_id",
          as: "created_for",
        },
      },
      {
        $lookup: {
          from: StockModel.collection.name,
          localField: "stocks.stock_id",
          foreignField: "_id",
          as: "stocksLookup",
        },
      },
      {
        $addFields: {
          created_for: { $first: "$created_for" },
          balance: {
            $subtract: ["$total_price", { $sum: "$payments.value" }],
          },
          stocks: {
            $map: {
              input: "$stocks",
              as: "stock",
              in: {
                $mergeObjects: [
                  "$$stock",
                  {
                    stock_id: {
                      $arrayElemAt: [
                        "$stocksLookup",
                        {
                          $indexOfArray: [
                            "$stocksLookup._id",
                            "$$stock.stock_id",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          stocksLookup: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async getOne(data) {
    const response = await Model.findById(data.id).lean()

    if (!response) throw new CustomError(errors.orderNotFound, 404)
    return response
  }

  async createOne(data) {
    data.created_by = data.userId
    data.shipping_address = { ...data }

    let totalPrice = 0

    const stocks = await Promise.all(
      data.stocks.map(async (stock) => {
        const st = await StockModel.findById(stock.stock_id).lean()
        if (!st) throw new CustomError(errors.stockNotFound, 404)

        if (data.status !== "quotation") {
          if (stock.quantity > st.inventory)
            throw new CustomError(
              `${errors.orderStockInventoryInvalid}: ${st.description}`,
              404
            )
        }

        if (
          stock.discount_type === "percentage" &&
          stock.discount &&
          stock.discount > 0
        ) {
          let price = stock.price * stock.quantity
          let discount = (price * stock.discount) / 100
          totalPrice += price - discount
        } else {
          let price = stock.price * stock.quantity
          price = price - stock.discount
          totalPrice += price
        }

        return {
          stock_id: stock.stock_id,
          quantity: stock.quantity,
          cost_price: st.cost_price,
          sale_price: stock.price,
          inventory: st.inventory,
          discount: {
            type: stock.discount_type,
            value: stock.discount,
          },
        }
      })
    )

    data.stocks = stocks
    data.total_price = totalPrice

    if (data.type === "cash" && data.status !== "quotation") {
      data.payments = [
        {
          unit: "PKR",
          value: totalPrice,
        },
      ]
      data.paid = true
    } else {
      await UserModel.findByIdAndUpdate(data.created_for, {
        $inc: {
          "balance.value": totalPrice,
        },
      })
    }

    const totalCount = await Model.find().count()

    data.order_id = totalCount + 1

    // Create order
    const order = await Model.create(data)

    // Update inventory
    if (data.status !== "quotation") {
      await Promise.all(
        stocks.map(async (stock) => {
          await StockModel.findByIdAndUpdate(stock.stock_id, {
            $set: {
              inventory: Number(stock.inventory) - Number(stock.quantity),
            },
          })
        })
      )
    }

    const response = await Model.aggregate([
      {
        $match: {
          _id: ObjectId(order._id),
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "created_for",
          foreignField: "_id",
          as: "created_for",
        },
      },
      {
        $lookup: {
          from: StockModel.collection.name,
          localField: "stocks.stock_id",
          foreignField: "_id",
          as: "stocksLookup",
        },
      },
      {
        $addFields: {
          created_for: { $first: "$created_for" },
          balance: {
            $subtract: ["$total_price", { $sum: "$payments.value" }],
          },
          stocks: {
            $map: {
              input: "$stocks",
              as: "stock",
              in: {
                $mergeObjects: [
                  "$$stock",
                  {
                    stock_id: {
                      $arrayElemAt: [
                        "$stocksLookup",
                        {
                          $indexOfArray: [
                            "$stocksLookup._id",
                            "$$stock.stock_id",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          stocksLookup: 0,
        },
      },
    ])

    if (!response[0]) throw new CustomError(errors.error, 404)
    return response[0]
  }

  async updateOne(data) {
    const order = await Model.findOne({
      _id: ObjectId(data.id),
      created_by: ObjectId(data.userId),
    })
      .populate("stocks.stock_id")
      .lean()

    if (!order) throw new CustomError(errors.orderNotFound, 404)
    if (order.status === data.status)
      throw new CustomError(errors.orderStatusInvalid, 404)

    if (data.status === "active") {
      const stocks = order.stocks

      // Check inventory
      stocks.forEach((stock) => {
        if (stock.quantity > stock.stock_id.inventory)
          throw new CustomError(
            `${errors.orderStockInventoryInvalid} '${stock.stock_id.description}'`,
            404
          )
      })

      if (order.type === "cash") {
        data.payments = [
          {
            unit: "PKR",
            value: order.total_price,
          },
        ]
        data.paid = true
      } else {
        await UserModel.findByIdAndUpdate(order.created_for, {
          $inc: {
            "balance.value": order.total_price,
          },
        })
      }

      // Quotation => Order
      const response = await Model.findByIdAndUpdate(data.id, {
        $set: data,
      }).lean()
      if (!response) throw new CustomError(errors.error, 404)

      await Promise.all(
        stocks.map(async (stock) => {
          await StockModel.findByIdAndUpdate(stock.stock_id._id, {
            $set: {
              inventory:
                Number(stock.stock_id.inventory) - Number(stock.quantity),
            },
          })
        })
      )
    } else {
      // Update order status
      const response = await Model.findByIdAndUpdate(data.id, {
        $set: data,
      }).lean()
      if (!response) throw new CustomError(errors.error, 404)
    }

    return
  }

  async addPayment(data) {
    const order = await Model.findOne({
      _id: ObjectId(data.id),
      created_by: ObjectId(data.userId),
    }).lean()

    if (!order) throw new CustomError(errors.orderNotFound, 404)
    if (order.type === "cash") throw new CustomError(errors.orderTypeCash, 404)
    if (order.status === "quotation")
      throw new CustomError(errors.orderTypeQuotation, 404)

    let totalPrice = data.value

    order.payments.forEach((payment) => {
      totalPrice += payment.value
    })

    if (order.total_price < totalPrice)
      throw new CustomError(errors.orderTotalPriceLessThanPayment, 404, {
        value: errors.orderTotalPriceLessThanPayment,
      })

    const response = await Model.findByIdAndUpdate(
      data.id,
      {
        $addToSet: {
          payments: {
            installment: order.payments.length + 1,
            value: data.value,
            unit: data.unit,
          },
        },
        $set: {
          paid: order.total_price === totalPrice,
        },
      },
      { new: true }
    ).lean()

    if (!response) throw new CustomError(errors.error, 404)

    // Update user balance
    await UserModel.findByIdAndUpdate(order.created_for, {
      $inc: {
        "balance.value": -data.value,
      },
    })

    return response
  }

  async addGeneralPayment(data) {
    const orders = await Model.aggregate([
      {
        $match: {
          paid: false,
          status: "active",
          type: "installments",
          created_by: ObjectId(data.userId),
          created_for: ObjectId(data.customerId),
        },
      },
      {
        $addFields: {
          balance: {
            $subtract: ["$total_price", { $sum: "$payments.value" }],
          },
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ])

    if (orders.length === 0)
      throw new CustomError(errors.noPendingPayment, 404, {
        value: errors.noPendingPayment,
      })

    let totalPrice = data.value
    let inputPrice = data.value
    let payments = []

    orders.forEach((order) => {
      let amount = inputPrice - order.balance
      if (amount > 0) {
        inputPrice -= order.balance
        amount = order.balance
      } else if (amount < 0) {
        amount = order.balance - inputPrice
        inputPrice = 0
      } else {
        amount = order.balance
        inputPrice = 0
      }
      payments.push({
        orderId: order._id,
        paid: amount === order.balance,
        payment: {
          value: amount,
          unit: data.unit,
          installment: order.payments.length + 1,
        },
      })
    })

    if (inputPrice > 0)
      throw new CustomError(errors.orderTotalPriceLessThanPayment, 404, {
        value: errors.orderTotalPriceLessThanPayment,
      })

    // Add order payments
    payments.forEach(async (payment) => {
      await Model.findByIdAndUpdate(payment.orderId, {
        $addToSet: {
          payments: payment.payment,
        },
        $set: {
          paid: payment.paid,
        },
      }).lean()

      if (!response) throw new CustomError(errors.error, 404)
    })

    // Update user balance
    await UserModel.findByIdAndUpdate(data.customerId, {
      $inc: {
        "balance.value": -totalPrice,
      },
    })

    return payments
  }

  async cancelOne(data) {
    const response = await Model.findOneAndUpdate(
      { _id: ObjectId(data.id), created_by: ObjectId(data.userId) },
      {
        $set: {
          status: "cancelled",
        },
      }
    )

    if (!response) throw new CustomError(errors.orderNotFound, 404)
    return
  }
}

module.exports = new Service()
