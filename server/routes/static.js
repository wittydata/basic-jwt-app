const Router = require('koa-router')
const path = require('path')
const send = require('koa-send')

const router = new Router()

router.get([
  '/login',
  '/notes',
  '/notes/:id',
  '/users',
  '/users/:id',
  '/service-worker.js'
], staticRouter)

async function staticRouter (ctx, next) {
  const { path: ctxPath } = ctx
  const pages = [
    '/login',
    '/notes',
    '/users'
  ]

  if (ctxPath.includes('/service-worker.js')) {
    await send(ctx, path.join('build', 'service-worker.js'))
    return
  }

  for (let i = 0; i < pages.length; i++) {
    if (ctxPath.indexOf(pages[i]) === 0) {
      await send(ctx, path.join('build', 'index.html'))
      return
    }
  }

  await next()
}

module.exports = router
