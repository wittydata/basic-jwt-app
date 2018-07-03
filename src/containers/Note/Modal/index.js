import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchNotes } from '../../../states/actions/note'
import noteService from '../../../services/note'
import notification from '../../../util/notification'

// UI
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import 'antd/lib/button/style/css'
import 'antd/lib/form/style/css'
import 'antd/lib/input/style/css'
import 'antd/lib/modal/style/css'
import './styles.css'

const FormItem = Form.Item
const TextArea = Input.TextArea

class NoteModal extends Component {
  constructor (props) {
    super(props)
    const { note, title, visible } = props
    this.state = {
      loading: false,
      note,
      title,
      visible
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { note, title, visible } = nextProps
    return { ...prevState, note, title, visible }
  }

  render () {
    const { form } = this.props
    const { loading, note, title, visible } = this.state
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
          <FormItem label='Title'>
            {getFieldDecorator('title', {
              initialValue: note.title,
              rules: [
                { min: 2, message: 'Title must be between 2 and 128 characters' },
                { max: 128, message: 'Title must be between 2 and 128 characters' },
                { required: true, message: 'Please enter title' },
                { whitespace: true, message: 'Please enter title' }
              ]
            })(
              <Input
                autoFocus
                placeholder='Title'
                tabIndex='1'
              />
            )}
          </FormItem>

          <FormItem label='Content'>
            {getFieldDecorator('content', {
              initialValue: note.content,
              rules: [
                { min: 2, message: 'Content must be between 2 and 512 characters' },
                { max: 512, message: 'Content must be between 2 and 512 characters' },
                { required: true, message: 'Please enter content' },
                { whitespace: true, message: 'Please enter content' }
              ]
            })(
              <TextArea
                autosize={{ minRows: 5, maxRows: 5 }}
                placeholder='Content'
                tabIndex='2'
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
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
          const { note } = this.state
          const { _id } = note
          let response

          if (_id) {
            response = await noteService.save(_id, values)
          } else {
            response = await noteService.add(values)
          }

          if (response._id) {
            const { fetchNotes } = this.props
            notification.show('success', 'Saved successfully', 'Note saved successfully.')
            fetchNotes()

            if (!_id) {
              const { form, handleHideModal } = this.props
              const { resetFields } = form
              resetFields()
              handleHideModal()
            }
          }

          this.setState({ loading: false })
        } catch (e) {
          notification.show('error', 'Unable to save successfully', 'Unable to save note successfully.')
          this.setState({ loading: false })
        }
      }
    })
  }
}

const mapDispatchToProps = {
  fetchNotes
}

const mapStateToProps = (state) => {
  return state
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(NoteModal))
