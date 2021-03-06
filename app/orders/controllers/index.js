const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async getAll(req, res) {
    const response = await Service.getAll({ userId: req.userId, ...req.query })

    res.status(200).json(CustomResponse(texts.orders, response))
  }

  async getOne(req, res) {
    const data = await Validations.checkId({
      userId: req.userId,
      ...req.params,
    })

    const response = await Service.getOne(data)

    res.status(200).json(CustomResponse(texts.orders, response))
  }

  async createOne(req, res) {
    const data = await Validations.createOne({
      userId: req.userId,
      ...req.body,
    })

    const response = await Service.createOne(data)

    res.status(200).json(CustomResponse(texts.orders, response))
  }

  async updateOne(req, res) {
    const data = await Validations.updateOne({
      userId: req.userId,
      ...req.params,
      ...req.body,
    })

    const response = await Service.updateOne(data)

    res.status(200).json(CustomResponse(texts.orders, response))
  }

  async cancelOne(req, res) {
    const data = await Validations.checkId({
      userId: req.userId,
      ...req.params,
    })

    const response = await Service.cancelOne(data)

    res.status(201).json(CustomResponse(texts.orders, response))
  }

  async addPayment(req, res) {
    const data = await Validations.addPayment({
      userId: req.userId,
      ...req.params,
      ...req.body,
    })

    const response = await Service.addPayment(data)

    res.status(200).json(CustomResponse(texts.orders, response))
  }

  async updateQuotation(req, res) {
    const data = await Validations.updateQuotation({
      userId: req.userId,
      ...req.params,
      ...req.body,
    })

    const response = await Service.updateQuotation(data)

    res.status(200).json(CustomResponse(texts.orders, response))
  }

  async addGeneralPayment(req, res) {
    const data = await Validations.addGeneralPayment({
      userId: req.userId,
      ...req.body,
    })

    const response = await Service.addGeneralPayment(data)

    res.status(200).json(CustomResponse(texts.orders, response))
  }
}

module.exports = new Contoller()
