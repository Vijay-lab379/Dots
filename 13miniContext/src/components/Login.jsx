import React from 'react'
import { useState, useContext } from 'react'
import UserContext from '../context/UserContext.js'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { setUser } = useContext(UserContext)

    const handleSubmit = function (e) {
        e.preventDefault();
        setUser({username, password})
    }
    return (
        <div className="login-card">
            <h2>Login</h2>
            <input
                type="text"
                value={username}
                placeholder="Enter your name"
                onChange={(e) => setUsername(e.target.value)}
            />{" "}
            <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>

    )
}

export default Login