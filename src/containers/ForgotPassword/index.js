import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import authService from '../../services/auth'
import { permissionsFetched } from '../../states/actions/permission'
import { localStorage, notification, sessionStorage } from '../../util'

// UI
import Alert from 'antd/lib/alert'
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import 'antd/lib/alert/style/css'
import 'antd/lib/button/style/css'
import 'antd/lib/form/style/css'
import 'antd/lib/icon/style/css'
import 'antd/lib/input/style/css'
import './styles.css'

const FormItem = Form.Item

class ForgotPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: {
        show: false
      },
      resetPassword: false,
      loading: false
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { alert, resetPassword, loading } = this.state

    return (
      <div className='wd-forgot'>
        <div className='container'>
          <div>
            {alert.show ? (
              <Alert
                className='alert'
                message={alert.message}
                type={alert.type}
                showIcon
              />
            ) : null}
          </div>

          <Form className='form'>
            <div style={resetPassword ? { display: 'none' } : {}}>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Please enter your e-mail' }]
                })(
                  <Input
                    autoFocus
                    onKeyPress={this.handleResetPassword}
                    placeholder='E-mail'
                    prefix={<Icon type='mail' />}
                    readOnly={resetPassword || loading}
                  />
                )}
              </FormItem>
            </div>

            {resetPassword ? (
              <div>
                <FormItem label='Enter your temporary password' />

                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please enter your temporary password' }]
                  })(
                    <Input
                      autoFocus
                      onKeyPress={this.handleConfirmPassword}
                      placeholder='Temporary Password'
                      prefix={<Icon type='safety' />}
                      readOnly={loading}
                      type='password'
                    />
                  )}
                </FormItem>

                <FormItem label='Enter your new password' />

                <FormItem>
                  {getFieldDecorator('newPassword', {
                    rules: [
                      { required: true, message: 'Please enter your new password' },
                      { validator: this.checkConfirm }
                    ]
                  })(
                    <Input
                      onKeyPress={this.handleConfirmPassword}
                      placeholder='New Password'
                      prefix={<Icon type='lock' />}
                      readOnly={loading}
                      type='password'
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('confirmPassword', {
                    rules: [
                      { required: true, message: 'Please re-enter your new password to confirm' },
                      { validator: this.checkPassword }
                    ]
                  })(
                    <Input
                      onKeyPress={this.handleConfirmPassword}
                      placeholder='Confirm New Password'
                      prefix={<Icon type='lock' />}
                      readOnly={loading}
                      type='password'
                    />
                  )}
                </FormItem>

                <FormItem>
                  <Button className='button' disabled={loading} onClick={this.handleConfirmPassword} type='primary'>
                    Confirm
                  </Button>
                </FormItem>

                <FormItem>
                  <Button className='button button-cancel' onClick={this.handleCancelConfirmPassword}>
                    Cancel
                  </Button>
                </FormItem>
              </div>
            ) : (
              <FormItem>
                <Button className='button' disabled={loading} onClick={this.handleResetPassword} type='primary'>
                  Reset Password
                </Button>

                <div className='login'>
                  <Link to='/login'>Sign in</Link>
                </div>
              </FormItem>
            )}
          </Form>
        </div>
      </div>
    )
  }

  checkConfirm = (rule, value, callback) => {
    const { validateFields } = this.props.form

    if (value && value.length > 0) {
      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/.test(value)) {
        callback(new Error('Please enter at least 1 number, 1 lowercase letter and 1 uppercase letter'))
      }

      if (value.length < 8) {
        callback(new Error('Please enter at least 8 characters'))
      }
    }

    if (value) {
      validateFields(['confirmPassword'], { force: true })
    }

    callback()
  }

  checkPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form

    if (value && value !== getFieldValue('newPassword')) {
      callback(new Error('Your confirm password does not match new password'))
    } else {
      callback()
    }
  }

  handleConfirmPassword = (e) => {
    if (this.isEnterKey(e) || this.isMouseClick(e)) {
      const { form, history } = this.props
      const { validateFields } = form

      validateFields(async (errors, values) => {
        if (!errors) {
          const { email, password, newPassword } = values
          this.setState({ loading: true })

          try {
            const response = await authService.signIn(email, password, newPassword)
            const { permissions, token, user } = response
            permissionsFetched(permissions)
            localStorage.setItem('redirected', false)
            localStorage.setItem('rememberMe', false)
            localStorage.setItem('token', token)
            localStorage.setObject('permissions', permissions)
            localStorage.setObject('user', user)
            sessionStorage.removeItem('tokenExpired')
            sessionStorage.removeItem('tokenRevoked')
            sessionStorage.removeItem('unauthorized')
            this.setState({ loading: false })
            history.replace('/')
          } catch (e) {
            notification.show('error', 'Unable to confirm successfully', 'Unable to confirm password successfully. Please try again later.')
            this.setState({ loading: false })
          }
        }
      })
    }
  }

  handleCancelConfirmPassword = () => {
    this.hideAlert()
    this.props.form.resetFields()
    this.setState({ resetPassword: false })
  }

  handleResetPassword = (e) => {
    if (this.isEnterKey(e) || this.isMouseClick(e)) {
      const { validateFields } = this.props.form
      const { alert } = this.state
      alert.show = false
      this.setState({ alert })
      validateFields(async (errors, values) => {
        if (!errors) {
          const { email } = values
          this.setState({ loading: true })

          try {
            const response = await authService.resetPassword(email)

            if (response) {
              const { email } = response
              const alert = {
                message: <span>You new temporary password is successfully sent to <b style={{ color: '#000' }}>{email}</b>.</span>,
                show: true,
                type: 'success'
              }
              this.setState({ alert, resetPassword: true, loading: false })
            }
          } catch (e) {
            const { response } = e

            if (response) {
              const { errors } = response
              alert.message = errors[0].message
              alert.type = 'error'
            }

            alert.show = true
            this.setState({ alert, loading: false })
          }
        }
      })
    }
  }

  hideAlert () {
    const { alert } = this.state
    alert.show = false
    this.setState({ alert })
  }

  isEnterKey (e) {
    return e && e.key === 'Enter'
  }

  isMouseClick (e) {
    return e && e.key === undefined && e.currentTarget.tagName.toLowerCase() === 'button'
  }
}

const mapDispatchToProps = {
  permissionsFetched
}

const mapStateToProps = (state) => {
  return state
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(ForgotPassword))
