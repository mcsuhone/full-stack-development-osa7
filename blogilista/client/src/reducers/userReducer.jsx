import { createContext, useReducer, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(
    userReducer,
    null
  )

  const dispatchWithClear = (action) => {
    userDispatch({ ...action, dispatch: userDispatch })
  }

  return (
    <UserContext.Provider value={[user, dispatchWithClear]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const valueAndDispatch = useContext(UserContext)
  return valueAndDispatch[0]
}

export const useUserDispatch = () => {
  const valueAndDispatch = useContext(UserContext)
  return valueAndDispatch[1]
}

export default UserContext
