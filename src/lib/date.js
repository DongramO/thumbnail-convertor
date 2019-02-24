const moment = require('moment')

module.exports = {
  YEAR: moment().format('YYYY'),
  MONTH: moment().format('MM'),
  DAY: moment().format('DD'),
}