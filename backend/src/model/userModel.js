import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerify:{
     type: Boolean,
      default: false,
    },
    token:{
      type:String,
      default:null
    },
    isLogedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
