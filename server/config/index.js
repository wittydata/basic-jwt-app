const { npm_package_name: appName, NODE_ENV, PORT } = process.env
const isDev = NODE_ENV === 'development'
const port = parseInt(PORT, 10) || 3000
const logLevel = isDev ? 'trace' : 'info'

module.exports = {
  appName,
  logLevel,
  port
}
