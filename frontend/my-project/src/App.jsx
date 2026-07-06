import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import {Navigate} from 'react-router-dom'
import Taskmodel from "./components/Taskmodel";
import { useContext } from "react";
import { userContext } from "./context/Userprovider";

function App() {
  const { user } = useContext(userContext);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
         <Route 
        path="/dashboard" 
        element={user?.token ? <Dashboard /> : <Navigate to="/" replace />} 
      />
          <Route path="/createtask" element={<Taskmodel/>} />
      </Routes>
    </>
  );
}

export default App;
