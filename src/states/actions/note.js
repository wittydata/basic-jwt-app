export const FETCH_NOTES = 'FETCH_NOTES'
export const FETCHING_NOTES = 'FETCHING_NOTES'
export const NOTES_FETCHED = 'NOTES_FETCHED'

export const fetchNotes = (loading) => {
  loading = typeof loading === 'boolean' ? loading : true
  return {
    type: FETCH_NOTES,
    loading
  }
}

export const fetchingNotes = () => {
  return {
    type: FETCHING_NOTES,
    loading: true
  }
}

export const notesFetched = (notes) => {
  notes = Array.isArray(notes) ? notes : []
  return {
    type: NOTES_FETCHED,
    notes
  }
}
