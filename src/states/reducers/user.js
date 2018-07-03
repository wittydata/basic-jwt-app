import { FETCHING_USERS, USERS_FETCHED } from '../actions/user'

const INITIAL_STATE = {
  loading: true,
  users: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_USERS:
      return { ...state, loading: action.loading }
    case USERS_FETCHED:
      return { ...state, ...handleUsersFetched(action) }
    default:
      return state
  }
}

function handleUsersFetched ({ loading, users }) {
  return { loading, users }
}
