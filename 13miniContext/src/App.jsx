import { useState } from 'react'
import { Login, Profile } from './components/index.js'
import './App.css'
import UserContextProvider from './context/UserContextProvider.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <UserContextProvider>
      <h1>React App with Context Apis</h1>
      <Login />
      <Profile />
    </UserContextProvider>
  )
}

export default App
