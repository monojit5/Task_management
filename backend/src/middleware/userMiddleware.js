import dotenv from 'dotenv';
dotenv.config()
import jwt from 'jsonwebtoken';
import User from './../model/userModel.js';


const userVerify = async(req, res, next) => {
try {
   const authHeader = req.headers.authorization;
   if (!authHeader ||!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({message:"authorization error"})
   }
   const token = authHeader.split(" ")[1] 
   if (!token) {
    return res.status(401).json({message:"token missing"})
   }
   const dicoded = jwt.verify(token, process.env.KEY)
   const user = await User.findById(dicoded.id)
   if (!user) {
    return res.status(400).json({message:"user missing"})
   }
   req.user = user;
   next()
} catch (error) {
  return res.status(500).json({message:"Internal server error", error})  
}
};
export default userVerify;