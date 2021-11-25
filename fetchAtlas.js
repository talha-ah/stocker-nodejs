const ObjectId = require("mongodb").ObjectId
const MongoClient = require("mongodb").MongoClient

const StockModel = require("./app/stocks/models")
const OrderModel = require("./app/orders/models")
const CustomerModel = require("./app/users/models")
const CategoryModel = require("./app/categories/models")

const { generateId } = require("./utils/helpers")

const url = process.env.MONGODB_URI_2

function connectDB() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      { useUnifiedTopology: true },
      function (err, client) {
        if (err) reject(err)
        resolve(client)
      }
    )
  })
}

const handlePayments = (paymentsArray, price, subtractor = 0) => {
  if (paymentsArray.length > 0 && paymentsArray[0].value > 0) {
    let valueLeft = paymentsArray[0].value - price
    if (valueLeft > 0) {
      paymentsArray[0].value -= price
      const createdAt = paymentsArray[0].createdAt
      return {
        createdAt,
        paid: true,
        paymentsArray,
        value: price + subtractor,
      }
    } else if (valueLeft === 0) {
      const createdAt = paymentsArray[0].createdAt
      paymentsArray.splice(0, 1)
      return {
        createdAt,
        paid: true,
        paymentsArray,
        value: price + subtractor,
      }
    } else {
      if (paymentsArray.length === 1) {
        valueLeft = paymentsArray[0].value
        const createdAt = paymentsArray[0].createdAt
        return {
          createdAt,
          paid: false,
          paymentsArray: [],
          value: valueLeft + subtractor,
        }
      } else {
        valueLeft = paymentsArray[0].value
        paymentsArray.splice(0, 1)

        return handlePayments(
          paymentsArray,
          price - valueLeft,
          valueLeft + subtractor
        )
      }
    }
  } else {
    return null
  }
}

