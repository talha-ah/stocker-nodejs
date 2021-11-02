const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

class Service {
  async getAll(data) {
    const response = await Model.find({ created_by: ObjectId(data.userId) })
      .populate("category")
      // .sort({ createdAt: -1 })
      .lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async getOne(data) {
    const response = await Model.findById(data.id).populate("category").lean()

    if (!response) throw new CustomError(errors.stockNotFound, 404)
    return response
  }

  async createOne(data) {
    const count = await Model.find().count()

    data.sr = count + 1
    data.created_by = data.userId

    const response = await Model.create(data)

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async updateOne(data) {
    const response = await Model.findOneAndUpdate(
      { _id: ObjectId(data.id), created_by: ObjectId(data.userId) },
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
    const response = await Model.findOneAndDelete({
      _id: ObjectId(data.id),
      created_by: ObjectId(data.userId),
    })

    if (!response) throw new CustomError(errors.stockNotFound, 404)
    return
  }
}

module.exports = new Service()
