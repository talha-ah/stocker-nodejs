const MongoClient = require("mongodb").MongoClient

const CategoryModel = require("./app/categories/models")
const CustomerModel = require("./app/users/models")
const StockModel = require("./app/stocks/models")

const url = process.env.DB2

function connectDB() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, client) {
      if (err) reject(err)
      resolve(client)
    })
  })
}

function errorFunc(error) {
  console.log("Error", error)
}

module.exports = async function (req, res) {
  const client = await connectDB()
  const db = client.db("stock_management_system")

  // Categories
  const categories = db.collection("categories").find({}).toArray()
  await Promise.all(
    categories.map(async (category) => {
      await CategoryModel.create({
        name: category.name,
        created_by: "617fcf3b683f8e0ee84d3310",
      })
    })
  )

  // Customers
  const customers = await db.collection("customers").find({}).toArray()
  await Promise.all(
    customers.map(async (customer) => {
      await CustomerModel.create({
        first_name: customer.customerName,
        phone: customer.contact,
        address_one: customer.address,
        created_by: "617fcf3b683f8e0ee84d3310",
        role: "customer",
        balance: {
          value: customer.remaining,
        },
      })
    })
  )

  // Stocks
  const stocks = await db.collection("stocks").find({}).toArray()
  await Promise.all(
    stocks.map(async (stock, index) => {
      // Category
      const category = await CategoryModel.findOne({
        name: stock.category,
      }).lean()

      await StockModel.create({
        sr: index + 1,
        cost_price: stock.costPrice,
        sale_price: stock.salePrice,
        inventory: stock.stockQuantity,
        location: stock.rackNumber,
        code: stock.itemCode,
        description: stock.name,
        category: category._id,
        created_by: "617fcf3b683f8e0ee84d3310",
      })
    })
  )

  res.send("DONE")
}
