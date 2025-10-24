import { useState } from 'react'
import { ThemeProvider } from './context/theme'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'



import SideBar from './components/sidebar'
import AIChat from './components/chat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider>
      <div className='flex '>
        <SideBar/>
        <AIChat/>
      </div>
    </ThemeProvider>
  )
}

export default App
