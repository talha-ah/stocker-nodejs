const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const StockModel = require("../../stocks/models")

class Service {
  async getAll(data) {
    const response = await Model.find({
      created_by: data.userId,
      status: data.status || "active",
    })
      .sort({ createdAt: -1 })
      .lean()

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

        if (stock.discount_type === "percentage") {
          let price = stock.price * stock.quantity
          totalPrice += (price * stock.discount) / 100
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
          discount: {
            type: stock.discount_type,
            value: stock.discount,
          },
        }
      })
    )

    data.stocks = stocks
    data.total_price = totalPrice

    if (data.type === "cash") {
      data.payments = [
        {
          unit: "PKR",
          value: totalPrice,
        },
      ]
    }

    const response = await Model.create(data)

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async updateOne(data) {
    const response = await Model.findByIdAndUpdate(
      data.id,
      {
        $set: data,
      },
      { new: true }
    ).lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async addPayment(data) {
    const order = await Model.findById(data.id).lean()

    if (order.type === "cash") throw new CustomError(errors.orderTypeCash, 404)

    let totalPrice = data.value

    order.payments.forEach((payment) => {
      totalPrice += payment.value
    })

    if (order.total_price < totalPrice)
      throw new CustomError(errors.orderTotalPriceLessThanPayment, 404)

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
      },
      { new: true }
    ).lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async cancelOne(data) {
    const response = await Model.findByIdAndUpdate(data.id, {
      $set: {
        status: "cancelled",
      },
    })

    if (!response) throw new CustomError(errors.orderNotFound, 404)
    return
  }
}

module.exports = new Service()
