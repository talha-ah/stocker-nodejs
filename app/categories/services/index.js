const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const StockModel = require("../../stocks/models")

class Service {
  async getAll() {
    const response = await Model.aggregate([
      {
        $lookup: {
          from: StockModel.collection.name,
          foreignField: "category",
          localField: "_id",
          as: "items",
        },
      },
      {
        $addFields: {
          items: { $size: "$items" },
        },
      },
    ])

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async getOne(data) {
    const response = await Model.aggregate([
      {
        $match: {
          _id: ObjectId(data.id),
        },
      },
      {
        $lookup: {
          from: StockModel.collection.name,
          foreignField: "category",
          localField: "_id",
          as: "items",
        },
      },
      {
        $addFields: {
          items: { $size: "$items" },
        },
      },
    ])

    if (!response[0]) throw new CustomError(errors.categoryNotFound, 404)
    return response[0]
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
    ).lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async deleteOne(data) {
    const response = await Model.findByIdAndDelete(data.id)

    if (!response) throw new CustomError(errors.categoryNotFound, 404)
    return
  }
}

module.exports = new Service()
