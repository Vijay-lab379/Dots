import { useEffect, useState } from 'react'
import { Card, ThemeBtn } from './components/index.js'
import { ThemeProvider } from './contexts/Theme.js'

function App() {
  const [themeMode, setThemeMode] = useState('light')
  const darkMode = () => { setThemeMode('dark') }
  const lightMode = () => { setThemeMode('light') }

  useEffect(() => {
    document.querySelector('html').classList.remove('dark', 'light');
    document.querySelector('html').classList.add(themeMode);
  }, [themeMode])

  return (
    <ThemeProvider value={{ themeMode, lightMode, darkMode }}>
      <div className='flex flex-wrap min-h-screen item-center'>
        <div className='w-full'>
          <div className='w-full max-w-sm mx-auto flex justify-end mb-4' >
            <ThemeBtn />
          </div>
          <div className='w-full max-w-sm mx-auto'>
            <Card />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
