const moment = require('moment')
const shortid = require('shortid')

const date = {
  YYYY: moment().format('YYYY'),
  MM: moment().format('MM'),
}
const keyGenerator = (image) => `boards/service/${date.YYYY}/${date.MM}/${shortid.generate()}.${Date.now()}.${image.originalname.split('.').pop()}`

module.exports = {
  keyGenerator
}
