import React, { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    // props.mockHandler()
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  if (visible) {
    return (
      <div className={props.className}>
        {props.children}
        <button className="toggle-button" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    )
  }
  return (
    <div className={props.className}>
      <button className="toggle-button" onClick={toggleVisibility}>
        {props.buttonLabel}
      </button>
    </div>
  )
})

Togglable.displayName = 'Togglable'
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
