import { useState } from 'react'

function App() {
  let [counter, setCounter] = useState(13)

  const addValue = () => {
    setCounter((prev) => prev + 1)
    setCounter((prev) => prev + 1)
  }
  
  const removeValue = () => {
    setCounter(counter-1)
    setCounter(--counter)
  }

  return (
    <>
      <h1>Uttilising React JS {counter}</h1>
      <h2>Counter: {counter}</h2>
      <button
        onClick={addValue}
      >Add value</button> {" "}
      <button
        onClick={removeValue}
      >remove value</button>
      <p>footer: {counter}</p>
    </>
  )
}

export default App
