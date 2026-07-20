import { useState } from 'react'
import Vite from './Vite'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>This is a Vite project</h1>
      < Vite />
    </>
  )
}

export default App
