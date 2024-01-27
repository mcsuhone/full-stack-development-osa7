import './Navbar.css'

import React from "react"
import { Link } from "react-router-dom"

export default () => {
  return (
    <div className='navbar-container'>
      <Link className='navbar-item' to={'/'}>blogs</Link>
      <Link className='navbar-item' to={'/users'}>users</Link>
    </div>
  )
}