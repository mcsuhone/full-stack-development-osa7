const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!request.token) {
    return response.status(401).json({ error: 'no token given' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  try {
    if (blog && request.user && blog.user.toString() === request.user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
    else {
      response.status(401).json({ error: 'user not authenticated' })
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes, userId } = request.body
  const blog = await Blog.findById(request.params.id)
  try {
    if (blog && request.user && blog.user.toString() === request.user._id.toString()) {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
        { title, author, url, likes, userId },
        { new: true, runValidators: true, context: 'query' }
      )
      response.json(updatedBlog)
    }
    else {
      response.status(401).json({ error: 'user not authenticated' })
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter