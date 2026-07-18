import { useCallback, useEffect, useRef, useState } from 'react'

function App() {
  const [length, setLength] = useState(8);
  const [numAllowed, setNumAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null)
  const copyBtnRef = useRef(null)

  const generatePassword = useCallback(() => {
    let pass = ""
    let str = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm"

    if (numAllowed) str += "1234567890"
    if (charAllowed) str += "!@#$%^&*()_+"

    for (let i = 1; i < length; i++) {
      const char = Math.round(Math.random() * str.length + 1)
      pass += str.charAt(char)
    }

    setPassword(pass)
    if (copyBtnRef.current.innerText === "copied") copyBtnRef.current.innerText = "copy"
  }, [length, numAllowed, charAllowed])

  const copyPasswordToClipboard = (e) => {
    window.navigator.clipboard.writeText(password)
    passwordRef.current.select()
    copyBtnRef.current.innerText = "copied"
  }

  // For auto update 
  // useEffect(() => { generatePassword() }, [length, charAllowed, numAllowed])

  return (
    <>
      <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-blue-950 text-orange-500'>
        <h1 className='text-white text-center my-3'>Password Genrator</h1>
        <div className='flex shadow rounded-lg overflow-hidden mb-4'>
          <input
            type="text"
            value={password}
            className='outline-none bg-white py-1 px-3 w-full'
            placeholder='Password'
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={() => copyPasswordToClipboard()}
            className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0'
            ref={copyBtnRef}
          >copy</button>
        </div>
        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <input
              type="range"
              min={6}
              max={24}
              value={length}
              className='cursor-pointer'
              onChange={(e) => setLength(e.target.value)}
              name=""
              id="" />
            <label htmlFor="length">Length:{length}</label>
          </div>

          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              defaultChecked={numAllowed}
              onChange={() => { setNumAllowed((prev) => !prev) }}
              name="" id="" />
            <label htmlFor="number">Numbers</label>
          </div>

          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              onChange={() => { setCharAllowed((prev) => !prev) }}
              name="" id="" />
            <label htmlFor="character">Characters</label>
          </div>{" "}
          <button
            onClick={generatePassword}
            className=' bg-sky-300 text-blue-900 rounded-4xl px-2 '>↻</button>
        </div>
      </div>
    </>
  )
}

export default App
