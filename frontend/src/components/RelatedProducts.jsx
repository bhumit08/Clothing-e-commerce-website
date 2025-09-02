import React, { useContext, useEffect, useState } from 'react';
import { abcContext } from '../context/ShopContextProvider';
import ProductItem from './ProductItem';
import Title from './Title';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(abcContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.filter(item => 
        item.category === category && item.subCategory === subCategory
      );

      console.log("Filtered Related Products:", productsCopy.slice(0, 5)); // Debugging log

      setRelated(productsCopy.slice(0, 5)); 
    }
  }, [products, category, subCategory]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />  
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.length > 0 ? (
          related.map((item, index) => (
            <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
          ))
        ) : (
          <p className="col-span-5 text-center text-gray-500">No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
