import { useState } from 'react'
import './App.css'
import Header from '../Components/Header'
import Profile from '../Components/Profile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    <Profile />
    </>
  )
}

export default App
