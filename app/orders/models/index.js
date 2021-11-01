const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MSchema = new Schema(
  {
    created_by: {
      ref: "user",
      required: true,
      type: Schema.Types.ObjectId,
    },
    created_for: {
      ref: "user",
      required: true,
      type: Schema.Types.ObjectId,
    },
    display_id: {
      trim: true,
      type: String,
    },
    total_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: {
        type: String,
        default: "percentage",
        enum: ["fixed", "percentage"],
      },
      value: {
        default: 0,
        type: Number,
      },
    },
    shipping_address: {
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
    },
    stocks: [
      {
        _id: false,
        stock_id: {
          ref: "stock",
          required: true,
          type: Schema.Types.ObjectId,
        },
        quantity: {
          default: 1,
          type: Number,
          required: true,
        },
        cost_price: {
          type: Number,
          required: true,
        },
        sale_price: {
          type: Number,
          required: true,
        },
        discount: {
          type: {
            type: String,
            default: "percentage",
            enum: ["fixed", "percentage"],
          },
          value: {
            default: 0,
            type: Number,
          },
        },
      },
    ],
    type: {
      type: String,
      default: "cash",
      enum: ["cash", "installments"],
    },
    installments: {
      default: 1,
      type: Number,
    },
    payments: [
      {
        _id: false,
        installment: {
          type: Number,
          default: 1,
        },
        value: {
          type: Number,
          default: 0,
        },
        unit: {
          type: String,
          default: "PKR",
          enum: ["PKR", "USD"],
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    paid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "quotation",
      enum: ["quotation", "active", "shipped", "cancelled", "fulfilled"],
    },
    metadata: {
      type: Object,
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("order", MSchema)
