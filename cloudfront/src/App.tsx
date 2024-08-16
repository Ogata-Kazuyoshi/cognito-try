import { useState } from 'react'
import './App.css'
import axios from "axios";

function App() {

    const [email, setEmail] = useState('')
    const apiGateway = import.meta.env.VITE_APIGATEWAY
    const handleClick = async () => {
        const res = await axios.post(`${apiGateway}/api/users`,{
            userEmail: email
        })
        console.log({res})
    }
  return (
    <>
        <div>ユーザーEメール入力用</div>
        <br/>
        <div>
            <label >user email : </label>
            <input value={email} onChange={(e) => {setEmail(e.target.value)}} type="text"/>
            <button onClick={handleClick}>ユーザー登録</button>
        </div>

    </>
  )
}

export default App
