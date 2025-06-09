import { useState } from 'react'
import './App.css'
import Header from '../Components/Header'
import Profile from '../Components/Profile'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}

export default App
