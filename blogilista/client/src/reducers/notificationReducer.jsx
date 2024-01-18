import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      setTimeout(() => {
        action.dispatch({ type: 'SET', payload: '' })
      }, 5000)
      return action.payload
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )

  const dispatchWithClear = (action) => {
    notificationDispatch({ ...action, dispatch: notificationDispatch })
  }

  return (
    <NotificationContext.Provider value={[notification, dispatchWithClear]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const valueAndDispatch = useContext(NotificationContext)
  return valueAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const valueAndDispatch = useContext(NotificationContext)
  return valueAndDispatch[1]
}

export default NotificationContext
