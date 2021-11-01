const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../../users/models")

class Service {
  async getAll(data) {
    data.search = data.search || ""

    const response = await Model.find(
      {
        created_by: ObjectId(data.userId),
        $or: [
          { first_name: { $regex: `.*${data.search}.*`, $options: "i" } },
          { last_name: { $regex: `.*${data.search}.*`, $options: "i" } },
          { email: { $regex: `.*${data.search}.*`, $options: "i" } },
        ],
      },
      { password: 0 }
    )
      .sort({ createdAt: -1 })
      .lean()

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
    const response = await Model.findOneAndDelete({
      _id: ObjectId(data.id),
      created_by: Object(data.userId),
    })

    if (!response) throw new CustomError(errors.userNotFound, 404)
    return
  }
}

module.exports = new Service()
