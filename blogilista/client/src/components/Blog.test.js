import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

test('renders title but not author, url or likes', () => {
  const blog = {
    title: 'otsikko',
    author: 'kirjoittajan nimi',
    url: 'http://www.osoite.fi',
  }

  render(<Blog blog={blog} />)

  screen.getByText('otsikko')

  const author_element = screen.queryByText('kirjoittajan nimi')
  expect(author_element).toBeNull()

  const url_element = screen.queryByText('http://www.osoite.fi')
  expect(url_element).toBeNull()

  const likes_element = screen.queryByText('likes')
  expect(likes_element).toBeNull()
})

test('renders all information when view-button is pressed', async () => {
  const blog = {
    title: 'otsikko',
    author: 'kirjoittajan nimi',
    url: 'http://www.osoite.fi',
    user: {
      username: 'Matti',
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  user.click(button)

  waitFor(() => {
    let element = screen.queryByText('otsikko')
    expect(element).not.toBeNull()

    element = screen.queryByText('kirjoittajan nimi')
    expect(element).not.toBeNull()

    element = screen.queryByText('http://www.osoite.fi')
    expect(element).not.toBeNull()

    element = screen.queryByText('likes')
    expect(element).not.toBeNull()

    element = screen.queryByText('Matti')
    expect(element).not.toBeNull()
  })
})

test('test that two like-button presses trigger event handler exatcly twice', async () => {
  const blog = {
    title: 'otsikko',
    author: 'kirjoittajan nimi',
    url: 'http://www.osoite.fi',
    user: {
      username: 'Matti',
    }
  }

  const mockHandler = jest.fn()

  const { container } = render(<Togglable buttonLabel='create new blog' mockHandler={mockHandler} />)

  let button = container.querySelector('.toggle-button')

  const user = userEvent.setup()
  await user.click(button)

  // The togglable actually contains different button, so it has to be fetched again here.
  button = container.querySelector('.toggle-button')
  await user.click(button)

  expect(mockHandler).toHaveBeenCalledTimes(2);
})

test('test that blog form calls callback function with correct information', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const title_input = container.querySelector('#title-input')
  const author_input = container.querySelector('#author-input')
  const url_input = container.querySelector('#url-input')
  const submitButton = screen.getByText('create')

  await user.type(title_input, 'otsikko')
  await user.type(author_input, 'kirjoittajan nimi')
  await user.type(url_input, 'http://www.osoite.fi')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('otsikko')
  expect(createBlog.mock.calls[0][0].author).toBe('kirjoittajan nimi')
  expect(createBlog.mock.calls[0][0].url).toBe('http://www.osoite.fi')
})