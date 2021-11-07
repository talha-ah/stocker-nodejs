const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../../users/models")
const OrderModel = require("../../orders/models")

class Service {
  async getAll(data) {
    data.search = data.search || ""

    const response = await Model.aggregate([
      {
        $match: {
          created_by: ObjectId(data.userId),
          $or: [
            { first_name: { $regex: `.*${data.search}.*`, $options: "i" } },
            { last_name: { $regex: `.*${data.search}.*`, $options: "i" } },
            { email: { $regex: `.*${data.search}.*`, $options: "i" } },
          ],
          status: { $ne: "inactive" },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $lookup: {
          from: OrderModel.collection.name,
          let: {
            customer_id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$created_for", "$$customer_id"],
                    },
                    {
                      $ne: ["$status", "quotation"],
                    },
                  ],
                },
              },
            },
          ],
          as: "orders",
        },
      },
      {
        $addFields: {
          orders: {
            $size: "$orders",
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async getOne(data) {
    const response = await Model.findById(data.id, {
      password: 0,
    }).lean()

    if (!response) throw new CustomError(errors.userNotFound, 404)
    return response
  }

  async createOne(data) {
    data.role = "customer"
    data.created_by = data.userId

    const response = await Model.create(data)

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async updateOne(data) {
    const response = await Model.findOneAndUpdate(
      { _id: ObjectId(data.id), created_by: Object(data.userId) },
      { $set: data },
      { new: true }
    ).lean()

    if (!response) throw new CustomError(errors.userNotFound, 404)
    return response
  }

  async deleteOne(data) {
    const response = await Model.findOneAndUpdate(
      {
        _id: ObjectId(data.id),
        created_by: Object(data.userId),
      },
      {
        $set: {
          status: "inactive",
        },
      }
    )

    if (!response) throw new CustomError(errors.userNotFound, 404)
    return
  }
}

module.exports = new Service()
