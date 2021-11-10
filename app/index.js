const router = require("express").Router()

const auth = require("./auth")
const users = require("./users")
const stocks = require("./stocks")
const orders = require("./orders")
const profile = require("./profile")
const customers = require("./customers")
const categories = require("./categories")

router.use("/auth", auth)
router.use("/users", users)
router.use("/stocks", stocks)
router.use("/orders", orders)
router.use("/profile", profile)
router.use("/customers", customers)
router.use("/categories", categories)

module.exports = router
