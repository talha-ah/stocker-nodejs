const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MSchema = new Schema(
  {
    cost_price: {
      type: Number,
      required: true,
    },
    sale_price: {
      type: Number,
      required: true,
    },
    inventory: {
      type: Number,
      required: true,
    },
    location: {
      trim: true,
      type: String,
      required: true,
    },
    code: {
      trim: true,
      type: String,
      required: true,
    },
    description: {
      trim: true,
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("stock", MSchema)
