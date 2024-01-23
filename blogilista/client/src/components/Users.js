import { useEffect, useState } from "react"
import { getUsers } from "../services/usersService"
import { Link } from "react-router-dom"

const Users = () => {
  const [users, setUsers] = useState(null)
  
  useEffect(() => {
    const findUsers = async() => {
      const users = await getUsers()
      setUsers(users)
    }
    findUsers()
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr key={0}>
            <td>user</td>
            <td><b>blogs created</b></td>
          </tr>
          {users?.map((user, i) => 
            <tr key={i+1}>
              <td><Link to={`/users/${user._id}`}>{user.name}</Link></td>
              <td>{user.blogsCount}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}


export default Users