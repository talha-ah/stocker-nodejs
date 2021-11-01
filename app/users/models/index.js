const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MSchema = new Schema(
  {
    first_name: {
      trim: true,
      type: String,
      required: true,
    },
    last_name: {
      trim: true,
      type: String,
    },
    email: {
      trim: true,
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    address_one: {
      type: String,
    },
    address_two: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    description: {
      trim: true,
      type: String,
    },
    balance: {
      value: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        default: "PKR",
        enum: ["PKR", "USD"],
      },
    },
    role: {
      trim: true,
      type: String,
      enum: ["user", "admin", "customer"],
      default: "user",
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("user", MSchema)
