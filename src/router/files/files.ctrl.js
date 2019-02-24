const aws = require('aws-sdk')

const { s3With, transform, keyGenerator, DBConnection, supportImageTypes } = require('lib')
const { s3bucket } = require('mc_secret')
const fileModel = require('model/db/files')
const s3Url = require('../../../config/s3bucket')

aws.config.loadFromPath('./config/credentials.json')

const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: 'ap-northeast-2',
})

exports.upload = async (ctx) => {
  const { file: image } = ctx.req
  let { index, ...restBody } = ctx.req.body
  const { user } = ctx.session
  const { board_id } = ctx.params
  index = Number(index, 10)
  const filesKey = []
  const data = {
    image,
    board_id,
  }

  if(!image) {
    ctx.status = 500
    throw new Error('image empty')
  }

  try {
    const Key = keyGenerator(image)
    filesKey.push(Key)

    const params = {
      Bucket: s3bucket,
      Key,
      imageType: image.originalname.split('.').pop().toLowerCase(),
    }
    
    const thumbnail_keys = await transform(image.location, params)
    thumbnail_keys.forEach(data => {
      filesKey.push(data)
    })
    data.filesKey = filesKey
    params.Key = data.filesKey[1]

    delete params.imageType
    
    const connection = await DBConnection('writer')
    const insertId = await fileModel.insertImageForQuestion(connection, user, data)
    connection.release()

    ctx.body = {
      result: {
        image_info: {
          file_id: insertId,
          file_url: filesKey[2],
          index,
          ...restBody
        }
      }
    }
  } catch(e) {
    console.log(e)
    ctx.body = {
      result: {
        error: e,
        image_info: {
          index,
          ...restBody,
        }
      }
    }
  }
}

exports.delete = async(ctx) => {
  const { user } = ctx.session
  const {board_id } = ctx.params
  
  if (user.user_id === 0) {
    respondOnError(ctx, codes.ACCESS_DENIED_FOR_USER, '', 403, user)
    return
  }

  const connection = await DBConnection('writer')
  try {
    const deleteResult = await fileModel.insertImageForQuestion(connection, user, data)
    if (deleteResult.affectedRows === 0) {
      ctx.status = 404
      throw new Error('doesn\'t have delete data')
    }
  } catch(e) {
    ctx.body = e
  } finally {
    connection.release()
  }
}
