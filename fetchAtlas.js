const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId

const CategoryModel = require("./app/categories/models")
const CustomerModel = require("./app/users/models")
const StockModel = require("./app/stocks/models")
const OrderModel = require("./app/orders/models")

const { generateId } = require("./utils/helpers")

const url = process.env.DB2

function connectDB() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, client) {
      if (err) reject(err)
      resolve(client)
    })
  })
}

module.exports = async function (req, res) {
  const client = await connectDB()
  const db = client.db("stock_management_system")

  // // Categories
  // const categories = db.collection("categories").find({}).toArray()
  // await Promise.all(
  //   categories.map(async (category) => {
  //     await CategoryModel.create({
  //       name: category.name,
  //       created_by: "617fcf3b683f8e0ee84d3310",
  //     })
  //   })
  // )

  // // Stocks
  // const stocks = await db.collection("stocks").find({}).toArray()
  // await Promise.all(
  //   stocks.map(async (stock, index) => {
  //     // Category
  //     const category = await CategoryModel.findOne({
  //       name: stock.category,
  //     }).lean()

  //     await StockModel.create({
  //       sr: index + 1,
  //       cost_price: stock.costPrice,
  //       sale_price: stock.salePrice,
  //       inventory: stock.stockQuantity,
  //       location: stock.rackNumber,
  //       code: stock.itemCode,
  //       description: stock.name,
  //       category: category._id,
  //       created_by: "617fcf3b683f8e0ee84d3310",
  //     })
  //   })
  // )

  // // Customers
  // const customers = await db.collection("customers").find({}).toArray()
  // await Promise.all(
  //   customers.map(async (cust) => {
  //     const customer = await CustomerModel.create({
  //       role: "customer",
  //       phone: cust.contact,
  //       address_one: cust.address,
  //       first_name: cust.customerName,
  //       created_by: "617fcf3b683f8e0ee84d3310",
  //       balance: {
  //         value: cust.remaining,
  //       },
  //     })

  //     let totalPaid = 0
  //     const orders = cust.data.reduce((result, current) => {
  //       if (current.itemCode) {
  //         totalPaid += current.total
  //         return result
  //       }

  //       const orderIndex = result.findIndex(
  //         (e) => e.order_id === current.invoice_id
  //       )

  //       //   if not found
  //       if (orderIndex === -1) {
  //         const key = generateId()
  //         if (
  //           current.id &&
  //           current.name &&
  //           current.cost &&
  //           current.price &&
  //           current.quantity
  //         ) {
  //           result.push({
  //             type: "cash",
  //             status: "active",
  //             created_for: customer._id,
  //             order_id: current.invoice_id || result.length + 1,
  //             total_price: current.totalCost,
  //             display_id: current.invoice_id || key,
  //             created_by: "617fcf3b683f8e0ee84d3310",
  //             stocks: [
  //               {
  //                 stock_id: current.id,
  //                 stock_name: current.name,
  //                 cost_price: current.cost,
  //                 sale_price: current.price,
  //                 quantity: current.quantity,
  //                 discount: {
  //                   type: "percentage",
  //                   value: current.disc,
  //                 },
  //               },
  //             ],
  //           })
  //         }
  //       } else {
  //         if (
  //           current.id &&
  //           current.name &&
  //           current.cost &&
  //           current.price &&
  //           current.quantity
  //         ) {
  //           // if found
  //           result[orderIndex].total_price += current.totalCost
  //           result[orderIndex].stocks.push({
  //             stock_id: current.id,
  //             stock_name: current.name,
  //             cost_price: current.cost,
  //             sale_price: current.price,
  //             quantity: current.quantity,
  //             discount: {
  //               type: "percentage",
  //               value: current.disc,
  //             },
  //           })
  //         }
  //       }

  //       return result
  //     }, [])

  //     await Promise.all(
  //       orders.map(async (order) => {
  //         if (isNaN(order.total_price)) {
  //           console.log("order", order)
  //           order.total_price = 0
  //         }

  //         if (totalPaid > 0) {
  //           let price = totalPaid - order.total_price
  //           if (price > 0) {
  //             totalPaid -= order.total_price
  //             order.paid = true
  //             order.payments = [
  //               {
  //                 unit: "PKR",
  //                 installment: 1,
  //                 value: order.total_price,
  //               },
  //             ]
  //           }
  //         }

  //         // Stocks
  //         order.stocks = await Promise.all(
  //           order.stocks.map(async (stock) => {
  //             let stockF = await StockModel.findOne({
  //               $or: [
  //                 { _id: ObjectId(stock.stock_id) },
  //                 { description: stock.stock_name },
  //               ],
  //             }).lean()

  //             stock.stock_id = stockF ? stockF._id : "618baf8414d8132b1cfa7866"
  //             return stock
  //           })
  //         )

  //         await OrderModel.create(order)
  //       })
  //     )
  //   })
  // )

  // // Orders
  // const orders = await db
  //   .collection("sales")
  //   .find({ costPriceTotal: { $gt: 0 }, salePriceTotal: { $gt: 0 } })
  //   .toArray()
  // await Promise.all(
  //   orders.map(async (order, index) => {
  //     // Customer
  //     let customer = null
  //     customer = await CustomerModel.findOne({
  //       first_name: order.customerName,
  //     }).lean()
  //     if (!customer) {
  //       customer = await CustomerModel.create({
  //         first_name: order.customerName,
  //         role: "customer",
  //         created_by: "617fcf3b683f8e0ee84d3310",
  //       })
  //     }

  //     let totalPrice = 0

  //     const stocks = await Promise.all(
  //       order.data.map(async (item) => {
  //         // Category
  //         let category = null
  //         category = await CategoryModel.findOne({
  //           name: item.category,
  //         }).lean()
  //         if (!category) {
  //           category = await CategoryModel.create({
  //             name: item.category,
  //             created_by: "617fcf3b683f8e0ee84d3310",
  //           })
  //         }

  //         // Stock
  //         let stock = await StockModel.findOne({
  //           $or: [{ _id: ObjectId(item.id) }, { description: item.name }],
  //         }).lean()

  //         totalPrice += item.discounted

  //         return {
  //           stock_id: stock ? stock._id : "618baf8414d8132b1cfa7866",
  //           quantity: item.quantity,
  //           cost_price: item.cost,
  //           sale_price: item.price,
  //           discount: {
  //             type: "percentage",
  //             value: item.disc,
  //           },
  //         }
  //       })
  //     )

  //     const body = {
  //       paid: true,
  //       type: "cash",
  //       stocks: stocks,
  //       status: "active",
  //       order_id: index + 1,
  //       total_price: totalPrice,
  //       display_id: generateId(),
  //       created_for: customer._id,
  //       created_by: "617fcf3b683f8e0ee84d3310",
  //       payments: [
  //         {
  //           installment: 1,
  //           value: totalPrice,
  //           unit: "PKR",
  //         },
  //       ],
  //     }
  //     // Create order
  //     await OrderModel.create(body)
  //   })
  // )

  res.send("DONE")
}
