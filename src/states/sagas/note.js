import { put, takeLatest } from 'redux-saga/effects'
import { FETCH_NOTES, FETCHING_NOTES, NOTES_FETCHED } from '../actions/note'
import noteService from '../../services/note'

function * fetchNotes ({ loading }) {
  try {
    yield put({ type: FETCHING_NOTES, loading })
    const notes = yield noteService.list()
    yield put({ type: NOTES_FETCHED, loading: false, notes })
  } catch (e) {
    yield put({ type: NOTES_FETCHED, notes: [] })
  }
}

function * watchNote () {
  yield takeLatest(FETCH_NOTES, fetchNotes)
}

export default watchNote
