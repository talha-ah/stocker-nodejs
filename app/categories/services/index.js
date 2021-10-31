const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

class Service {
  async getAll() {
    const response = await Model.find().lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async getOne(data) {
    const response = await Model.findById(data.categoryId).lean()

    if (!response) throw new CustomError(errors.categoryNotFound, 404)
    return response
  }

  async createOne(data) {
    const response = await Model.create(data)

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async updateOne(data) {
    const response = await Model.findByIdAndUpdate(
      data.categoryId,
      {
        $set: data,
      },
      { new: true }
    ).lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async deleteOne(data) {
    const response = await Model.findByIdAndDelete(data.categoryId)

    if (!response) throw new CustomError(errors.categoryNotFound, 404)
    return
  }
}

module.exports = new Service()
