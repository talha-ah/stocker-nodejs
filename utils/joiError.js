const { CustomError } = require("../utils/customError")

function joiError({ error, value }) {
  if (error) {
    const { details } = error
    const data = {}
    const message = details
      .map((i) => {
        data[i.context.key] = i.message
        return i.message
      })
      .join(",")

    throw new CustomError(message, 405, data)
  }
  return value
}

module.exports = {
  joiError,
}
