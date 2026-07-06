import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose';

const createDb = async()=> {
try {
   await mongoose.connect(process.env.DATABASE) 
   console.log("database create successfully...");
} catch (error) {
  console.error(error); 
}
};
export default createDb;