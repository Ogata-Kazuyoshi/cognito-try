import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios";

type User = {
    date: string,
    email: string,
    id: string
}

function App() {

    const [email, setEmail] = useState('')
    const [usersList, setUsersList]=useState<User[]>([])
    const apiGateway = import.meta.env.VITE_APIGATEWAY
    const handleClick = async () => {
        const res = await axios.post(`${apiGateway}/api/users`,{
            userEmail: email
        })
        console.log({res})
    }

    const deleteHandler = async (id: string) => {
        const res = await axios.delete(`${apiGateway}/api/users/${id}`).then(elm => elm.data)
        console.log({res})
    }

    const getAllUsers = async () => {
        const res = await axios.get<User[]>(`${apiGateway}/api/users`).then(elm => elm.data)
        setUsersList(res)
    }

    useEffect(() => {
        getAllUsers()
    }, []);

  return (
      <>
          <div>ユーザーEメール入力用</div>
          <br/>
          <div>
              <label>user email : </label>
              <input value={email} onChange={(e) => {
                  setEmail(e.target.value)
              }} type="text"/>
              <button onClick={handleClick}>ユーザー登録</button>
          </div>
          <br/>
          <br/>
          <br/>
          <table >
              <thead>
              <tr>
                  <th>
                      id
                  </th>
                  <th>
                      email
                  </th>
                  <th>
                      date
                  </th>
                  <th>
                      削除ボタン
                  </th>
              </tr>
              </thead>
              <tbody>
              {usersList.map(user => (
                  <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.date}</td>
                      <td>
                          <button onClick={() => {
                              deleteHandler(user.id)
                          }}>削除</button>
                      </td>
                  </tr>
              ))}
              </tbody>
          </table>

      </>
  )
}

export default App
