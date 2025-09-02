// import jwt from 'jsonwebtoken'

// const adminAuth=async(req,res,next)=>{
//     try{
//       const {token}=req.headers
//       if(!token){
//         return res.json({success:false,message:"not authorized login again"})
//       }
//       const token_decode=jwt.verify(token,process.env.JWT_SECRET);

//       if (
//       decoded.email !== process.env.ADMIN_EMAIL ||
//       decoded.password !== process.env.ADMIN_PASSWORD
//     ) {
//       return res.json({ success: false, message: "Not authorized. Invalid admin credentials." });
//     }

//     next();
//     }catch(error){
//        console.log(error)
//        res.json({success:false,message:error.message})
//     }
// }

// export default adminAuth

import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Not authorized. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.email !== process.env.ADMIN_EMAIL ||
      decoded.password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Not authorized. Invalid admin credentials." });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
