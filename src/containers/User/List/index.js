import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUsers, fetchingUsers, usersFetched } from '../../../states/actions/user'
import { userService, permissionService } from '../../../services'
import notification from '../../../util/notification'
import UserModal from '../Modal'

// UI
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import List from 'antd/lib/list'
import Popconfirm from 'antd/lib/popconfirm'
import Tag from 'antd/lib/tag'
import Tooltip from 'antd/lib/tooltip'
import 'antd/lib/button/style/css'
import 'antd/lib/icon/style/css'
import 'antd/lib/list/style/css'
import 'antd/lib/popconfirm/style/css'
import 'antd/lib/tag/style/css'
import 'antd/lib/tooltip/style/css'
import './styles.css'

const ListItem = List.Item
const ListItemMeta = ListItem.Meta
const ModalTitle = {
  ADD: 'Add User',
  EDIT: 'Edit User'
}

class User extends Component {
  constructor (props) {
    super(props)
    const { loading, users } = props
    this.state = {
      loading,
      modal: { user: {}, title: ModalTitle.ADD, visible: false },
      users
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { loading, users } = nextProps
    return { ...prevState, loading, users }
  }

  componentDidMount () {
    const { fetchUsers } = this.props
    fetchUsers()
  }

  render () {
    const { loading, modal, users } = this.state

    return (
      <div className='wd-user-list'>
        {this.canPerform('createUser') ? (
          <h2><Button onClick={this.handleShowAddModal()} type='primary'>Add User</Button></h2>
        ) : null}

        <List
          dataSource={users}
          itemLayout='horizontal'
          loading={loading}
          renderItem={(user) => {
            const { _id, active, email, name, role } = user
            return (
              <ListItem actions={[
                <Tooltip
                  placement='bottom'
                  title='Edit User'
                >
                  <Button onClick={this.handleShowEditModal(user)}><Icon type='edit' /></Button>
                </Tooltip>,
                <Tooltip
                  placement='bottom'
                  title='Remove User'
                >
                  <Popconfirm
                    cancelText='No'
                    okText='Yes'
                    onConfirm={this.handleDelete(_id)}
                    placement='topRight'
                    title='Are you sure you want to remove this user?'
                  >
                    <Button type='danger'><Icon type='delete' /></Button>
                  </Popconfirm>
                </Tooltip>
              ]}>
                <ListItemMeta
                  title={<Link onClick={this.handleShowEditModal(user)} to='#'>{name}</Link>}
                  description={email}
                />

                <div className='extra'>
                  <div className='role'>{role}</div>

                  <div className='active'>
                    <Tag color={active === true ? '#1890ff' : '#f5222d'}>
                      {active === true ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                </div>
              </ListItem>
            )
          }}
        />

        <UserModal {...modal} />
      </div>
    )
  }

  handleDelete = (_id) => async () => {
    try {
      const { fetchingUsers } = this.props
      fetchingUsers()
      const response = await userService.remove(_id)

      if (response._id) {
        const { usersFetched } = this.props
        const { users } = this.state
        notification.show('success', 'Removed successfully', 'User removed successfully.')
        usersFetched(users.filter((user) => user._id !== _id))
      }
    } catch (e) {
      notification.show('error', 'Unable to remove successfully', 'Unable to remove user successfully.')
    }
  }

  handleHideModal = () => {
    this.setModal({}, ModalTitle.ADD, false)
  }

  handleShowAddModal = () => (e) => {
    this.handleShowModal(e, {}, false)
  }

  handleShowEditModal = (user) => (e) => {
    this.handleShowModal(e, user, true)
  }

  handleShowModal = (e, user, edit) => {
    edit = typeof edit === 'boolean' ? edit : false
    const title = edit ? ModalTitle.EDIT : ModalTitle.ADD
    e.preventDefault()
    e.stopPropagation()
    this.setModal(user, title, true)
  }

  setModal (user, title, visible) {
    this.setState({ modal: { user, title, visible, handleHideModal: this.handleHideModal } })
  }

  canPerform (actions) {
    const { permissions } = this.props
    return permissionService.canPerform(actions, permissions)
  }
}

const mapDispatchToProps = {
  fetchUsers,
  fetchingUsers,
  usersFetched
}

const mapStateToProps = (state) => {
  const { User, Permission } = state
  return { ...User, ...Permission }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
