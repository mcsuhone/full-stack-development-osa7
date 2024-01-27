import './BlogForm.css'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className='blog-form-container'>
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        title
        <div className='blog-form-item'>
          <input
            id="title-input"
            type="text"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </div>
        author
        <div className='blog-form-item'> 
          <input
            id="author-input"
            type="text"
            onChange={(event) => setAuthor(event.target.value)}
            value={author}
          />
        </div>
        url
        <div className='blog-form-item'>
          <input
            id="url-input"
            type="text"
            onChange={(event) => setUrl(event.target.value)}
            value={url}
          />
        </div>
        <div className='blog-form-item'>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
