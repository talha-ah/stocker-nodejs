const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async getAll(req, res) {
    const response = await Service.getAll()

    res.status(200).json(CustomResponse(texts.success, response))
  }

  async getOne(req, res) {
    const data = await Validations.checkId({ categoryId: req.params.id })

    const response = await Service.getOne(data)

    res.status(200).json(CustomResponse(texts.success, response))
  }

  async createOne(req, res) {
    const data = await Validations.createOne(req.body)

    const response = await Service.createOne(data)

    res.status(200).json(CustomResponse(texts.success, response))
  }

  async updateOne(req, res) {
    const data = await Validations.updateOne({
      categoryId: req.params.id,
      ...req.body,
    })

    const response = await Service.updateOne(data)

    res.status(200).json(CustomResponse(texts.success, response))
  }

  async deleteOne(req, res) {
    const data = await Validations.checkId({ categoryId: req.params.id })

    const response = await Service.deleteOne(data)

    res.status(201).json(CustomResponse(texts.success, response))
  }
}

module.exports = new Contoller()
