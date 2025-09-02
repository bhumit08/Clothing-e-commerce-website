import React, { useContext, useEffect, useState } from 'react'
import { abcContext } from '../context/ShopContextProvider'
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartitems,updateQuentity,navigate} = useContext(abcContext);
  const [cartdata, setCartData] = useState([]);

  useEffect(() => {
    if(products.length > 0){
const tempdata = [];
    for (const itemId in cartitems) {
      for (const sizes in cartitems[itemId]) {
        if (cartitems[itemId][sizes] > 0) {
          tempdata.push({
            _id: itemId,
            sizes: sizes,
            quantity: cartitems[itemId][sizes]
          });
        }
      }
    }
    setCartData(tempdata);
    }
    
  }, [cartitems,products]);

  return (
    <div className='border-t pt-14 px-25'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'}/>
      </div>

      <div>
        {cartdata.map((item, index) => {
          const productdata = products.find(product => product._id === item._id);

          if (!productdata) return null; // ✅ Prevents error if product not found

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img src={productdata.image[0]} alt='' className='w-16 sm:w-20'/> {/* ✅ Fixed 'iamge' typo */}
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productdata.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                        <p>{currency}{productdata.price}</p>
                        <p className='px-2 sm:px-3 sm:py-1  border bg-slate-50'>{item.sizes}</p>
                        <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
                  </div>            
                </div>
              </div>
              <input onChange={(e)=>e.target.value===''|| e.target.value==='0' ? null : updateQuentity(item._id,item.sizes,Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type='number' min={1} defaultValue={item.quantity} />
              <img onClick={()=>updateQuentity(item._id,item.sizes,0)} src={assets.bin_icon} alt='' className='w-4 mr-4 sm:w-5 cursor-pointer'/>
            </div>
          );
        })}
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className='w-full text-end'>
            <button onClick={()=>navigate('/place-order')}className='bg-black text-white text-sm my-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
