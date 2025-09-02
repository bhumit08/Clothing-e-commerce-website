// import React, { useEffect,useState } from 'react'
// // import { Navigate } from 'react-router-dom'
// import { abcContext } from '../context/ShopContextProvider'
// import { useSearchParams } from 'react-router-dom'
// import axios from 'axios'
// import { backendURL } from '../../../admin/src/App'
// // import { set } from 'mongoose'
// import {toast} from 'react-toastify'

// const Verify = () => {

//   const [navigate,token,setCartItems]=useState(abcContext)
//   const[searchParams,setSearchParams]=useSearchParams()

//   const success=searchParams.get('success')
//   const orderId=searchParams.get('orderId')

//   const verifyPayment=async ()=>{
//       try{
//           if(!token){
//             return null
//           }
//           const response=await axios.post(backendURL + '/api/order/verifystripe',{success,orderId},{headers:{token}})
//           if(response.data.success){
//             setCartItems({})
//             navigate('/orders')
//           }else{
//             navigate('/cart')
//           }

//       }catch(error){
//           console.log(error)
//           toast.error(error.message)

//       }
//   }

//   useEffect(()=>{
//     verifyPayment()
//   },[token])
//   return (
//     <div>
//       verify
//     </div>
//   )
// }

// export default Verify

import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { abcContext } from '../context/ShopContextProvider';
import axios from 'axios';
// import { backendURL } from '../../../admin/src/App';
const backendURL = import.meta.env.VITE_BACKEND_URL;
import { toast } from 'react-toastify';

const Verify = () => {
  const { token, setCartItems } = useContext(abcContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendURL + '/api/order/verifystripe',
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        navigate('/cart');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return <div>Verifying payment...</div>;
};

export default Verify;
