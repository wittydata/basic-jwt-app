import { PERMISSIONS_FETCHED } from '../actions/permission'

const INITIAL_STATE = {
  permissions: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PERMISSIONS_FETCHED:
      return { ...state, permissions: action.permissions }
    default:
      return state
  }
}
