import { request } from '../util'

const headers = { 'Content-Type': 'application/json' }
const url = '/api/notes/'

export default {
  add (values) {
    return request(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(values)
    })
  },
  get (id) {
    return request(url + id)
  },
  remove (id) {
    return request(url + id, {
      method: 'DELETE',
      headers
    })
  },
  save (id, values) {
    return request(url + id, {
      method: 'PUT',
      headers,
      body: JSON.stringify(values)
    })
  },
  list () {
    return request(url)
  }
}
