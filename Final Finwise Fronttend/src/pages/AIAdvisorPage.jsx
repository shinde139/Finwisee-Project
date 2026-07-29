// src/pages/AIAdvisorPage.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AIAdvisor from "../components/AIAdvisor";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

function AIAdvisorPage() {
  const { user, updateUser } = useAuth();
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserName = () => {
      try {
        if (user?.name) {
          setUserName(user.name);
          setLoading(false);
          return;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.name) {
            setUserName(parsedUser.name);
            updateUser(parsedUser);
            setLoading(false);
            return;
          }
        }

        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        if (name && email && userId && token) {
          const userData = { name, email, userId, token };
          setUserName(name);
          localStorage.setItem('user', JSON.stringify(userData));
          updateUser(userData);
          setLoading(false);
          return;
        }

        setUserName("User");
        setLoading(false);
        
      } catch (error) {
        console.error('Error getting user name:', error);
        setLoading(false);
      }
    };

    getUserName();
  }, [user, updateUser]);

  if (loading) {
    return (
      <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
        {/* STABLE/FIXED SIDEBAR */}
        <div className="fixed top-0 left-0 h-full z-50">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            AI Financial Advisor
          </h1>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Welcome,</p>
            <p className="text-lg font-bold text-cyan-400">{userName}</p>
          </div>
        </div>

        <div className="w-full">
          <AIAdvisor />
        </div>

        {/* FOOTER - CONSTANT */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AIAdvisorPage;