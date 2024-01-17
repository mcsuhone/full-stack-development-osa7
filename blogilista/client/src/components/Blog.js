import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 3,
    paddingLeft: 3,
    paddingBottom: 3,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showFullBlog, setShowFullBlog] = useState(false)

  const toggleVisibility = () => {
    setShowFullBlog(!showFullBlog)
  }

  const addLike = () => {
    updateBlog({ title: blog.title, author: blog.author, url: blog.url, likes: blog.likes + 1, user: blog.user.id, id: blog.id })
  }

  const deleteBlog = () => {
    removeBlog(blog.id)
  }

  if (showFullBlog) {
    return (
      <div style={blogStyle}>
        {blog.title} - {blog.author} <button onClick={toggleVisibility}>hide</button><br/>
        {blog.url} <br/>
        likes {blog.likes} <button onClick={addLike}>like</button><br/>
        {blog.user.username}<br/>
        <button onClick={deleteBlog}>remove</button>
      </div>
    )
  }
  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={toggleVisibility}>view</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Blog