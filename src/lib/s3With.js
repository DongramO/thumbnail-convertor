const aws = require('aws-sdk');
const urlencode = require('urlencode')

aws.config.loadFromPath('./config/credentials.json')
const s3 = new aws.S3();

exports.getSignedUrl = (s3Options, image) => {
  return new Promise((resolve, reject) => {
    const options = {
      ResponseContentDisposition: `attachment; filename*=UTF-8''${urlencode.encode(image.originalname)}`,
      ...s3Options,
    }
    s3.getSignedUrl('getObject', options, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

exports.download = async (params) => {
  return new Promise ((resolve, reject) => {
    s3.geturl(options, (err, data) => {
      if(err) reject(err)
      resolve(data)
    })
  })
}

exports.upload = (Body, Bucket, Key, ContentType) => {
  return new Promise((resolve, reject) => {
    s3.putObject({ Bucket, Key, Body, ContentType, ACL: 'public-read-write' },(err, value) => {
      if(err) reject(err)
      else resolve(value)
    });
  })
}

  