import { put, takeLatest } from 'redux-saga/effects'
import { FETCH_USERS, FETCHING_USERS, USERS_FETCHED } from '../actions/user'
import userService from '../../services/user'

function * fetchUsers ({ loading }) {
  try {
    yield put({ type: FETCHING_USERS, loading })
    const users = yield userService.list()
    yield put({ type: USERS_FETCHED, loading: false, users })
  } catch (e) {
    yield put({ type: USERS_FETCHED, users: [] })
  }
}

function * watchUser () {
  yield takeLatest(FETCH_USERS, fetchUsers)
}

export default watchUser
