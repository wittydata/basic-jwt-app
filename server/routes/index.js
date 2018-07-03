const Router = require('koa-router')

const staticRouter = require('./static')

const router = new Router()

router
  .use(staticRouter.routes(), staticRouter.allowedMethods())

module.exports = router
