import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { abcContext } from "../context/ShopContextProvider";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(abcContext);

  const [productdata, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image?.[0] || "");
    }
  }, [productId, products]);

  if (!productdata || !Array.isArray(productdata.image)) {
    return (
      <div className="text-center text-gray-500 py-20">
        Product not found or data is loading...
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 px-25">
      {/* Product Images + Info */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Thumbnail Gallery */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[17.7%] w-full">
            {productdata.image.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setImage(img)}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Thumbnail ${index}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="Main" className="w-full h-auto" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium">{productdata.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={assets.star_icon} className="w-3" alt="star" />
            ))}
            <p className="pl-2 text-sm text-gray-500">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productdata.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-3/4">{productdata.description}</p>

          {/* Size Options */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {Array.isArray(productdata.size) && productdata.size.length > 0 ? (
                productdata.size.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    key={index}
                    className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-500" : ""}`}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No sizes available</p>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(productdata._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-4 flex flex-col gap-1">
            <p>✅ 100% Original Product.</p>
            <p>💵 Cash on delivery is available on this product.</p>
            <p>🔁 Easy return and exchange within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex border-b">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-gray-500">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
            sapiente voluptatibus esse amet rem nam...
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat
            voluptas dolorum, temporibus animi facilis...
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productdata.category}
        subCategory={productdata.subCategory}
      />
    </div>
  );
};

export default Product;
