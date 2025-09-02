import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

// Global variables
const currency = "INR";
const deliveryCharge = 10;

// Stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Razorpay initialization
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ----------------------------
// COD: Place Order
// ----------------------------
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({ success: true, message: "Order placed", data: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Stripe: Place Order
// ----------------------------
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Stripe: Verify Payment
// ----------------------------
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (!orderId || typeof success === "undefined") {
      return res.status(400).json({ success: false, message: "Missing orderId or success" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "Payment failed, order removed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Razorpay: Place Order
// ----------------------------
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency,
      receipt: newOrder._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order, orderId: newOrder._id });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ----------------------------
// Razorpay: Verify Payment
// ----------------------------
const verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Razorpay payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Admin: All Orders
// ----------------------------
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// User: My Orders
// ----------------------------
const userOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Admin: Update Order Status
// ----------------------------
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Missing orderId or status" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrder,
  updateStatus,
};




// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";
// import razorpay from 'razorpay'

// // Global variables
// const currency = "inr";
// const deliveryCharge = 10;

// //gateway initialization
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const razorpayInstance=new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret:process.env.RAZORPAY_KEY_SECRET
// })

// // Place Order (COD)
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;

//     if (!userId || !items || !amount || !address) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "COD",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     res.status(200).json({ success: true, message: "Order placed", data: newOrder });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Place Order (Stripe)
// const placeOrderStripe = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;
//     const { origin } = req.headers;

//     if (!userId || !items || !amount || !address) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Stripe",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const line_items = items.map((item) => ({
//       price_data: {
//         currency,
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//       price_data: {
//         currency,
//         product_data: { name: "Delivery Charges" },
//         unit_amount: deliveryCharge * 100,
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//       line_items,
//       mode: "payment",
//     });

//     res.status(200).json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Verify Stripe Payment
// const verifyStripe = async (req, res) => {
//   const { orderId, success } = req.body;

//   try {
//     if (!orderId || typeof success === "undefined") {
//       return res.status(400).json({ success: false, message: "Missing orderId or success" });
//     }

//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
//       res.status(200).json({ success: true });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.status(200).json({ success: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Razorpay Placeholder
// const placeOrderRazorpay = async (req, res) => {
//     try{
//     const { userId, items, amount, address } = req.body;

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Razorpay",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const option={
//       amount: amount * 100,
//       currency: currency.toUpperCase(),
//       recipt:newOrder._id.toString()
//     }

//     await razorpayInstance.orders.create(SchemaTypeOptions,(error,orders)=>{
//       if(error){
//         console.log(error)
//         return res.json({success:false,message:error
//         })
//       }
//       res.json({success:true,orders})
//     })

//     }catch(error){
//     console.error(error);
//     res.json({ success: false, message: error.message });
//     }
// };

// // Admin: All Orders
// const allOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // User Orders
// const userOrder = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "User ID is required" });
//     }

//     const orders = await orderModel.find({ userId });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Admin: Update Order Status
// const updateStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;

//     if (!orderId || !status) {
//       return res.status(400).json({ success: false, message: "Missing orderId or status" });
//     }

//     await orderModel.findByIdAndUpdate(orderId, { status });
//     res.status(200).json({ success: true, message: "Status updated" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export {
//   placeOrder,
//   placeOrderStripe,
//   verifyStripe,
//   placeOrderRazorpay,
//   allOrders,
//   userOrder,
//   updateStatus,
// };





// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";
// import Razorpay from "razorpay";

// // Global variables
// const currency = "inr";
// const deliveryCharge = 10;

// // Gateway initialization
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Place Order (COD)
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;

//     if (!userId || !items || !amount || !address) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "COD",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     res.status(200).json({ success: true, message: "Order placed", data: newOrder });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Place Order (Stripe)
// const placeOrderStripe = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;
//     const { origin } = req.headers;

//     if (!userId || !items || !amount || !address) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Stripe",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const line_items = items.map((item) => ({
//       price_data: {
//         currency,
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//       price_data: {
//         currency,
//         product_data: { name: "Delivery Charges" },
//         unit_amount: deliveryCharge * 100,
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//       line_items,
//       mode: "payment",
//     });

//     res.status(200).json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Verify Stripe Payment
// const verifyStripe = async (req, res) => {
//   const { orderId, success } = req.body;

//   try {
//     if (!orderId || typeof success === "undefined") {
//       return res.status(400).json({ success: false, message: "Missing orderId or success" });
//     }

//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
//       res.status(200).json({ success: true });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.status(200).json({ success: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Place Order (Razorpay)
// const placeOrderRazorpay = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Razorpay",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const options = {
//       amount: amount * 100, // in paise
//       currency: currency.toUpperCase(),
//       receipt: newOrder._id.toString(),
//     };

//     razorpayInstance.orders.create(options, (error, order) => {
//       if (error) {
//         console.error("Razorpay order creation failed:", error);
//         return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
//       }
//       return res.status(200).json({ success: true, order });
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const verifyRazorpay=async(req,res)=>{
//     try{
//         const{userId,razorpay_order_id}=req.body

//         const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
//         console.log(orderInfo)
//         if(orderInfo.status==='paid'){
//           await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
//           await userModel.findByIdAndUpdate(userId,{cartData:{}})
//           res.json({success:true,message:"payment Successfull"})
//         }else{
//           res.json({success:true,message:'payment failed'});
//         }

//     }catch(error){
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//     }
// }


// // Admin: All Orders
// const allOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // User Orders
// const userOrder = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "User ID is required" });
//     }

//     const orders = await orderModel.find({ userId });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Admin: Update Order Status
// const updateStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;

//     if (!orderId || !status) {
//       return res.status(400).json({ success: false, message: "Missing orderId or status" });
//     }

//     await orderModel.findByIdAndUpdate(orderId, { status });
//     res.status(200).json({ success: true, message: "Status updated" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export {
//   placeOrder,
//   placeOrderStripe,
//   verifyStripe,
//   verifyRazorpay,
//   placeOrderRazorpay,
//   allOrders,
//   userOrder,
//   updateStatus,
// };
