import { combineReducers } from 'redux'

import NoteReducer from './note'
import PermissionReducer from './permission'
import UserReducer from './user'

export default combineReducers({
  Note: NoteReducer,
  Permission: PermissionReducer,
  User: UserReducer
})
