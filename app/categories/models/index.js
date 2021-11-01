const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MSchema = new Schema(
  {
    name: {
      trim: true,
      type: String,
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

module.exports = mongoose.model("category", MSchema)
