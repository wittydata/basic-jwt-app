import { FETCHING_NOTES, NOTES_FETCHED } from '../actions/note'

const INITIAL_STATE = {
  loading: true,
  notes: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_NOTES:
      return { ...state, loading: action.loading }
    case NOTES_FETCHED:
      return { ...state, ...handleNotesFetched(action) }
    default:
      return state
  }
}

function handleNotesFetched ({ loading, notes }) {
  return { loading, notes }
}
