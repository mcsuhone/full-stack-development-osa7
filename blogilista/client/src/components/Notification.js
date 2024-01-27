import './Notification.css'
import { useNotificationValue } from '../reducers/notificationReducer'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification === '') {
    return null
  }

  return <div className='notification'>{notification}</div>
}

export default Notification
