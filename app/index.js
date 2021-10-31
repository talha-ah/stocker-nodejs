const auth = require("./auth")
const users = require("./users")
const stocks = require("./stocks")
const profile = require("./profile")
const categories = require("./categories")

module.exports = function (app) {
  app.use("/api/v1/auth", auth)
  app.use("/api/v1/users", users)
  app.use("/api/v1/stocks", stocks)
  app.use("/api/v1/profile", profile)
  app.use("/api/v1/categories", categories)
}
