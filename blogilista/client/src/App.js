import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { login } from './services/loginService'
import blogService from './services/blogService'
import { useNotificationDispatch } from './reducers/notificationReducer'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

const App = () => {
  const [user, setUserToken] = useState(null)
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const updateBlogsMutation = useMutation({mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      console.log('User already logged in')
      const loggedUser = JSON.parse(loggedUserJSON)
      setUserToken(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const returnedUser = await login(credentials)
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(returnedUser)
      )
      blogService.setToken(returnedUser.token)
      setUserToken(returnedUser)
      console.log('User logged in')
    } catch (error) {
      notificationDispatch({
        type: 'SET',
        payload: 'wrong username or password'
      })
      console.log(error.response.data.error)
    }
  }

  const createBlog = async (blog) => {
    try {
      const addedBlog = await blogService.create(blog)
      notificationDispatch({
        type: 'SET',
        payload: `a new blog ${addedBlog.title} by ${addedBlog.author} added`
      })
      queryClient.invalidateQueries({queryKey: ['blogs']})
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      notificationDispatch({ type: 'SET', payload: error.response.data.error })
      console.log(error.response.data.error)
    }
  }

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
    } catch (error) {
      console.log(error.response.data.error)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUserToken(null)
    console.log('logged out')
  }

  if (user === null) {
    return (
      <div className="app-container">
        <Notification />
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  let blogLoading = null

  if (result.isError) {
    blogLoading = <p>anecdote service not available due to problems in server</p>
  }

  if (result.isLoading) {
    blogLoading = <h3>Loading data ...</h3>
  }

  const sortedBlogs = result.data?.sort((a, b) => (a.likes < b.likes ? 1 : -1))

  return (
    <div className="app-container">
      <Notification />
      <h2>blogs</h2>

      <p>
        {user.username} logged in <button onClick={logout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {blogLoading}

      {sortedBlogs?.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  )
}

export default App
