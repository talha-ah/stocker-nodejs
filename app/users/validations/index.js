const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/joiError")

const schemas = {
  checkId: (data) => {
    const Validation = Joi.object().keys({
      id: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  createOne: (data) => {
    const Validation = Joi.object().keys({
      first_name: Joi.string().required().messages({
        "string.empty": errors.firstNameRequired,
        "any.required": errors.firstNameRequired,
      }),
      email: Joi.string()
        .optional()
        .allow("")
        .email({ tlds: { allow: false } })
        .messages({
          "string.email": errors.emailInvalid,
        }),
      phone: Joi.string().optional().allow("").messages({}),
      address_one: Joi.string().optional().allow(""),
      description: Joi.string().optional().allow(""),
    })

    return joiError(Validation.validate(data))
  },
  updateOne: (data) => {
    const Validation = Joi.object().keys({
      id: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      first_name: Joi.string().required().messages({
        "string.empty": errors.firstNameRequired,
        "any.required": errors.firstNameRequired,
      }),
      email: Joi.string()
        .optional()
        .allow("")
        .email({ tlds: { allow: false } })
        .messages({
          "string.email": errors.emailInvalid,
        }),
      phone: Joi.string().optional().allow("").messages({}),
      address_one: Joi.string().optional().allow(""),
      description: Joi.string().optional().allow(""),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
