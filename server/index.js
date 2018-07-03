const Koa = require('koa')
const logger = require('koa-logger')
const path = require('path')
const serve = require('koa-static')

const { appName, port } = require('./config')
const log = require('./config/log')
const routes = require('./routes')

const app = module.exports = new Koa()

app
  .use(logger())
  .use(serve(path.join('build')))
  .use(routes.routes())
  .use(routes.allowedMethods())
  .listen(port, () => log.info(appName, 'listening on port', port))
