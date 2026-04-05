import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { DemoApp } from './calender'
import { Routes,Route } from 'react-router'
import Layout from './ui/Dashboard/Navbar'
import SessionForm from './ui/session/SessionForm'
import Dashboard from './Dashboard'


function App() {
  const [count, setCount] = useState(0)
  const [event,setevent] = useState([])

  return (
    <>
    <div className='max-h-full w-screen'>
      <Layout>
      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
        <Route path='/Session' element={<SessionForm></SessionForm>}></Route>
      </Routes>
      </Layout>
    </div>
 
    </>
  )
}

export default App
