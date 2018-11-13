import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { fetchNotes, fetchingNotes, notesFetched } from '../../../states/actions/note'
import { noteService, permissionService } from '../../../services'
import notification from '../../../util/notification'
import NoteModal from '../Modal'

// UI
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import List from 'antd/lib/list'
import Popconfirm from 'antd/lib/popconfirm'
import Tooltip from 'antd/lib/tooltip'
import 'antd/lib/button/style/css'
import 'antd/lib/icon/style/css'
import 'antd/lib/list/style/css'
import 'antd/lib/popconfirm/style/css'
import 'antd/lib/tooltip/style/css'
import './styles.css'

const ListItem = List.Item
const ListItemMeta = ListItem.Meta
const ModalTitle = {
  ADD: 'Add Note',
  EDIT: 'Edit Note'
}

class Note extends Component {
  constructor (props) {
    super(props)
    const { loading, notes } = props
    this.state = {
      loading,
      modal: { note: {}, title: ModalTitle.ADD, visible: false },
      notes
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { loading, notes } = nextProps
    return { ...prevState, loading, notes }
  }

  componentDidMount () {
    const { fetchNotes } = this.props
    fetchNotes()
  }

  render () {
    const { loading, modal, notes } = this.state

    return (
      <div className='wd-note-list'>
        {this.canPerform('createNote') ? (
          <h2><Button onClick={this.handleShowAddModal()} type='primary'>Add Note</Button></h2>
        ) : null}

        <List
          dataSource={notes}
          itemLayout='horizontal'
          loading={loading}
          renderItem={(note) => {
            const { _id, content, title, updatedAt } = note
            return (
              <ListItem actions={[
                <Tooltip
                  placement='bottom'
                  title='Edit Note'
                >
                  <Button onClick={this.handleShowEditModal(note)}><Icon type='edit' /></Button>
                </Tooltip>,
                <Tooltip
                  placement='bottom'
                  title='Remove Note'
                >
                  <Popconfirm
                    cancelText='No'
                    okText='Yes'
                    onConfirm={this.handleDelete(_id)}
                    placement='topRight'
                    title='Are you sure you want to remove this note?'
                  >
                    <Button type='danger'><Icon type='delete' /></Button>
                  </Popconfirm>
                </Tooltip>
              ]}>
                <ListItemMeta
                  title={<Link onClick={this.handleShowEditModal(note)} to='#'>{title}</Link>}
                  description={content}
                />

                <div>{moment(updatedAt).format('D MMM YYYY h:mm:ss A')}</div>
              </ListItem>
            )
          }}
        />

        <NoteModal {...modal} />
      </div>
    )
  }

  handleDelete = (_id) => async () => {
    try {
      const { fetchingNotes } = this.props
      fetchingNotes()
      const response = await noteService.remove(_id)

      if (response._id) {
        const { notesFetched } = this.props
        const { notes } = this.state
        notification.show('success', 'Removed successfully', 'Note removed successfully.')
        notesFetched({ list: notes.filter((note) => note._id !== _id) })
      }
    } catch (e) {
      console.log(111, e)
      notification.show('error', 'Unable to remove successfully', 'Unable to remove note successfully.')
    }
  }

  handleHideModal = () => {
    this.setModal({}, ModalTitle.ADD, false)
  }

  handleShowAddModal = () => (e) => {
    this.handleShowModal(e, {}, false)
  }

  handleShowEditModal = (note) => (e) => {
    this.handleShowModal(e, note, true)
  }

  handleShowModal = (e, note, edit) => {
    edit = typeof edit === 'boolean' ? edit : false
    const title = edit ? ModalTitle.EDIT : ModalTitle.ADD
    e.preventDefault()
    e.stopPropagation()
    this.setModal(note, title, true)
  }

  setModal = (note, title, visible) => {
    this.setState({ modal: { note, title, visible, handleHideModal: this.handleHideModal } })
  }

  canPerform = (actions) => {
    const { permissions } = this.props
    return permissionService.canPerform(actions, permissions)
  }
}

const mapDispatchToProps = {
  fetchNotes,
  fetchingNotes,
  notesFetched
}

const mapStateToProps = (state) => {
  const { Note, Permission } = state
  return { ...Note, ...Permission }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Note)
