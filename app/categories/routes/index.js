const router = require("express").Router()

const auth = require("../../../middlewares/auth")

const controller = require("../controllers")

router.get("/", controller.getAll)
router.get("/:id", controller.getOne)
router.post("/", auth(), controller.createOne)
router.put("/:id", auth(), controller.updateOne)
router.delete("/:id", auth(), controller.deleteOne)

module.exports = router
