// import express from 'express'
// import { addToCart,updateCart,getUserCart } from '../controllers/cartController'
// import authUser from '../middleware/auth';

// const cartRouter=express.Router();

// cartRouter.post('/get',authUser,getUserCart)
// cartRouter.post('/add',authUser,addToCart)
// cartRouter.post('/update',authUser,updateCart)

// export default cartRouter

// cartRoutes.js
import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/get', authUser, getUserCart);
cartRouter.post('/add', authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);

export default cartRouter;
