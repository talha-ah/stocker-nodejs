const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

class Service {
  async getAll() {
    const response = await Model.find().populate("category").lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async getOne(data) {
    const response = await Model.findById(data.id).populate("category").lean()

    if (!response) throw new CustomError(errors.stockNotFound, 404)
    return response
  }

  async createOne(data) {
    const response = await Model.create(data)

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async updateOne(data) {
    const response = await Model.findByIdAndUpdate(
      data.id,
      {
        $set: data,
      },
      { new: true }
    )
      .populate("category")
      .lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async deleteOne(data) {
    const response = await Model.findByIdAndDelete(data.id)

    if (!response) throw new CustomError(errors.stockNotFound, 404)
    return
  }
}

module.exports = new Service()
