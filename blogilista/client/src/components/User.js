import { useEffect, useState } from "react"
import { getUserByID } from "../services/usersService"
import { useParams } from "react-router-dom"

const User = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const findBlogsOfUser = async() => {
      const foundUser = await getUserByID(id)
      console.log('haloo')
      console.log(foundUser)
      setUser(foundUser)
    }
    findBlogsOfUser()
  }, [])

  return (
    <div>
      <h2>{user?.name}</h2>
      <b>added blogs</b>
      {user?.blogs?.map((blog, i) => 
        <li key={i}>{blog.title}</li>)}
    </div>
  )
}


export default User