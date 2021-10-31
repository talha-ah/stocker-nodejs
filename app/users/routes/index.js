const router = require("express").Router()

const auth = require("../../../middlewares/auth")

const controller = require("../controllers")

router.get("/", auth("admin"), controller.getAll)
router.get("/:id", auth("admin"), controller.getOne)
router.post("/", auth("admin"), controller.createOne)
router.put("/:id", auth("admin"), controller.updateOne)
router.delete("/:id", auth("admin"), controller.deleteOne)

module.exports = router
