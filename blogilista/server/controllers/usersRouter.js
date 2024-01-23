const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')

usersRouter.get('/', async (request, response) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: 'user',
        as: 'blogs'
      }
    },
    {
      $project: {
        username: 1,
        name: 1,
        _id: 1,
        blogsCount: { $size: '$blogs' },
        blogs: {
          $map: {
            input: '$blogs',
            as: 'blog',
            in: {
              url: '$$blog.url',
              title: '$$blog.title',
              author: '$$blog.author'
            }
          }
        }
      }
    }
  ])

  response.json(users.map((user) => {return {...user, _id: user._id.toString()}}))
})

usersRouter.get('/:id', async (request, response) => {
  const userID = request.params.id

  const user = await User.findById(userID);

  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  const blogs = await Blog.find({ user: user._id });

  const responseObject = {
    _id: user._id,
    username: user.username,
    name: user.name,
    blogsCount: blogs.length,
    blogs: blogs.map(blog => ({
      url: blog.url,
      title: blog.title,
      author: blog.author
    }))
  };

  response.json(responseObject);
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password is too short'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
