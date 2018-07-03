import { request } from '../util'

const url = '/api/roles/'

export default {
  find (text = '') {
    return request(`${url}find/${text}`)
  }
}
