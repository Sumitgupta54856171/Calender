import { Routes,Route } from 'react-router'
import Layout from './ui/Dashboard/Navbar'
import SessionForm from './ui/session/SessionForm'
import Dashboard from './Dashboard'
import Adjustment from './ui/Adjustment/Adjustmen'
import BillTable from './ui/bill/BillTable'


function App() {
  return (
    <>
    <div className='max-h-full w-screen'>
      <Layout>
      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
        <Route path='/Adjustment' element={<Adjustment/>}></Route>
        <Route path='/Session' element={<SessionForm></SessionForm>}></Route>
        <Route path='/Bills' element={<BillTable/>}></Route>
      </Routes>
      </Layout>
    </div>
 
    </>
  )
}

export default App
