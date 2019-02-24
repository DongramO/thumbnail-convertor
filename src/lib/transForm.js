const gm = require('gm').subClass({ imageMagick: true });
const s3With = require('./s3With')
var streamToBuffer = require('stream-to-buffer')
const { sizeFromKey } = require('lib/thumbNail')

const resize = (imageOriginPath, resizeType, pixelSize, imageType) => {
  return new Promise(async (resolve, reject) => {
    try {
    if (resizeType === 'crop') {
        result = await resizeWithCrop(imageOriginPath, pixelSize, imageType)
      } else {
        result = await resizeWithAspectRatio(imageOriginPath, pixelSize, imageType)
      }
      resolve(result)
    } catch(e) {
      reject(e)
    }
  })
}

const resizeWithAspectRatio = (imageOriginPath, pixelSize, imageType) => {
  return new Promise((resolve, reject) => {
    gm(imageOriginPath)
      .autoOrient()
      .noProfile()
      .quality(95)
      .resize(pixelSize[0], pixelSize[1])
      .toBuffer(imageType, function(err, buffer) {
        if (err) reject(err)
        resolve(buffer)
      })
  })
}


const resizeWithCrop = (imageOriginPath, pixelSize, imageType) => {
  return new Promise((resolve, reject) => {
    let centerX =0; let centerY =0
    gm(imageOriginPath)
      .size(function(err, value) {
        centerX = (value.width/2)
        centerY = (value.height/2)
      })
      .autoOrient()
      .crop(centerX/4, centerY/4, centerX/2, centerY/2)
      .noProfile()
      .quality(95)
      .toBuffer(imageType, function(err, buffer) {
        if (err) reject(err)
        resolve(buffer)
      })
  })
}

const destKeyFromSrcKey = (key, suffix) => {
  return key.replace('service/', `thumbnail/${suffix}/`)
}

const resizeAndUpload = (imageOriginPath, size, {Key, Bucket, imageType}) => {
  return new Promise(async (resolve, reject) => {
    const pixelSize = size["size"];
    const resizeType = size["type"];
    try {
      const resizeBuffer = await resize(imageOriginPath, resizeType, pixelSize, imageType)
      const destKey = destKeyFromSrcKey(Key, size['alias'])
      await s3With.upload(resizeBuffer, Bucket, destKey, imageType)
      resolve(destKey)
    } catch (e) {
      reject(e)
    }
  })
}

const transform = (imageOriginPath, params) => {
  
  return new Promise(async (resolve, reject) => {
    try {
      const sizes = sizeFromKey(params.Key);
      if (!sizes) reject(new Error(`thumbnail type is undefined(allow articles or profiles), ${Key}`))
      else {
        const result = await Promise.all(sizes.map((size) => resizeAndUpload(imageOriginPath, size, params)))
        resolve(result)
      }
    } catch(e) {
      reject(e)
    }
  })
}

module.exports = transform
