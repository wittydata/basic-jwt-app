import 'whatwg-fetch'

import { apiHostname } from '../config'
import localStorage from './localStorage'
import sessionStorage from './sessionStorage'

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (url, options = {}) {
  if (url.startsWith('/private')) {
    const { headers = {} } = options
    options.headers = Object.assign({ 'Authorization': `Bearer ${localStorage.getItem('token')}` }, headers)
  }

  async function handleError (response) {
    const { status } = response

    if ((status >= 200 && status < 300)) {
      return response.json()
    } else if (status === 400) {
      const error = new Error(`${response.status} ${response.statusText}`)
      const jsonResponse = await response.json()
      error.response = jsonResponse
      throw error
    } else {
      console.error(response)
      throw response
    }
  }

  async function handleRefresh (response) {
    try {
      if (response.tokenRefreshed) {
        const { token } = response
        const { headers = {} } = options
        localStorage.setItem('token', token)
        options.headers = Object.assign({ 'Authorization': `Bearer ${token}` }, headers)
        return fetch(`${apiHostname}${url}`, Object.assign({ credentials: 'same-origin' }, options))
          .then(handleSession)
          .then(handleRefresh)
      }

      return response
    } catch (e) {
      console.error(e)
    }
  }

  async function handleSession (response) {
    const { status } = response

    if (status === 401) {
      try {
        const jsonResponse = await response.json()

        if (jsonResponse.tokenExpired) {
          sessionStorage.setItem('tokenExpired', true)
          window.location.href = '/login'
          return {}
        } else if (jsonResponse.tokenRevoked) {
          sessionStorage.setItem('tokenRevoked', true)
          window.location.href = '/login'
          return {}
        } else if (jsonResponse.unauthorized) {
          sessionStorage.setItem('unauthorized', true)
          window.location.href = '/login'
          return {}
        }

        return jsonResponse
      } catch (e) {
        console.error(e)
      }
    }

    return response
  }

  return fetch(`${apiHostname}${url}`, Object.assign({ credentials: 'same-origin' }, options))
    .then(handleSession)
    .then(handleRefresh)
    .then(handleError)
}
