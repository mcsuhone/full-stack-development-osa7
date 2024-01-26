import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { login } from './services/loginService'
import blogService from './services/blogService'
import { useNotificationDispatch } from './reducers/notificationReducer'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserDispatch, useUserValue } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import Navbar from './components/Navbar'

const App = () => {
  const userDispatch = useUserDispatch()
  const user = useUserValue()
  const notificationDispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      userDispatch({type: 'SET', payload: loggedUser})
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await login(credentials)
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      userDispatch({type: 'SET', payload: loggedUser})
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

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({type: 'SET', payload: null})
    console.log('logged out')
  }

  // Login page
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
    <Router>
      <div className="app-container">
        <Navbar />
        <Notification />
        <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={logout}>logout</button>
        </p>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView/>} />
          <Route path="/" element={
            <div>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={createBlog} />
              </Togglable>

              {blogLoading}

              {sortedBlogs?.map((blog, i) => (
                <Blog key={i} blog={blog}></Blog>
              ))}
            </div>} />
        </Routes>
        
      </div>
    </Router>
    
  )
}

export default App
