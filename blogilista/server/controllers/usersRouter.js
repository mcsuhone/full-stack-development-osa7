const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

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
        name: 2,
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
  
  response.json(users);
  
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
