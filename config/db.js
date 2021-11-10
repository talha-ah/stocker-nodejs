const mongoose = require("mongoose")

function connect() {
  return new Promise((resolve, reject) => {
    // Connecting to Database
    mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = connect
