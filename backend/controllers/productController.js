import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// -------------------- ADD PRODUCT --------------------
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, sizes, bestseller } = req.body;

    // ✅ Safely parse sizes JSON string
    let parsedSizes = [];
    try {
      parsedSizes = JSON.parse(sizes);
      if (!Array.isArray(parsedSizes)) throw new Error();
    } catch {
      return res.json({
        success: false,
        message: "❌ 'sizes' must be a valid JSON array like [\"S\", \"M\", \"L\"]"
      });
    }

    // ✅ Collect image files uploaded via multer
    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0]
    ].filter(Boolean); // Remove undefined/null

    // ✅ Upload to Cloudinary
    const imageUrls = await Promise.all(
      images.map((img) =>
        cloudinary.uploader.upload(img.path, { resource_type: 'image' })
          .then(res => res.secure_url)
      )
    );

    // ✅ Prepare and save product data
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      sizes: parsedSizes,
      bestseller: bestseller === "true",
      image: imageUrls,
      date: Date.now()
    };

    const newProduct = new productModel(productData);
    await newProduct.save();

    return res.json({
      success: true,
      message: "✅ Product added successfully",
      product: newProduct
    });

  } catch (error) {
    console.error("❌ Add Product Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- LIST PRODUCTS --------------------
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.error("❌ List Product Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- REMOVE PRODUCT --------------------
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    return res.json({ success: true, message: "✅ Product removed successfully" });
  } catch (error) {
    console.error("❌ Remove Product Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- SINGLE PRODUCT --------------------
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "❌ Product not found" });
    }
    return res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Single Product Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };






// import { v2 as cloudinary } from 'cloudinary';
// import productModel from '../models/productModel.js';

// const addProduct = async (req, res) => {
//   try {
//     const { name, description, price, category, subcategory, sizes, bestseller } = req.body;

//     // Handle image files from multer
//     const image1 = req.files.image1 && req.files.image1[0];
//     const image2 = req.files.image2 && req.files.image2[0];
//     const image3 = req.files.image3 && req.files.image3[0];
//     const image4 = req.files.image4 && req.files.image4[0];

//     // Filter only defined images
//     const images = [image1, image2, image3, image4].filter((img) => img !== undefined && img !== null);

//     // Upload all images to Cloudinary
//     const imagesUrl = await Promise.all(
//       images.map(async (item) => {
//         const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
//         return result.secure_url;
//       })
//     );

//     // Parse sizes array safely
//     let parsedsizes = [];
//     try {
//       parsedsizes = JSON.parse(sizes);
//     } catch (err) {
//       return res.json({ success: false, message: "sizes must be a valid JSON array like ['M','L']" });
//     }

//     // Create product data
//     const ProductData = {
//       name,
//       description,
//       category,
//       price: Number(price),
//       subcategory,
//       bestseller: bestseller === "true",
//       sizes: parsedsizes,
//       image: imagesUrl,
//       date: Date.now(),
//     };

//     console.log("Product being saved:", ProductData);

//     // Save to MongoDB
//     const product = new productModel(ProductData);
//     await product.save();

//     res.json({ success: true, message: "Product added successfully" });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// import { v2 as cloudinary } from 'cloudinary';
// import productModel from '../models/productModel.js';

// const addProduct = async (req, res) => {
//   try {
//     const { name, description, price, category, subcategory, size, bestseller } = req.body;

//     // Handle image files from multer
//     const image1 = req.files.image1 && req.files.image1[0];
//     const image2 = req.files.image2 && req.files.image2[0];
//     const image3 = req.files.image3 && req.files.image3[0];
//     const image4 = req.files.image4 && req.files.image4[0];

//     const images = [image1, image2, image3, image4].filter((img) => img !== undefined && img !== null);

//     const imagesUrl = await Promise.all(
//       images.map(async (item) => {
//         const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
//         return result.secure_url;
//       })
//     );

//     // ✅ Fix bestseller parsing
//     let bestsellerBoolean = false;
//     if (typeof bestseller === 'string') {
//       bestsellerBoolean = bestseller.toLowerCase() === 'true';
//     } else if (typeof bestseller === 'boolean') {
//       bestsellerBoolean = bestseller;
//     }

//     console.log("Received Bestseller:", bestseller);
//     console.log("Parsed Bestseller:", bestsellerBoolean);

//     const ProductData = {
//       name,
//       description,
//       category,
//       price: Number(price),
//       subcategory,
//       bestseller: bestsellerBoolean, // ✅ Final boolean value
//       size: JSON.parse(size),
//       image: imagesUrl,
//       date: Date.now(),
//     };

//     const product = new productModel(ProductData);
//     await product.save();

//     res.json({ success: true, message: 'Product added successfully' });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Other functions can remain the same
// const listProduct = async (req, res) => {
//   try {
//     const products = await productModel.find({});
//     res.json({ success: true, products });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// const removeProduct = async (req, res) => {
//   try {
//     await productModel.findByIdAndDelete(req.body.id);
//     res.json({ success: true, message: 'Product removed' });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// const singleProduct = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const product = await productModel.findById(productId);
//     res.json({ success: true, product });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export { listProduct, addProduct, removeProduct, singleProduct };
