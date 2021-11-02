const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async getAll(req, res) {
    const response = await Service.getAll({ userId: req.userId })

    res.status(200).json(CustomResponse(texts.stocks, response))
  }

  async getOne(req, res) {
    const data = await Validations.checkId({
      userId: req.userId,
      ...req.params,
    })

    const response = await Service.getOne(data)

    res.status(200).json(CustomResponse(texts.stocks, response))
  }

  async createOne(req, res) {
    const data = await Validations.createOne({
      userId: req.userId,
      ...req.body,
    })

    const response = await Service.createOne(data)

    res.status(200).json(CustomResponse(texts.stocks, response))
  }

  async updateOne(req, res) {
    const data = await Validations.updateOne({
      userId: req.userId,
      ...req.params,
      ...req.body,
    })

    const response = await Service.updateOne(data)

    res.status(200).json(CustomResponse(texts.stocks, response))
  }

  async deleteOne(req, res) {
    const data = await Validations.checkId({
      userId: req.userId,
      ...req.params,
    })

    const response = await Service.deleteOne(data)

    res.status(201).json(CustomResponse(texts.stocks, response))
  }
}

module.exports = new Contoller()
