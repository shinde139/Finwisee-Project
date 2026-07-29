// components/Sidebar.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  FaHome,
  FaWallet,
  FaMoneyBill,
  FaBullseye,
  FaChartBar,
  FaExchangeAlt,
  FaUser,
  FaCog,
  FaRobot,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTags // Added for Categories
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ SAFE USER INITIALIZATION
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  }, []);

  // ✅ SYNC USER WHEN LOCALSTORAGE CHANGES
  useEffect(() => {
    const syncUser = () => {
      try {
        const userData = localStorage.getItem("user");
        setUser(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error("Error syncing user data:", error);
        setUser(null);
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdate", syncUser);
    
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdate", syncUser);
    };
  }, []);

  // ✅ CLOSE SIDEBAR ON ROUTE CHANGE (MOBILE)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ✅ CLOSE SIDEBAR ON ESCAPE KEY
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  // ✅ PREVENT BODY SCROLL WHEN SIDEBAR IS OPEN (MOBILE)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const menu = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Expenses", icon: <FaWallet />, path: "/expenses" },
    { name: "Income", icon: <FaMoneyBill />, path: "/income" },
    { name: "Budgets", icon: <FaChartBar />, path: "/budgets" },
    { name: "Goals", icon: <FaBullseye />, path: "/goals" },
    { name: "AI Advisor", icon: <FaRobot />, path: "/advisor" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "Transactions", icon: <FaExchangeAlt />, path: "/transactions" },
    { name: "Categories", icon: <FaTags />, path: "/categories" }, // ✅ Added Categories
    { name: "Profile", icon: <FaUser />, path: "/profile" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  const handleLogout = useCallback(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new Event("userUpdate"));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigate]);

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#050B2D] p-4 flex justify-between items-center border-b border-[#1B2559]">
        <h1 className="text-2xl font-bold text-white">
          FIN<span className="text-green-400">WISEE</span>
        </h1>

        <button 
          onClick={() => setOpen(true)} 
          className="text-white text-2xl"
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-screen w-72
          bg-gradient-to-b from-[#050B2D] to-[#091540]
          border-r border-[#1B2559]
          p-5 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto
          scrollbar-hide
        `}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* CLOSE BUTTON */}
        <div className="lg:hidden flex justify-end mb-4">
          <button 
            onClick={() => setOpen(false)} 
            className="text-white text-2xl"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            <span className="text-white">FIN</span>
            <span className="text-green-400">WISEE</span>
          </h1>

          <p className="text-gray-300 mt-3 text-lg font-semibold">
            {user?.name || "Guest"}
          </p>

          <p className="text-gray-400 text-sm">
            Plan Today, Secure Tomorrow
          </p>
        </div>

        {/* MENU */}
        <div className="space-y-2">
          {menu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition ${
                location.pathname === item.path 
                  ? 'bg-purple-700 text-white' 
                  : 'hover:bg-purple-700 text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* HIDE SCROLLBAR STYLES */}
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
}

export default Sidebar;