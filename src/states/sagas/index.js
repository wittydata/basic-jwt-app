import { all, fork } from 'redux-saga/effects'

import watchNote from './note'
import watchUser from './user'

export default function * root () {
  yield all([
    fork(watchNote),
    fork(watchUser)
  ])
}
