import dotenv from 'dotenv';
dotenv.config();
import User from './../model/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const register = async(req, res) => {
try {
   const {name, email, password} = req.body; 
   const presentUser = await User.findOne({email})
   if (presentUser) {
    return res.status(400).json({message:"User is all ready present"})
   }
   const hasedPassword = await bcrypt.hash(password, 10) 
   const saveData = await User.create({name, email, password:hasedPassword})
   return res.status(201).json({message:"user register successfully", data:saveData})
} catch (error) {
   console.log(error);
   
  return res.status(500).json({message:"Internal server error", error})  
}
};

 export const login = async(req, res) => {
try {
  const {email, password} = req.body;
  const validEmail = await User.findOne({email})
  if (!validEmail) {
      return res.status(400).json({message:"User  not present"})
  }
  const isloggedIn = await bcrypt.compare(password, validEmail.password)
  if (!isloggedIn) {
     return res.status(400).json({message:"wrong password"}) 
  }
  const accessToken = jwt.sign({id:validEmail._id}, process.env.KEY,{expiresIn:"7d"});
  validEmail.isLogedIn = true
  validEmail.token = accessToken
  await validEmail.save()
  return res.status(200).json({message:"user login successfully", data:validEmail})
  
  
} catch (error) {
  console.log(error);
  return res.status(500).json({message:"Internal server error", error})  
}
};