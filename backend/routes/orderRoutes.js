// import express from 'express'
// import {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrder,updateStatus, verifyStripe} from '../controllers/orderController.js'
// import adminAuth from '../middleware/adminAuth.js'
// import authUser from '../middleware/auth.js'

// const orderRouter=express.Router()

// // Admin Features
// orderRouter.post('/list',adminAuth,allOrders)
// orderRouter.post('/status',adminAuth,updateStatus)

// // Payment Features
// orderRouter.post('/place',authUser,placeOrder)
// orderRouter.post('/stripe',authUser,placeOrderStripe)
// orderRouter.post('/razorpay',authUser,placeOrderRazorpay)


// //User Feature
// orderRouter.post('/userorders',authUser,userOrder)

// //verify payment
// orderRouter.post('/verifyStripe',authUser,verifyStripe)

// export default orderRouter


import express from 'express';
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrder,
  updateStatus,
  verifyStripe,
  verifyRazorpay
} from '../controllers/orderController.js';

import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User Routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/userorders', authUser, userOrder);

// Stripe Verification
orderRouter.post('/verifystripe', authUser, verifyStripe); // route is now lowercase
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay); // route is now lowercase

export default orderRouter;
