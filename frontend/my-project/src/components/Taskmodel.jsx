import axios from "axios";
import { Sparkles } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { userContext } from "../context/Userprovider";

const Taskmodel = () => {
  const [loadingdata, setLoadingdata] = useState(false)
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasklist, settaskList] = useState({
    taskName: "",
    description: "",
  });

  const debounceRef = useRef(null);

  
  const generateDescription = async (taskName) => {
    if (!taskName.trim()) return;
    setLoading(true);
    try {
      const result = await axios.post(
        "http://localhost:3000/user/task",
        { taskName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      settaskList((prev) => ({
        ...prev,
        description: result.data.data.description,
      }));
      setDescription(true);
      setTimeout(() => {
        setLoading(true)
        navigate("/dashboard")
        setLoadingdata(false)
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

 
  const handelTaskChange = (e) => {
    const { name, value } = e.target;
    settaskList((prev) => ({ ...prev, [name]: value }));

    if (name === "taskName") {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        setDescription(false);
        return;
      }

      
      debounceRef.current = setTimeout(() => {
        generateDescription(value);
      }, 800);
    }
  };

  
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-5 overflow-hidden bg-[#09090B]">
      <div className="absolute w-72 h-72 bg-violet-600 rounded-full blur-[140px] opacity-30 left-10 top-10"></div>
      <div className="absolute w-72 h-72 bg-cyan-500 rounded-full blur-[140px] opacity-30 right-10 bottom-10"></div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,.5)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Task</h2>
              <p className="text-gray-400 text-sm">
                AI will write the description
              </p>
            </div>
          </div>
        </div>

        
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">Task Title</label>
          <input
            type="text"
            name="taskName"
            value={tasklist.taskName}
            onChange={handelTaskChange}
            placeholder="e.g. Design Landing Page"
            className="w-full bg-[#1F2937] text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-violet-500"
          />
        </div>

      
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
            AI Description
            {loading && (
              <span className="text-xs text-violet-400 animate-pulse">
                generating...
              </span>
            )}
          </label>

          {description && (
            <textarea
              rows={5}
              name="description"
              value={tasklist.description}
              onChange={(e) =>
                settaskList((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Auto-filled by AI..."
              className="w-full bg-[#1F2937] text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-violet-500 resize-none"
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
         
         {loadingdata ? (<h1 className="text-violet-400 animate-pulse">Loading...</h1>):(<></>)}
        </div>
      </div>
    </section>
  );
};

export default Taskmodel;