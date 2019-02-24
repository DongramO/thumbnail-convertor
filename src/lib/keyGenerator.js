const moment = require('moment')
const shortid = require('shortid')
const { YYYY, DD, MM } = require('./date')

const keyGenerator = (image) => `boards/service/${YEAR}/${MONTH}/${shortid.generate()}.${image.originalname.split('.').pop()}`

module.exports = {
  keyGenerator
}
