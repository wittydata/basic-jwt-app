const { NODE_ENV } = process.env
const isDev = NODE_ENV !== 'production'
const apiHostname = isDev ? '' : 'http://api.domain.com'

export {
  apiHostname
}
