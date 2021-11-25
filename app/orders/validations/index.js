const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/joiError")

const schemas = {
  checkId: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      id: Joi.string().length(24).required().messages({
        "string.length": errors.orderIdLength,
        "string.empty": errors.orderIdRequired,
        "any.required": errors.orderIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  createOne: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      created_for: Joi.string().length(24).required().messages({
        "string.length": errors.orderCreatedForLength,
        "string.empty": errors.orderCreatedForRequired,
        "any.required": errors.orderCreatedForRequired,
      }),
      display_id: Joi.string().required().messages({
        "string.empty": errors.orderDisplayIdRequired,
        "any.required": errors.orderDisplayIdRequired,
      }),
      type: Joi.string()
        .default("cash")
        .valid("cash", "installments")
        .required()
        .messages({
          "any.only": errors.orderPaymentTypeValid,
          "string.empty": errors.orderPaymentTypeRequired,
          "any.required": errors.orderPaymentTypeRequired,
        }),
      installments: Joi.number().when("type", {
        is: "cash",
        then: Joi.number().default(1).min(1).optional(),
        otherwise: Joi.number().default(1).min(1).required().messages({
          "number.min": errors.orderPaymentInstallmentsRequired,
          "any.required": errors.orderPaymentInstallmentsRequired,
        }),
      }),
      status: Joi.string()
        .default("active")
        .valid("quotation", "active")
        .optional()
        .messages({
          "any.only": errors.orderStatusQuotationValid,
        }),
      address_one: Joi.string().default("").optional().allow(""),
      address_two: Joi.string().default("").optional().allow(""),
      postal_code: Joi.string().default("").optional().allow(""),
      city: Joi.string().default("").optional().allow(""),
      state: Joi.string().default("").optional().allow(""),
      country: Joi.string().default("").optional().allow(""),
      stocks: Joi.array()
        .min(1)
        .required()
        .items(
          Joi.object().keys({
            stock_id: Joi.string().length(24).required().messages({
              "string.length": errors.stockIdLength,
              "string.empty": errors.stockIdRequired,
              "any.required": errors.stockIdRequired,
            }),
            quantity: Joi.number().required().messages({
              "string.empty": errors.orderQuantityRequired,
              "any.required": errors.orderQuantityRequired,
            }),
            price: Joi.number().precision(2).required().messages({
              "string.empty": errors.orderPriceRequired,
              "any.required": errors.orderPriceRequired,
            }),
            discount: Joi.number().precision(2).required().messages({
              "string.empty": errors.orderDiscountRequired,
              "any.required": errors.orderDiscountRequired,
            }),
            discount_type: Joi.string()
              .default("percentage")
              .valid("percentage", "fixed")
              .optional()
              .messages({
                "any.only": errors.orderDiscountTypeValid,
              }),
          })
        )
        .messages({
          "array.min": `At least {#limit} stock is required`,
          "any.required": `At least {#limit} stock is required`,
        }),
    })

    return joiError(Validation.validate(data))
  },
  updateOne: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      id: Joi.string().length(24).required().messages({
        "string.length": errors.orderIdLength,
        "string.empty": errors.orderIdRequired,
        "any.required": errors.orderIdRequired,
      }),
      status: Joi.string()
        .default("active")
        .valid("active", "shipped", "fulfilled")
        .required()
        .messages({
          "any.only": errors.orderStatusValid,
          "string.empty": errors.orderStatusRequired,
          "any.required": errors.orderStatusRequired,
        }),
    })

    return joiError(Validation.validate(data))
  },
  addPayment: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      id: Joi.string().length(24).required().messages({
        "string.length": errors.orderIdLength,
        "string.empty": errors.orderIdRequired,
        "any.required": errors.orderIdRequired,
      }),
      value: Joi.number().precision(2).min(1).required().messages({
        "number.min": errors.orderPaymentRequired,
        "any.required": errors.orderPaymentRequired,
      }),
      unit: Joi.string()
        .default("PKR")
        .valid("PKR", "USD")
        .optional()
        .messages({
          "any.only": errors.orderPaymentTypeRequired,
        }),
    })

    return joiError(Validation.validate(data))
  },
  updateQuotation: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      id: Joi.string().length(24).required().messages({
        "string.length": errors.quotationIdLength,
        "string.empty": errors.quotationIdRequired,
        "any.required": errors.quotationIdRequired,
      }),
      type: Joi.string()
        .default("cash")
        .valid("cash", "installments")
        .required()
        .messages({
          "any.only": errors.orderPaymentTypeValid,
          "string.empty": errors.orderPaymentTypeRequired,
          "any.required": errors.orderPaymentTypeRequired,
        }),
      installments: Joi.number().when("type", {
        is: "cash",
        then: Joi.number().default(1).min(1).optional(),
        otherwise: Joi.number().default(1).min(1).required().messages({
          "number.min": errors.orderPaymentInstallmentsRequired,
          "any.required": errors.orderPaymentInstallmentsRequired,
        }),
      }),
      address_one: Joi.string().default("").optional().allow(""),
      address_two: Joi.string().default("").optional().allow(""),
      postal_code: Joi.string().default("").optional().allow(""),
      city: Joi.string().default("").optional().allow(""),
      state: Joi.string().default("").optional().allow(""),
      country: Joi.string().default("").optional().allow(""),
      stocks: Joi.array()
        .min(1)
        .required()
        .items(
          Joi.object().keys({
            stock_id: Joi.string().length(24).required().messages({
              "string.length": errors.stockIdLength,
              "string.empty": errors.stockIdRequired,
              "any.required": errors.stockIdRequired,
            }),
            quantity: Joi.number().required().messages({
              "string.empty": errors.orderQuantityRequired,
              "any.required": errors.orderQuantityRequired,
            }),
            price: Joi.number().precision(2).required().messages({
              "string.empty": errors.orderPriceRequired,
              "any.required": errors.orderPriceRequired,
            }),
            discount: Joi.number().precision(2).required().messages({
              "string.empty": errors.orderDiscountRequired,
              "any.required": errors.orderDiscountRequired,
            }),
            discount_type: Joi.string()
              .default("percentage")
              .valid("percentage", "fixed")
              .optional()
              .messages({
                "any.only": errors.orderDiscountTypeValid,
              }),
          })
        )
        .messages({
          "array.min": `At least {#limit} stock is required`,
          "any.required": `At least {#limit} stock is required`,
        }),
    })

    return joiError(Validation.validate(data))
  },
  addGeneralPayment: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      customerId: Joi.string().length(24).required().messages({
        "string.length": errors.customerIdLength,
        "string.empty": errors.customerIdRequired,
        "any.required": errors.customerIdRequired,
      }),
      value: Joi.number().precision(2).min(1).required().messages({
        "number.min": errors.orderPaymentRequired,
        "any.required": errors.orderPaymentRequired,
      }),
      unit: Joi.string()
        .default("PKR")
        .valid("PKR", "USD")
        .optional()
        .messages({
          "any.only": errors.orderPaymentTypeRequired,
        }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
