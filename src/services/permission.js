import { localStorage, request } from '../util'

const url = '/private/api/permissions/'

export default {
  canPerform (actions, permissions, any = true) {
    if (permissions.length < 1) {
      permissions = localStorage.getObject('permissions', [])
    }

    if (Array.isArray(actions)) {
      if (any) {
        // Return true if any of the action matches
        return actions.find((action) => permissions.indexOf(action) > -1)
      }

      // Return true only if all of the action matches
      return actions.every((action) => permissions.indexOf(action) > -1)
    } else if (typeof actions === 'string') {
      return permissions.indexOf(actions) > -1
    }

    return false
  },
  list () {
    return request(url)
  }
}
