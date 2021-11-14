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
        "string.length": errors.stockIdLength,
        "string.empty": errors.stockIdRequired,
        "any.required": errors.stockIdRequired,
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
      cost_price: Joi.number().precision(2).required().messages({
        "string.empty": errors.stockCostPriceRequired,
        "any.required": errors.stockCostPriceRequired,
      }),
      sale_price: Joi.number().precision(2).required().messages({
        "string.empty": errors.stockSalePriceRequired,
        "any.required": errors.stockSalePriceRequired,
      }),
      inventory: Joi.number().required().messages({
        "string.empty": errors.stockInventoryRequired,
        "any.required": errors.stockInventoryRequired,
      }),
      location: Joi.string().required().messages({
        "string.empty": errors.stockLocationRequired,
        "any.required": errors.stockLocationRequired,
      }),
      code: Joi.string().required().messages({
        "string.empty": errors.stockCodeRequired,
        "any.required": errors.stockCodeRequired,
      }),
      description: Joi.string().optional().allow("").messages({}),
      category: Joi.string().length(24).required().messages({
        "string.length": errors.categoryIdLength,
        "string.empty": errors.categoryIdRequired,
        "any.required": errors.categoryIdRequired,
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
        "string.length": errors.stockIdLength,
        "string.empty": errors.stockIdRequired,
        "any.required": errors.stockIdRequired,
      }),
      cost_price: Joi.number().precision(2).required().messages({
        "string.empty": errors.stockCostPriceRequired,
        "any.required": errors.stockCostPriceRequired,
      }),
      sale_price: Joi.number().precision(2).required().messages({
        "string.empty": errors.stockSalePriceRequired,
        "any.required": errors.stockSalePriceRequired,
      }),
      inventory: Joi.number().precision(2).required().messages({
        "string.empty": errors.stockInventoryRequired,
        "any.required": errors.stockInventoryRequired,
      }),
      location: Joi.string().required().messages({
        "string.empty": errors.stockLocationRequired,
        "any.required": errors.stockLocationRequired,
      }),
      code: Joi.string().required().messages({
        "string.empty": errors.stockCodeRequired,
        "any.required": errors.stockCodeRequired,
      }),
      description: Joi.string().optional().allow("").messages({}),
      category: Joi.string().length(24).required().messages({
        "string.length": errors.categoryIdLength,
        "string.empty": errors.categoryIdRequired,
        "any.required": errors.categoryIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
