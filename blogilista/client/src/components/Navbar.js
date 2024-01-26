import React from "react"
import { Link } from "react-router-dom"

const styles = {
  marginRight: 10,
}

export default () => {
  return (
    <div>
      <Link style={styles} to={'/'}>blogs</Link>
      <Link style={styles} to={'/users'}>users</Link>
    </div>
  )
}