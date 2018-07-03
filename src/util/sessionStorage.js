// Wrapper for window.sessionStorage with added features
const storage = window.sessionStorage

export default {
  clear () {
    return storage.clear()
  },
  getItem (key) {
    return storage.getItem(key)
  },
  getObject (key, defaultValue = {}) {
    const item = storage.getItem(key)

    if (item) {
      return JSON.parse(item)
    }

    return defaultValue
  },
  removeItem (key) {
    return storage.removeItem(key)
  },
  removeObject (key) {
    return storage.removeItem(key)
  },
  setItem (key, value) {
    return storage.setItem(key, value)
  },
  setObject (key, value) {
    return storage.setItem(key, JSON.stringify(value))
  }
}
