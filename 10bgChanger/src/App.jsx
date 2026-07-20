import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState('olive')
  const setBgColor = (color) => {  setTimeout(() => { setColor(color) }, 200); };

  return (
    <div className='w-full h-screen duration-200' style={{ backgroundColor: color }}>
      <div className='fixed flex justify-center bottom-12 inset-x-0 px-2'>
        <div className='w-fit flex justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-3xl '>
          <button onClick={() => setBgColor('red')} className='px-4 py-1 outline-none rounded-full text-white shadow-lg bg-red-500'>Red</button>
          <button onClick={() => setBgColor('blue')} className='px-4 py-1 outline-none rounded-full text-white shadow-lg bg-blue-700' >Blue</button>
          <button onClick={() => setBgColor('green')} className='px-4 py-1 outline-none rounded-full text-white shadow-lg bg-green-500'>Green</button>
        </div>
      </div>
    </div>
  )
}

export default App