module.exports = async function (req, res) {
  if (req.query.secret !== process.env.FETCH_ATLAS_SECRET) {
    const error = new Error("Unauthorized: Invalid Secret")
    error.status = 400
    throw error
  }

  const client = await connectDB()
  const db = client.db("stock_management_system")

  // Categories
  const categories = await db.collection("categories").find({}).toArray()
  await Promise.all(
    categories.map(async (category) => {
      await CategoryModel.findOneAndUpdate(
        {
          name: category.name,
          created_by: "617fcf3b683f8e0ee84d3310",
        },
        {
          $setOnInsert: { timestamp: Date.now() },
        },
        { upsert: true }
      )
    })
  )

  // Stocks
  const stocks = await db.collection("stocks").find({}).toArray()
  await Promise.all(
    stocks.map(async (stock, index) => {
      // Category
      const category = await CategoryModel.findOneAndUpdate(
        {
          name: stock.category,
          created_by: "617fcf3b683f8e0ee84d3310",
        },
        {
          $setOnInsert: { timestamp: Date.now() },
        },
        { upsert: true, new: true }
      )

      await StockModel.findOneAndUpdate(
        {
          sr: index + 1,
          cost_price: stock.costPrice,
          sale_price: stock.salePrice,
          inventory: stock.stockQuantity,
          location: stock.rackNumber,
          code: stock.itemCode,
          description: stock.name,
          category: category._id,
          created_by: "617fcf3b683f8e0ee84d3310",
        },
        {
          $setOnInsert: { timestamp: Date.now() },
        },
        { upsert: true }
      )
    })
  )

  // Customers
  const customers = await db.collection("customers").find({}).toArray()
  await Promise.all(
    customers.map(async (cust) => {
      let customer = await CustomerModel.findOneAndUpdate(
        {
          first_name: cust.customerName,
        },
        {
          $setOnInsert: {
            role: "customer",
            phone: cust.contact,
            timestamp: Date.now(),
            address_one: cust.address,
            created_by: "617fcf3b683f8e0ee84d3310",
            balance: {
              unit: "PKR",
              value: cust.remaining || 0,
            },
          },
        },
        { upsert: true, new: true }
      )

      let payments = []
      const orders = cust.data.reduce((result, current) => {
        if (
          current.quantity === undefined &&
          current.discounted === undefined
        ) {
          payments.push({
            value: current.total,
            createdAt: new Date(current.date * 1000),
          })
          return result
        }
        const orderIndex = result.findIndex(
          (e) => e.order_id === current.invoice_id
        )
        //   if not found
        if (orderIndex === -1) {
          if (
            current.id &&
            current.name &&
            current.cost &&
            current.price &&
            current.quantity
          ) {
            result.push({
              type: "cash",
              status: "active",
              created_for: customer._id,
              total_price: current.total,
              order_id: current.invoice_id,
              created_by: "617fcf3b683f8e0ee84d3310",
              createdAt: new Date(current.date * 1000),
              updatedAt: new Date(current.date * 1000),
              display_id: current.invoice_id || generateId(),
              stocks: [
                {
                  stock_id: current.id,
                  stock_name: current.name,
                  cost_price: current.cost,
                  sale_price: current.price,
                  quantity: current.quantity,
                  total_price: current.total,
                  discount: {
                    type: "percentage",
                    value: current.disc,
                  },
                },
              ],
            })
          }
        } else {
          if (
            current.id &&
            current.name &&
            current.cost &&
            current.price &&
            current.quantity
          ) {
            // if found
            result[orderIndex].total_price += current.total
            result[orderIndex].stocks.push({
              stock_id: current.id,
              stock_name: current.name,
              cost_price: current.cost,
              sale_price: current.price,
              quantity: current.quantity,
              total_price: current.total,
              discount: {
                type: "percentage",
                value: current.disc,
              },
            })
          }
        }
        return result
      }, [])
      await Promise.all(
        orders.map(async (order) => {
          if (isNaN(order.total_price)) order.total_price = 0
          const pay = handlePayments(payments, order.total_price)
          if (pay) {
            payments = [...pay.paymentsArray]
            order.paid = pay.paid
            order.payments = [
              {
                unit: "PKR",
                installment: 1,
                value: pay.value,
              },
            ]
          }
          // Stocks
          order.stocks = await Promise.all(
            order.stocks.map(async (stock) => {
              let stockF = await StockModel.findOne({
                $or: [
                  { _id: ObjectId(stock.stock_id) },
                  { description: stock.stock_name },
                ],
              }).lean()
              stock.stock_id = stockF ? stockF._id : "618baf8414d8132b1cfa7866"
              return stock
            })
          )
          await OrderModel.create(order)
        })
      )
    })
  )

  // Orders
  const orders = await db
    .collection("sales")
    .find({ costPriceTotal: { $gt: 0 }, salePriceTotal: { $gt: 0 } })
    .toArray()
  await Promise.all(
    orders.map(async (order) => {
      // Customer
      let customer = await CustomerModel.findOneAndUpdate(
        {
          first_name: order.customerName,
        },
        {
          $set: {
            role: "customer",
            timestamp: Date.now(),
            created_by: "617fcf3b683f8e0ee84d3310",
            balance: {
              value: 0,
              unit: "PKR",
            },
          },
        },
        {
          new: true,
          upsert: true,
        }
      ).lean()

      let totalPrice = 0

      const stocks = await Promise.all(
        order.data.map(async (item) => {
          // Stock
          let stock = await StockModel.findOne({
            $or: [{ _id: ObjectId(item.id) }, { description: item.name }],
          }).lean()

          totalPrice += item.total

          return {
            cost_price: item.cost,
            sale_price: item.price,
            quantity: item.quantity,
            stock_id: stock ? stock._id : "618baf8414d8132b1cfa7866",
            discount: {
              type: "percentage",
              value: item.disc,
            },
          }
        })
      )

      const body = {
        paid: true,
        type: "cash",
        stocks: stocks,
        status: "active",
        total_price: totalPrice,
        created_for: customer._id,
        order_id: order.invoice_num,
        display_id: order.invoice_num || generateId(),
        created_by: "617fcf3b683f8e0ee84d3310",
        payments: [
          {
            unit: "PKR",
            installment: 1,
            value: totalPrice,
          },
        ],
      }

      // Create order
      await OrderModel.create(body)
    })
  )

  res.send("DONE")
}

// {"_id":{"$oid":"617fcf3b683f8e0ee84d3310"},"balance":{"value":0,"unit":"PKR"},"role":"user","status":"active","first_name":"Awais","last_name":"User","email":"awais@gmail.com","password":"$2a$10$Q/2eB.28B1HgmjQpHUlGg.ZMNfIUu70wNRQ5z0Ass4M5Qq3djQ6.S","createdAt":{"$date":"2021-11-01T11:27:55.284Z"},"updatedAt":{"$date":"2021-11-01T11:27:55.284Z"}}
