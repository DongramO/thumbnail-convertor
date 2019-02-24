const s3Bucket = require('../config/s3bucket')
const aesKey = require('../config/aeskey')
const account = require('../config/account')
const web = require('../config/web')
const mysqlConfig = require('../config/database')

module.exports = {
  s3bucket: s3Bucket[process.env.NODE_ENV],
  aesKey: aesKey[process.env.NODE_ENV],
  web: web[process.env.NODE_ENV],
  mysql: mysqlConfig[process.env.NODE_ENV],
  account,
}
