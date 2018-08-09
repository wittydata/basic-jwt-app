import { request } from '../util'

const url = '/private/api/roles/'

export default {
  find (text = '') {
    return request(`${url}find/${text}`)
  }
}
