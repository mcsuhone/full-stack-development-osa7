import './Blog.css'
import { Link } from "react-router-dom"

const Blog = ({blog}) => {
  return (
    <Link className='blog-container' to={`/blogs/${blog?.id}`}>{blog?.title}</Link>
  )
}


export default Blog