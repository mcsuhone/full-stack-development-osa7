import React from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import blogService from '../services/blogService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const blogStyle = {
  paddingTop: 3,
  paddingLeft: 3,
  paddingBottom: 3,
  marginBottom: 5
}

const BlogView = () => {
  const blogId = useParams().id
  
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
      queryClient.invalidateQueries('blog');
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

  return (
    <div style={blogStyle}>
      <h2>{blog?.title}</h2>
      <a href={blog?.url} >{blog?.url}</a> <br />
      likes {blog?.likes} <button onClick={addLike}>like</button>
      <br />
      added by {blog?.user?.username}
      <br />
      <button onClick={deleteBlog}>remove</button>
    </div>
  )
}

export default BlogView
