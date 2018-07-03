import React, { Component } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { fetchUsers } from '../../../states/actions/user'
import { roleService, userService } from '../../../services'
import notification from '../../../util/notification'

// UI
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import Switch from 'antd/lib/switch'
import 'antd/lib/button/style/css'
import 'antd/lib/form/style/css'
import 'antd/lib/input/style/css'
import 'antd/lib/modal/style/css'
import 'antd/lib/select/style/css'
import 'antd/lib/switch/style/css'
import './styles.css'

const FormItem = Form.Item
const Option = Select.Option

class UserModal extends Component {
  constructor (props) {
    super(props)
    const { user, title, visible } = props
    this.state = {
      loading: false,
      roles: [],
      title,
      user,
      visible
    }
    this.checkEmail = debounce(this.checkEmail, 500)
    this.findRoles = debounce(this.findRoles, 500)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { user, title, visible } = nextProps
    return { ...prevState, user, title, visible }
  }

  componentDidMount () {
    this.findRoles()
  }

  render () {
    const { form } = this.props
    const { loading, roles, title, user, visible } = this.state
    const { getFieldDecorator } = form

    return (
      <Modal
        footer={[
          <Button key='close' loading={loading} onClick={this.handleClose}>Close</Button>,
          <Button key='save' loading={loading} onClick={this.handleSave} type='primary'>Save</Button>
        ]}
        onCancel={this.handleClose}
        onOk={this.handleSave}
        title={title}
        visible={visible}
      >
        <Form layout='vertical'>
          <FormItem label='Name'>
            {getFieldDecorator('name', {
              initialValue: user.name,
              rules: [
                { min: 2, message: 'Name must be between 2 and 128 characters' },
                { max: 128, message: 'Name must be between 2 and 128 characters' },
                { required: true, message: 'Please enter name' },
                { whitespace: true, message: 'Please enter name' }
              ]
            })(
              <Input
                autoFocus
                placeholder='Name'
                tabIndex='1'
              />
            )}
          </FormItem>

          <FormItem label='E-mail'>
            {getFieldDecorator('email', {
              initialValue: user.email,
              rules: [
                { required: true, message: 'Please enter e-mail' },
                { whitespace: true, message: 'Please enter e-mail' },
                { validator: this.checkEmail }
              ]
            })(
              <Input
                placeholder='E-mail'
                tabIndex='2'
              />
            )}
          </FormItem>

          <FormItem label='Password'>
            {getFieldDecorator('password', {
              rules: [
                { validator: this.checkPassword }
              ]
            })(
              <Input
                placeholder='Password'
                tabIndex='3'
                type='password'
              />
            )}
          </FormItem>

          <FormItem label='Role'>
            {getFieldDecorator('role', {
              initialValue: user.role,
              rules: [
                { required: true, message: 'Please enter role' }
              ]
            })(
              <Select
                showSearch
              >
                {roles.map(({ name }) => (
                  <Option key={name}>{name}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label='Active'>
            {getFieldDecorator('active', {
              initialValue: typeof user.active === 'boolean' ? user.active : true,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren='Yes' unCheckedChildren='No' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  checkEmail = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value.trim().length > 0) {
        const { user } = this.state
        const { email } = user
        const response = await userService.checkEmail(value)

        if (response.exists !== false && email !== value) {
          callback(new Error('E-mail already exists'))
        }
      }

      callback()
    })
  }

  checkPassword = (rule, value, callback) => {
    if (value && value.length > 0) {
      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/.test(value)) {
        callback(new Error('Please enter at least 1 number, 1 lowercase letter and 1 uppercase letter'))
      }

      if (value.length < 8) {
        callback(new Error('Please enter at least 8 characters'))
      }
    }

    callback()
  }

  handleClose = () => {
    const { loading } = this.state

    if (!loading) {
      const { form, handleHideModal } = this.props
      const { resetFields } = form
      resetFields()
      handleHideModal()
    }
  }

  handleSave = () => {
    const { form } = this.props
    const { validateFields } = form

    validateFields(async (errors, values) => {
      if (!errors) {
        try {
          this.setState({ loading: true })
          const { user } = this.state
          const { _id } = user
          let response

          if (_id) {
            response = await userService.save(_id, values)
          } else {
            response = await userService.add(values)
          }

          if (response._id) {
            const { fetchUsers } = this.props
            notification.show('success', 'Saved successfully', 'User saved successfully.')
            fetchUsers()

            if (!_id) {
              const { form, handleHideModal } = this.props
              const { resetFields } = form
              resetFields()
              handleHideModal()
            }
          }

          this.setState({ loading: false })
        } catch (e) {
          notification.show('error', 'Unable to save successfully', 'Unable to save user successfully.')
          this.setState({ loading: false })
        }
      }
    })
  }

  async findRoles (text) {
    const roles = await roleService.find(text)
    this.setState({ roles })
  }
}

const mapDispatchToProps = {
  fetchUsers
}

const mapStateToProps = (state) => {
  return state
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(UserModal))
