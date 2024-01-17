const config = require('../utils/config')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


const Blog = require('../models/blog')

mongoose.connect(config.MONGODB_URI)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[2])
    await blogObject.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(b => b.title)

    expect(contents).toContain(
      'Canonical string reduction'
    )
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogs = await helper.blogsInDb()

      const blogToView = blogs[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body).toEqual(blogToView)
    })

    test('fails with status 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await helper.blogsInDb()

      const contents = blogs.map(r => r.title)
      expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
      expect(contents).toContain('First class tests')
    })

    test('response with status 400 if title is not given', async () => {
      const newBlog = {
        _id: '5a422b891b54a676234d17fa',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        __v: 0
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('response with status 400 if url is not given', async () => {
      const newBlog = {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        __v: 0
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('likes equals 0 if no likes is given', async () => {
      const newBlog = {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        __v: 0
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await helper.blogsInDb()

      const blog = blogs.filter(b => b.title === newBlog.title)
      expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
      expect(blog[0].likes).toBe(0)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const contents = blogsAtEnd.map(r => r.title)

      expect(contents).not.toContain(blogToDelete.title)
    })
  })

  test('id field is defined (and not _id)', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})