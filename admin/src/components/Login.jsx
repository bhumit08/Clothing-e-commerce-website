import React, { useState } from 'react'
import { backendURL } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
  const onSubmitHandler=async(e)=>{
    try{
      e.preventDefault();
      const response=await axios.post(backendURL + '/api/user/admin',{email,password})
      console.log("Login response:", response.data);
      // setEmail("");
      // setPassword("")
      if(response.data.success){
        setToken(response.data.token)
      }else{
        toast.error(response.data.message)
      }
    }catch (error) {
  console.log(error.response?.data || error.message);
  toast.error(error.response?.data?.message || "Something went wrong");}

  }
  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>

        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com'/>
          </div>

          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password'/>
          </div>

          <button type='submit' className='mt-2 w-full py-2
          px-4 rounded-md text-white bg-black '>Login</button>

        </form>
      </div>
    </div>
  )
}

export default Login
