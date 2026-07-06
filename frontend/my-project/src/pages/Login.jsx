
import { useContext } from "react";
import { Link } from "react-router-dom";
import  { userContext } from "../context/Userprovider";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
 
const {loading, logData, handellogClick, handellogChange, setShow, show} = useContext(userContext)
  

  return (
    <section className="min-h-screen bg-[#09090B] flex items-center justify-center p-5 text-sm">

      <div className="absolute w-72 h-72 bg-violet-600 rounded-full blur-[140px] opacity-30 left-20 top-20"></div>

      <div className="absolute w-72 h-72 bg-cyan-500 rounded-full blur-[140px] opacity-30 right-20 bottom-20"></div>

   

      <div className="relative w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,.5)]">

    

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white mx-auto">
          ⚡ 
        </div>

        <h1 className="text-3xl text-white font-bold mt-6 text-center">
          Welcome Back 👋  
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-2">
          Login to continue
        </p>

      

        <input
          type="email"
          name="email"
          value={logData.email}
          onChange={handellogChange}
          placeholder="Email Address"
          className="w-full bg-[#1F2937] text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-violet-500 mb-4"
        />

      

        <div className="relative">

          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={logData.password}
              onChange={handellogChange}
            className="w-full bg-[#1F2937] text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-violet-500"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

        </div>

     
        <button onClick={handellogClick} className="cursor-pointer w-full mt-6 bg-gradient-to-r from-violet-600 to-cyan-500 py-3 rounded-xl text-white font-semibold hover:scale-[1.02] duration-300">
          {loading ? "Wait...":"Login"}
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?
          <Link to="/register"  className="text-violet-400 cursor-pointer ml-2">
          Sign Up
          </Link>
        </p>

      </div>

    </section>
  );
};

export default Login;