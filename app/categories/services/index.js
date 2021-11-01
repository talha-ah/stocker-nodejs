const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const StockModel = require("../../stocks/models")

class Service {
  async getAll(data) {
    const response = await Model.aggregate([
      {
        $match: {
          created_by: ObjectId(data.userId),
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
      {
        $sort: { createdAt: -1 },
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
    ).lean()

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async deleteOne(data) {
    const response = await Model.findOneAndDelete({
      _id: ObjectId(data.id),
      created_by: ObjectId(data.userId),
    })

    if (!response) throw new CustomError(errors.categoryNotFound, 404)
    return
  }
}

module.exports = new Service()
