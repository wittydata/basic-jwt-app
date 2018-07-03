import notification from 'antd/lib/notification'
import 'antd/lib/notification/style/css'

export default {
  show (type, message, description) {
    notification.config({ top: 96 })
    notification[type]({ message, description })
  }
}
