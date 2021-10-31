const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

class Service {
  async getAll(data) {
    const response = await Model.find(
      {
        role: data.role || "user",
        $or: [
          { first_name: { $regex: `.*${data.search}.*`, $options: "i" } },
          { last_name: { $regex: `.*${data.search}.*`, $options: "i" } },
          { email: { $regex: `.*${data.search}.*`, $options: "i" } },
        ],
      },
      { password: 0 }
    ).lean()

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
    data.status = "active"

    const response = await Model.create(data)

    if (!response) throw new CustomError(errors.error, 404)
    return response
  }

  async updateOne(data) {
    const response = await Model.findByIdAndUpdate(
      data.id,
      { $set: data },
      { new: true }
    ).lean()

    if (!response) throw new CustomError(errors.userNotFound, 404)
    return response
  }

  async deleteOne(data) {
    const response = await Model.findByIdAndDelete(data.id)

    if (!response) throw new CustomError(errors.userNotFound, 404)
    return
  }
}

module.exports = new Service()
