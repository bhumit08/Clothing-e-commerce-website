import React, {useState}from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Routes,Route} from 
'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'

const backendURl=

const App = () => {
  const [token,setToken]=useState('');
  return (
    <div className='bg-gray-50 min-h-screen'>
      {!token 
      ? <Login /> 
      : <>
    <Navbar/>
    <hr />
    <div className='flex w-full'>
    <Sidebar/>
    <div className='w-[70%] ml-[max(5vh,25px)] my-8 text-gray-600 text-base'>
      <Routes>
        <Route path='/add' element={<Add/>}/>
        <Route path='/list' element={<List/>}/>
        <Route path='/orders' element={<Orders/>}/>
      </Routes>
    </div>
    </div>
      
      </>}
      
      
    </div>
  )
}

export default App
