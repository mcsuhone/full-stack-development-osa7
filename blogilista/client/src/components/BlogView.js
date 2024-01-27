import './BlogView.css'
import React, { useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import blogService from '../services/blogService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const BlogView = () => {
  const blogId = useParams().id
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const updateBlogsMutation = useMutation({mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries('blog')
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries('blog')
    },
  })

  const result = useQuery({
    queryKey: ['blog'],
    queryFn: () => blogService.getBlog(blogId)
  })

  if (result?.isError) {
    return <p>anecdote service not available due to problems in server</p>
  }

  if (result?.isLoading) {
    return <h3>Loading data ...</h3>
  }

  const blog = result.data

  const updateBlog = async (newBlog) => {
    try {
      updateBlogsMutation.mutate(newBlog)
    } catch (error) {
      console.log(error.response.data.error)
    }
  }

  const removeBlog = async (blogId) => {
    try {
      removeBlogMutation.mutate(blogId)
      queryClient.invalidateQueries({queryKey: ['blogs']})
      navigate('/')
    } catch (error) {
      console.log(error.response.data.error)
    }
  }
  
  const addLike = () => {
    updateBlog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      id: blog.id
    })
  }

  const deleteBlog = () => {
    removeBlog(blog.id)
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    await blogService.addComment(blog.id, comment)
    setComment('')
    queryClient.invalidateQueries('blog');
  }

  return (
    <div className='blog-view-container'>
      <div className='blog-info-wrapper'>
        <h2 className='blog-item'>{blog?.title}</h2>
        <div className='blog-item'>
          blogin osoite: <a href={blog?.url} >{blog?.url}</a> <br />
        </div>
        <div className='blog-item'>
          likes {blog?.likes} <button onClick={addLike}>like</button>
        </div>
        <div className='blog-item'>
          added by {blog?.user?.username}
        </div>
      </div>
      <button onClick={deleteBlog}>remove</button>
      <br /><br />
      <h3>comments</h3>
      <form onSubmit={handleSubmitComment}>
        <input type='text' value={comment} onChange={handleCommentChange}/>
        <button type='submit'>add comment</button>
      </form>
      <br />
      {blog.comments.map((comment, i) => {
        return <li key={i}>{comment}</li>
      })}
    </div>
  )
}

export default BlogView
