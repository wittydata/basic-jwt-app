export const FETCH_USERS = 'FETCH_USERS'
export const FETCHING_USERS = 'FETCHING_USERS'
export const USERS_FETCHED = 'USERS_FETCHED'

export const fetchUsers = (loading) => {
  loading = typeof loading === 'boolean' ? loading : true
  return {
    type: FETCH_USERS,
    loading
  }
}

export const fetchingUsers = () => {
  return {
    type: FETCHING_USERS,
    loading: true
  }
}

export const usersFetched = (users) => {
  const { list } = users
  users = Array.isArray(list) ? users : { list: [] }
  return {
    type: USERS_FETCHED,
    users
  }
}
