import { useEffect, useState } from "react"
import { getUsers } from "../services/usersService"

const testUsers = [
  {
    username: 'asd',
    name: 'Pekka'
  },
  {
    username: 'joku',
    name: 'Ulla'
  },
  {
    username: 'jokumuu',
    name: 'Seppo'
  },
]

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
              <td>{user.name}</td>
              <td>{user.blogsCount}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}


export default Users