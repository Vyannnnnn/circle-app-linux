import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <div className="bg-red-500 h-screen">
      <h1 className="text-3xl font-bold underline text-white">Hello world!</h1>
    </div>
  </>
  )
}

export default App
