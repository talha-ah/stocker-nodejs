const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/joiError")

const schemas = {
  checkId: (data) => {
    const Validation = Joi.object().keys({
      id: Joi.string().length(24).required().messages({
        "string.length": errors.categoryIdLength,
        "string.empty": errors.categoryIdRequired,
        "any.required": errors.categoryIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  createOne: (data) => {
    const Validation = Joi.object().keys({
      name: Joi.string().required().messages({
        "string.empty": errors.categoryNameRequired,
        "any.required": errors.categoryNameRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  updateOne: (data) => {
    const Validation = Joi.object().keys({
      id: Joi.string().length(24).required().messages({
        "string.length": errors.categoryIdLength,
        "string.empty": errors.categoryIdRequired,
        "any.required": errors.categoryIdRequired,
      }),
      name: Joi.string().required().messages({
        "string.empty": errors.categoryNameRequired,
        "any.required": errors.categoryNameRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
