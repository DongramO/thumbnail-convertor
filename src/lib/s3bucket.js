const aws = require('aws-sdk')
const multer = require('koa-multer')
const multerS3 = require('multer-s3')
const shortid = require('shortid')
const moment = require('moment')
const { s3bucket } = require('../mc_secret')
const _ = require('lodash')

aws.config.loadFromPath('./config/credentials.json')

const s3 = new aws.S3()

module.exports = {
  multer: (which, options = {}) => {
    const date = {
      YYYY: moment().format('YYYY'),
      MM: moment().format('MM'),
    }
    let opt = {
      s3,
      bucket: s3bucket,
      CacheControl: 'max-age = 31536000',
      acl: 'public-read-write',
      key(req, file, cb) {
        cb(null, `${which}/${date.YYYY}/${date.MM}/${shortid.generate()}.${Date.now()}.${file.originalname.split('.').pop()}`)
      },
    }
    if (which === 'boards') {
      opt = _.defaultsDeep({
        ...options,
        acl: 'public-read-write',
        key(req, file, cb) {
          cb(null, `${which}/${date.YYYY}/${date.MM}/${shortid.generate()}.${Date.now()}.${file.originalname.split('.').pop()}`)
        },
      }, opt)
    } else { }
    return multer({ storage: multerS3(opt) })
  },
}
