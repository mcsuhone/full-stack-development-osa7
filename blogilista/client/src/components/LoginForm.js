import './LoginForm.css'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setNewUsername] = useState('')
  const [password, setNewPassword] = useState('')

  const submitLogin = (event) => {
    event.preventDefault()
    setNewUsername('')
    setNewPassword('')
    handleLogin({ username, password })
  }

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value)
  }

  return (
    <form onSubmit={submitLogin} className="login-container">
      <div className='login-item'>
        username{' '}
        <input type="text" onChange={handleUsernameChange} value={username} />
      </div>
      <div className='login-item'>
        password{' '}
        <input type='password' onChange={handlePasswordChange} value={password} />
      </div>
      <div className='login-item'>
        <button type="submit">login</button>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
