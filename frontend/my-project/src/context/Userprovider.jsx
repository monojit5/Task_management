import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const userContext = createContext();
import {API_BASE_URL} from "../config/api";

const Userprovider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const saveData = localStorage.getItem("user")
    return saveData ? JSON.parse(saveData):null
  })
  const navigate = useNavigate();
  
const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [logData, setLogdata] = useState({
    email: "",
    password: "",
  });
  const handellogChange = (e) => {
    const { name, value } = e.target;
    setLogdata({ ...logData, [name]: value });
  };

  const handellogClick = async (e) => {
    e.preventDefault();
    console.log(logData);
    if (!logData.email.trim() || !logData.password.trim()) {
      toast.error("Plese fill up all the fields");
      return;
    }
    if (logData.password.length > 10 || logData.password.length < 6) {
      toast.error("Password most be at list between 6 to 10 chrecters");
      return;
    }
    if (!logData.email.includes("@")) {
      toast.error("Invalid Email");
      return;
    }
    try {
      const result = await axios.post(
        `${API_BASE_URL}/user/login`,
        logData,
      );
      if (result.status !== 200) {
        toast.error("Server error");
        return;
      }
      console.log(result);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        console.log(logData);
        setUser(result.data.data)
        console.log(setUser);
        
        toast.success(`Welcome ${result.data.data.name}`);
        navigate("/dashboard");
      }, 2000);
    } catch (error) { 
      console.log(error);
      toast.error("Internal server error");
      return;
    }
  };

   useEffect(() => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}, [user]);
console.log(user);


  const [showreg, setShowreg] = useState(false);
  const [regData, setRegdata] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handelregChange = (e) => {
    const { name, value } = e.target;
    setRegdata({ ...regData, [name]: value });
  };
  const handelregClick = async (e) => {
    e.preventDefault();
    if (
      !regData.name.trim() ||
      !regData.email.trim() ||
      !regData.password.trim()
    ) {
      toast.error("Plese fill up all the fields");
      return;
    }
    if (regData.password.length > 10 || regData.password.length < 6) {
      toast.error("Password most be at list between 6 to 10 chrecters");
      return;
    }
    if (!regData.email.includes("@")) {
      toast.error("Invalid Email");
      return;
    }
    try {
      const result = await axios.post(
        `${API_BASE_URL}/user/register`,
        regData,
      );
      if (result.status !== 201) {
        toast.error("Server error");
        return;
      }
      console.log(result);
      setRegdata({ email: "", name: "", password: "" });
      toast.success("Register Successfully");
      navigate("/");
    } catch (error) {
      console.log(error.data);
      toast.error("Internal server error");
      return;
    }
  };
 
  return (
    <userContext.Provider
      value={{
        handellogChange,
        handellogClick,
        loading,
        logData,
        show,
        setShow,
        regData,
        handelregClick,
        handelregChange,
        showreg,
        setShowreg,
        user,
        setUser
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default Userprovider;
