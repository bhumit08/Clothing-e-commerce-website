
import React, { useContext, useEffect, useState } from 'react';
import { abcContext } from '../context/ShopContextProvider';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendURL } = useContext(abcContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendURL + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Sign up successful!");
        } else {
          toast.error(response.data.error || "Sign up failed");
        }
      } else {
        const response = await axios.post(backendURL + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Login successful!");
        } else {
          toast.error(response.data.error || "Invalid credentials");
        }
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Something went wrong";
      toast.error(message);
    }
  };

  useEffect(()=>{
      if(token){
        navigate('/')
      }
  },[token])
  return (
    <>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>

        {currentState === 'Login' ? '' :
          <input onChange={(e) => setName(e.target.value)} value={name} type='text' className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}

        <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

        <div className='w-full justify-between text-sm mt-[-8px] flex items-center'>
          <p className='cursor-pointer'>Forgot Your Password</p>
          {
            currentState === 'Login'
              ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-blue-500 hover:underline'>Create account</p>
              : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-blue-500 hover:underline'>Already have an account? Login</p>
          }
        </div>

        <button className='bg-black text-white font-light px-8 py-2 mt-4'>
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      {/* ✅ Required for toast notifications to work */}
      <ToastContainer position='top-right' autoClose={3000} />
    </>
  );
};

export default Login;

