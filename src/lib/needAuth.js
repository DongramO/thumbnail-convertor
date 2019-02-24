const empty = require('is-empty')

const token = require('./token')
const { aesKey, account } = require('../mc_secret')

module.exports = async (ctx, next) => {
  const webToken = ctx.request.headers['mc-session-token']
  try {
    if (webToken === 'testMonitoring') {
      ctx.session = {
        user: account.testMonitoring
      }
      return next()
    } 
    if (webToken === 'false') {
      ctx.session.user = { user_id: 0 }
    } else {
      ctx.session.user = await token.decode(webToken, aesKey)
      
      if (empty(ctx.session.user)) {
        throw new Error('권한없음')
      }
    }
    return await next()

  } catch (e) {
    throw new Error(e)
    return next()
  }
}
