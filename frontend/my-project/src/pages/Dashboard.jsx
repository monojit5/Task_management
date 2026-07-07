import { useContext, useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Clock3,
  Menu,
  X,
  Sparkles,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { userContext } from "../context/Userprovider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {API_BASE_URL} from '../config/api'
const Dashboard = () => {
  const [totalTask, setTotaltask] = useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(userContext);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: ListTodo, label: "All Tasks" },
    { icon: Clock3, label: "Pending" },
    { icon: CheckCircle2, label: "Completed" },
  ];

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-black" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Task Management</h1>
            <p className="text-gray-500 text-[11px] leading-tight">
              Smart task manager
            </p>
          </div>
        </div>
        <button
          onClick={() => setMenuOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ icon: Icon, label }) => {
          // সহজ শর্ত: টাস্ক ০ হলে Pending এবং Completed বাটন স্ক্রিনে রেন্ডার হবে না
          if (
            taskdata.length === 0 &&
            (label === "Pending" || label === "Completed")
          ) {
            return null;
          }

          const isActive = activeTab === label;

          return (
            <button
              key={label}
              onClick={() => {
                setActiveTab(label);
                setMenuOpen(false);

                if (label === "Dashboard" || label === "All Tasks") {
                  fatchData(); // আপনার ফাংশনের নাম অনুযায়ী
                } else if (label === "Pending") {
                  handelfilterPen();
                } else if (label === "Completed") {
                  handelfiltercom();
                }
              }}
              className={`cursor-pointer w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 shadow-lg shadow-violet-600/20 text-white"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
            toast.success("Logged out successfully! 👋");
          }}
          className="cursor-pointer w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 duration-200 mt-4 border-t border-white/5 pt-4"
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>
    </>
  );

  const [taskdata, setTaskdata] = useState([]);

  const fatchData = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/user/task`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (result.status !== 200) {
        console.log("error");
        return;
      }
      setTaskdata(result.data.data || []);
    } catch (error) {
      console.log(error);
      console.log("internal sever error");
      return;
    }
  };

  useEffect(() => {
    fatchData();
  }, []);

  const handelModel = () => {
    navigate("/createtask");
  };

  const handelDel = async (id) => {
    const confromDel = window.confirm(
      "Are you sure you want to delete this task!",
    );
    if (!confromDel) {
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/user/task/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const filterData = taskdata.filter((item) => item._id !== id);
      setTaskdata(filterData);
      toast.success("Task delete successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const currentTask = taskdata.find((item) => item._id === id);

      const newStatus =
        currentTask.status === "complited" ? "panding" : "complited";

      await axios.patch(
        `${API_BASE_URL}/user/task/update/${id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      const updatedTasks = taskdata.map((item) =>
        item._id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      );

      setTaskdata(updatedTasks);

      toast.success(
        newStatus === "complited"
          ? "Task marked as completed! ✅"
          : "Task marked as pending! ⏳",
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
    }
  };

  const taskCount = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/user/task/count`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (result.status !== 200) {
        console.log("Something went wrong");
        return;
      }
      setTotaltask(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    taskCount();
  }, [taskdata]);

  const handelfilterPen = async () => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/user/task/filter?status=panding`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (result.status !== 200) {
        toast.error("Semething went wrong");
        return;
      }
      setTaskdata(result.data?.data || []);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("❌ No Internet Connection");
        return;
      } else {
        toast.error("Internal; server error");
        return;
      }
    }
  };

  const handelfiltercom = async () => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/user/task/filter?status=complited`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (result.status !== 200) {
        toast.error("Semething went wrong");
        return;
      }
      setTaskdata(result.data?.data || []);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("❌ No Internet Connection");
        return;
      } else {
        toast.error("Internal; server error");
        return;
      }
    }
  };

  const StatusPill = ({ status }) => (
    <span
      className="px-2.5 py-1 rounded-full text-white text-[11px] font-medium border border-amber-500/20 inline-block"
      style={{
        backgroundColor: status === "complited" ? "#059669" : "#dc2626",
      }}
    >
      {status}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-white flex text-sm overflow-x-hidden">
      <div className="fixed -top-24 -left-24 w-72 h-72 bg-violet-600/15 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-72 h-72 bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none"></div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      <aside className="hidden lg:flex w-60 shrink-0 bg-[#111114]/80 backdrop-blur-xl border-r border-white/5 flex-col">
        <SidebarContent />
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 w-64 max-w-[80%] bg-[#111114] backdrop-blur-xl border-r border-white/5 flex flex-col z-50 lg:hidden duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      <div className="flex-1 relative z-10 min-w-0">
        <header className="h-16 border-b border-white/5 bg-[#0A0A0D]/70 backdrop-blur-xl px-4 sm:px-5 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white duration-200 shrink-0"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base sm:text-lg font-semibold truncate">
              Dashboard
            </h2>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                Hello {user.name} 👋
              </h1>
              <p className="text-gray-500 text-[13px] mt-1">
                Here's what your AI assistant has lined up.
              </p>
            </div>
          </div>

          {taskdata.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 sm:p-10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                📋
              </div>

              <h2 className="text-lg font-semibold">No tasks found</h2>
              <p className="text-gray-500 text-[13px] mt-1.5">
                Create your first AI task to start managing your work.
              </p>

              <button
                onClick={() => navigate("/createtask")}
                className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-[13px] font-medium hover:shadow-lg hover:shadow-violet-600/25 hover:-translate-y-0.5 duration-200"
              >
                + Create First Task
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:border-violet-500/30 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-[12px]">Total Tasks</p>
                    <ListTodo size={14} className="text-gray-600 shrink-0" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {totalTask?.data}
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:border-amber-500/30 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-[12px]">Pending</p>
                    <Clock3 size={14} className="text-amber-500/60 shrink-0" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-400">
                    {totalTask?.pandingTask}
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:border-emerald-500/30 duration-200 xs:col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-[12px]">Completed</p>
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500/60 shrink-0"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400">
                    {totalTask?.complitedTask}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={fatchData}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-[13px] font-medium"
                >
                  All
                </button>

                <button
                  onClick={handelfilterPen}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-[13px] text-gray-400 hover:border-amber-500/40 hover:text-white duration-200"
                >
                  Pending
                </button>

                <button
                  onClick={handelfiltercom}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-[13px] text-gray-400 hover:border-emerald-500/40 hover:text-white duration-200"
                >
                  Completed
                </button>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/5">
                  <div>
                    <h2 className="text-base font-semibold">Recent Tasks</h2>
                    <p className="text-gray-500 text-[12px] mt-0.5">
                      Manage all your AI generated tasks.
                    </p>
                  </div>

                  <button
                    onClick={handelModel}
                    className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-[13px] font-medium hover:border-violet-500/40 duration-200 w-fit"
                  >
                    + Create Task
                  </button>
                </div>

                <div className="lg:hidden divide-y divide-white/5">
                  {taskdata.map((item) => (
                    <div key={item._id} className="p-4 flex gap-3">
                      <img
                        src={item.photo}
                        alt={item.taskName}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className={`font-medium text-[13px] break-words ${
                              item.status === "complited"
                                ? "line-through decoration-red-700 decoration-2 text-gray-400"
                                : "text-white"
                            }`}
                          >
                            {item.taskName}
                          </h3>
                          <StatusPill status={item.status} />
                        </div>

                        <p
                          className={`text-gray-500 text-[12px] mt-1 line-clamp-2 ${
                            item.status === "complited"
                              ? "line-through decoration-red-700 decoration-2"
                              : ""
                          }`}
                        >
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <button
                            onClick={() => handleToggle(item._id)}
                            className={`relative w-10 h-6 rounded-full transition-all duration-300 shrink-0 ${
                              item.status === "complited"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                                item.status === "complited"
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            ></div>
                          </button>

                          <button
                            onClick={() => handelDel(item._id)}
                            className="cursor-pointer px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[12px] font-medium duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full min-w-[820px]">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">
                          Image
                        </th>
                        <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">
                          Task
                        </th>
                        <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">
                          AI Description
                        </th>
                        <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">
                          Toggle
                        </th>
                        <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {taskdata.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b border-white/5 hover:bg-white/[0.02] duration-200"
                        >
                          <td className="px-4 sm:px-5 py-4">
                            <img
                              src={item.photo}
                              alt={item.taskName}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          </td>

                          <td className="px-4 sm:px-5 py-4">
                            <h3
                              className={`font-medium text-[13px] ${
                                item.status === "complited"
                                  ? "line-through decoration-red-700 decoration-2"
                                  : "text-white"
                              }`}
                            >
                              {item.taskName}
                            </h3>
                          </td>

                          <td className="px-4 sm:px-5 py-4 max-w-xs">
                            <p
                              className={`text-gray-500 text-[12px] line-clamp-2 ${
                                item.status === "complited"
                                  ? "line-through decoration-red-700 decoration-2"
                                  : "text-white"
                              }`}
                            >
                              {item.description}
                            </p>
                          </td>

                          <td className="px-4 sm:px-5 py-4">
                            <StatusPill status={item.status} />
                          </td>

                          <td className="px-4 sm:px-5 py-4">
                            <button
                              onClick={() => handleToggle(item._id)}
                              className={`relative w-10 h-6 rounded-full transition-all duration-300 ${
                                item.status === "complited"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                                  item.status === "complited"
                                    ? "translate-x-4"
                                    : "translate-x-0"
                                }`}
                              ></div>
                            </button>
                          </td>

                          <td className="px-4 sm:px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handelDel(item._id)}
                                className="cursor-pointer px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[12px] font-medium duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
