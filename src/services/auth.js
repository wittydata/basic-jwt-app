import { localStorage, notification, request } from '../util'

const url = '/api/'

export default {
  getCurrentToken () {
    return localStorage.getItem('token')
  },
  getCurrentUser () {
    return localStorage.getObject('user')
  },
  isSignedIn () {
    const token = localStorage.getItem('token')
    return token && typeof token === 'string' && token.length > 0
  },
  resetPassword (email) {
    try {
      const result = request(url + 'reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      return result
    } catch (e) {
      console.error(e)
    }
  },
  signIn (email, password, newPassword, rememberMe) {
    try {
      const result = request(url + 'login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, newPassword, rememberMe })
      })
      return result
    } catch (e) {
      console.error(e)
    }
  },
  signOut () {
    try {
      const token = this.getCurrentToken()
      const result = request(url + 'logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      return result
    } catch (e) {
      console.error(e)
    }
  },
  unauthorizeAction (redirectPath, duration, callback) {
    if (typeof callback === 'function') {
      callback()
    } else {
      redirectPath = typeof redirectPath === 'string' ? redirectPath : '/'
      duration = typeof duration === 'number' ? duration : 3000
      notification.show('error', 'You do not have permission to perform this action.')
      setTimeout(() => window.location.replace(redirectPath), duration)
    }
  }
}
