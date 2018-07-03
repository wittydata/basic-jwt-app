import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import authService from '../../services/auth'
import { permissionsFetched } from '../../states/actions/permission'
import { localStorage, sessionStorage } from '../../util'

// UI
import Alert from 'antd/lib/alert'
import Button from 'antd/lib/button'
import Checkbox from 'antd/lib/checkbox'
import Form from 'antd/lib/form'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import 'antd/lib/alert/style/css'
import 'antd/lib/button/style/css'
import 'antd/lib/checkbox/style/css'
import 'antd/lib/form/style/css'
import 'antd/lib/icon/style/css'
import 'antd/lib/input/style/css'
import './styles.css'

const FormItem = Form.Item

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: {
        message: 'Incorrect e-mail and/or password.',
        show: false,
        type: 'error'
      },
      resetPassword: false,
      loading: false,
      tokenExpired: false,
      tokenRevoked: false,
      unauthorized: false
    }
  }

  componentDidMount () {
    const redirected = localStorage.getItem('redirected') === 'true'

    if (!redirected) {
      const rememberMe = localStorage.getItem('rememberMe') === 'true'
      const tokenExpired = sessionStorage.getItem('tokenExpired') === 'true'
      const tokenRevoked = sessionStorage.getItem('tokenRevoked') === 'true'
      const unauthorized = sessionStorage.getItem('unauthorized') === 'true'

      if (tokenExpired || tokenRevoked || unauthorized || !rememberMe) {
        localStorage.clear()
        authService.signOut()
      }

      if (!(tokenExpired || tokenRevoked || unauthorized)) {
        sessionStorage.clear()
      } else {
        this.setState({ tokenExpired, tokenRevoked, unauthorized })
      }

      localStorage.setItem('redirected', true)
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { alert, resetPassword, loading, tokenExpired, tokenRevoked, unauthorized } = this.state

    return (
      <div className='wd-login'>
        <div className='container'>
          <div>
            {tokenExpired ? (
              <Alert
                className='alert'
                message='Your session has expired. Please sign in again.'
                type='error'
                showIcon
              />
            ) : null}

            {tokenRevoked ? (
              <Alert
                className='alert'
                message='Your session is invalid. Please sign in again.'
                type='error'
                showIcon
              />
            ) : null}

            {unauthorized ? (
              <Alert
                className='alert'
                message='You must sign in to use this application.'
                type='error'
                showIcon
              />
            ) : null}

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
                    onKeyPress={this.handleSignIn}
                    placeholder='E-mail'
                    prefix={<Icon type='user' />}
                    readOnly={resetPassword || loading}
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please enter your password' }]
                })(
                  <Input
                    onKeyPress={this.handleSignIn}
                    placeholder='Password'
                    prefix={<Icon type='lock' />}
                    readOnly={resetPassword || loading}
                    type='password'
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('rememberMe', {
                  initialValue: false,
                  valuePropName: 'checked'
                })(
                  <Checkbox>Remember Me</Checkbox>
                )}
              </FormItem>
            </div>

            {resetPassword ? (
              <div>
                <FormItem label='Enter your new password' />

                <FormItem>
                  {getFieldDecorator('newPassword', {
                    rules: [
                      { required: true, message: 'Please enter your new password' },
                      { validator: this.checkConfirm }
                    ]
                  })(
                    <Input
                      onKeyPress={this.handleSignIn}
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
                      onKeyPress={this.handleSignIn}
                      placeholder='Confirm New Password'
                      prefix={<Icon type='lock' />}
                      readOnly={loading}
                      type='password'
                    />
                  )}
                </FormItem>

                <FormItem className='button-container'>
                  <Button className='button' disabled={loading} onClick={this.handleSignIn} type='primary'>
                    Confirm
                  </Button>
                </FormItem>
              </div>
            ) : (
              <FormItem className='button-container'>
                <Button className='button' disabled={loading} onClick={this.handleSignIn} type='primary'>
                  Sign In
                </Button>

                <div className='forgot'>
                  <Link to='/forgot-password' onClick={this.hideAler}>Forgot password</Link>
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

  handleSignIn = (e) => {
    if (this.isEnterKey(e) || this.isMouseClick(e)) {
      const { form, history } = this.props
      const { alert } = this.state
      const { validateFields } = form
      alert.show = false
      sessionStorage.removeItem('tokenExpired')
      sessionStorage.removeItem('tokenRevoked')
      sessionStorage.removeItem('unauthorized')
      this.setState({ alert, tokenExpired: false, tokenRevoked: false, unauthorized: false })
      validateFields(async (errors, values) => {
        if (!errors) {
          const { email, password, newPassword, rememberMe } = values
          this.setState({ loading: true })

          try {
            const { permissionsFetched } = this.props
            const response = await authService.signIn(email, password, newPassword, rememberMe)
            const { permissions, resetPassword, token, user } = response

            if (resetPassword) {
              this.setState({ resetPassword: true, loading: false })
            } else {
              permissionsFetched(permissions)
              localStorage.setItem('redirected', false)
              localStorage.setItem('rememberMe', rememberMe)
              localStorage.setItem('token', token)
              localStorage.setObject('permissions', permissions)
              localStorage.setObject('user', user)
              sessionStorage.removeItem('tokenExpired')
              sessionStorage.removeItem('tokenRevoked')
              sessionStorage.removeItem('unauthorized')
              this.setState({ loading: false })
              history.replace('/')
            }
          } catch (e) {
            const { response } = e

            if (response) {
              const { errors } = response
              alert.message = errors[0].message
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
)(Form.create()(Login))
