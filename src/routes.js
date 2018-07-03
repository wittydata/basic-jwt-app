import Home from './containers/Home'
import NoteList from './containers/Note/List'
import UserList from './containers/User/List'

export const routes = [
  {
    component: Home,
    exact: true,
    menu: true,
    name: 'Home',
    path: '/'
  },
  {
    component: NoteList,
    exact: true,
    menu: true,
    name: 'Notes',
    path: '/notes',
    actions: 'listNotes'
  },
  {
    component: UserList,
    exact: true,
    menu: true,
    name: 'Users',
    path: '/users',
    actions: 'listUsers'
  }
]
