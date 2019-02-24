const jwt = require('jsonwebtoken')

exports.decode = (token, secret) => {
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        resolve({})
      }
      resolve(decoded)
    })
  })
}
