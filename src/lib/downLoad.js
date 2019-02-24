const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2018-10-16' });

const download = async ({Bucket, Key}) => {
  return new Promise ((resolve, reject) => {
    s3.getObject({
      Bucket,
      Key,
    }, (err, data) => {
      if(err) reject(err)
      resolve(data)
    })
  })
}

module.exports = download
  