import React,{useEffect, useState} from 'react'
import { createContext } from 'react';
import { products } from "../assets/frontend_assets/assets";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export const abcContext=createContext();

const ShopContextProvider = (props) => {
  const currency = '₹';
  const delivery_fee = 10;
  // const backendURL= import.meta.env.VITE_BACKEND_URL
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showsearch, setShowSearch] = useState(false);
  const [cartitems, setCartItems] = useState({});
  // const [products, setProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [token,setToken]=useState('')

  const navigate=useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      alert(" Please select a size before adding to cart.");
      return;
    }

    setCartItems(prevCartItems => {
      let cartData = structuredClone(prevCartItems);

      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        // cartData[itemId] = { [size]: 1 };
        cartData[itemId]={}
        cartData[itemId][size]=1;
      }

      if(token){
        try{
            axios.post(backendURL + '/api/cart/add',{itemId,size}, {headers:{token}})
        }catch(error){
            console.log(error)
            toast.error(error.message)
        }
      }

      return cartData;
    });

    // alert("Product added to cart successfully!");
  };
  // totalCount += cartitems[itemId][size]; // ✅ Corrected this line

  const getCartCount=()=>{
    let totalCount=0;
    for(const items in cartitems){
      for(const item in cartitems[items])
        try{
            if(cartitems[items][item]>0){
              totalCount+=cartitems[items][item];
            }
        }catch(error){

        }
    }
    return totalCount;
  }

  const updateQuentity=async(itemId,size,quantity)=>{
    let cartData=structuredClone(cartitems);
    cartData[itemId][size]=quantity;
    setCartItems(cartData)

    if(token){
      try{
          await axios.post(backendURL + '/api/cart/update',{itemId,size,quantity},{headers:{token}})
      }catch(error){
          console.log(error)
          toast.error(error.message)
      }
    }

  }

  const getCartAmount=()=>{
      let totalAmount=0;
      for(const items in cartitems){
        let iteminfo=products.find((product)=>product._id===items);
        for(const item in cartitems[items]){
          try{
            if(cartitems[items][item]>0){
              totalAmount+=iteminfo.price *cartitems[items][item]
            }
          }catch(error){

          }
        }
      }
      return totalAmount;
  }

  // useEffect(() => {
  //   console.log("Updated Cart:", cartitems);
  // }, [cartitems]);

  const getProductData=async()=>{
      try{
          const response=await axios.get(backendURL + '/api/product/list')
          if(response.data.success){
             setProducts(response.data.products);
          }else{
            toast.error(respose.data.message)
          }
      }catch(error){
            console.log(error)
            toast.error(error.message)
      }
  }

  const getUserCart=async(token)=>{
      try{
          const response=await axios.post(backendURL + '/api/cart/get',{},{headers:{token}})
          if(response.data.success){
            setCartItems(response.data.cartData)
          }
      }catch(error){
          console.log(error)
            toast.error(error.message)
      }
  }

  useEffect(()=>{
    getProductData()
  },[])

  useEffect(()=>{
    if(!token && localStorage.getItem('token')){
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
  })

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showsearch,
    setShowSearch,
    cartitems,
    addToCart, 
    setCartItems,
    getCartCount,
    updateQuentity,
    getCartAmount,
    navigate,
    backendURL,
    setToken,token
  };

  return (
    <div>
      <abcContext.Provider value={value}>
          {props.children}
      </abcContext.Provider>
    </div>
  )
}

export default ShopContextProvider
