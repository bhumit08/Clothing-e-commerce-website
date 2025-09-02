import React, { useEffect, useState, useContext } from 'react';
import { abcContext } from '../context/ShopContextProvider';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(abcContext);
  const [bestseller, setBestSeller] = useState([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const bestProduct = products.filter(
        (item) =>
          item.bestseller === true ||
          item.bestseller === "true" ||
          item.bestseller === 1
      );
      setBestSeller(bestProduct.slice(0, 5));
      // Debug
      console.log("All products:", products);
      console.log("Best sellers:", bestProduct);
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel, laudantium!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 px-25">
        {bestseller.length > 0 ? (
          bestseller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-8">
            No bestsellers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSeller;