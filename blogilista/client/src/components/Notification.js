import React, { useState, useImperativeHandle, forwardRef } from 'react'

const Notification = forwardRef((props, ref) => {
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('notification')

  const setTimedNotification = (message, type='notification') => {
    setNotificationType(type)
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  useImperativeHandle(ref, () => {
    return {
      setTimedNotification
    }
  })

  if (notificationMessage === null) {
    return <div className='notification-banner'></div>
  }

  return (
    <div className={notificationType + ' notification-banner'}>
      {notificationMessage}
    </div>
  )
})

Notification.displayName = 'Notification'

export default Notification