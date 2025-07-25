import React, { useContext, useEffect, useState } from "react";
import { abcContext } from "../context/ShopContextProvider";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(abcContext);
  const [latestproduct, setLatestProduct] = useState([]);

  // useEffect(() => {
  //   setLatestProduct(products.slice(0, 10));
  // }, [products]);
  useEffect(() => {
  if (products && Array.isArray(products)) {
    setLatestProduct(products.slice(0, 10));
  }
}, [products]);


  return (
    <div className="my-10">
      <div className="text-center py-8 text-4xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-[18px] text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur,
          ipsum delectus
        </p>
      </div>
      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-10 px-25">
        {latestproduct.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
