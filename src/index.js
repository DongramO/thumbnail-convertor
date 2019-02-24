// Koa Pacakge
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const session = require('koa-session')
const serve = require('koa-static')
const path = require('path')
const error = require('koa-json-error')

// For Swagger
const { web } = require('./mc_secret')
const files =  require('./router/files/index.js');

const router = new Router()
const app = new Koa()

// Koa Configure
app.use(serve(path.join(__dirname, 'public')))
app.use(koaBody({
  formLimit: '20mb',
  jsonLimit: '20mb',
  textLimit: '20mb',
}))

// Setting for CORS
app.use((ctx, next) => {
  const { allowedHosts } = web
  const { origin } = ctx.header

  if (process.env.NODE_ENV !== 'development') {
    allowedHosts.every(el => {
      if (!origin) return false
      if (origin.indexOf(el) !== -1) {
        ctx.response.set('Access-Control-Allow-Origin', origin)
        return false
      }
      return true
    })

    if (origin === 'null') {
      ctx.response.set('Access-Control-Allow-Origin', '*')
    }
  } else {
    ctx.response.set('Access-Control-Allow-Origin', '*')
  }
  ctx.set('Access-Control-Allow-Credentials', process.env.NODE_ENV !== 'development')
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, x-timebase, Link, MC-CORS-unlock, MC-Session-Token, MC-Access-Token, MC-Version')
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS, PUT')
  ctx.set('Access-Control-Expose-Headers', 'Link')
  return next()
})


router.use('/files', files.routes());
router.get('/health', (ctx) => {
  ctx.body = {
    version: '1.0.0',
    origin: ctx.origin,
    env: ctx.request,
  };
  console.log(ctx.body)
});

// To do => server session 파기를 위한 대체 방법 찾기.
app.keys = ['some secret hurr']
const CONFIG = {
  key: 'mc_se',
  maxAge: 30000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
}

app.use(session(CONFIG, app))
app.use(router.allowedMethods())
app.use(router.routes())

app.use(error((err) => {
  return {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' && err.stack.split('\n'),
  }
}))

app.listen(web.port, async () => {
  console.log(`server port [${web.domainUrl}], server is running now!`)
})

module.exports = app
