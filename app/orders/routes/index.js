const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/", auth(), controller.getAll)
router.get("/:id", auth(), controller.getOne)
router.post("/", auth(), controller.createOne)
router.put("/:id", auth(), controller.updateOne)
router.delete("/:id", auth(), controller.cancelOne)

router.post("/payment/:id", auth(), controller.addPayment)
router.put("/quotation/:id", auth(), controller.updateQuotation)
router.post("/general-payment", auth(), controller.addGeneralPayment)

module.exports = router
