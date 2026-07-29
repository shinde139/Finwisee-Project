import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaYoutube,
  FaShieldHeart,
  FaChartLine,
  FaCoins,
  FaRocket
} from "react-icons/fa6";

function Footer() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0
  });

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/dashboard/summary", {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      setSummary(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <footer className="fixed bottom-0 left-[288px] right-0 h-20 bg-[#0B1235] border-t border-[#1B2559] z-[999] px-8 flex items-center justify-between backdrop-blur-sm bg-opacity-95">
      
      {/* Left Section - Brand */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
            FW
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-bold text-lg leading-tight">FIN WISEE</h1>
            <p className="text-gray-500 text-xs">Smart Finance Tracker</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-gray-400 text-sm">
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">Support</span>
        </div>
      </div>

      {/* Center Section - Quick Stats */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#11183C] border border-[#1B2559]">
          <FaShieldHeart className="text-cyan-400 text-sm" />
          <span className="text-gray-300 text-xs">Secure</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#11183C] border border-[#1B2559]">
          <FaChartLine className="text-green-400 text-sm" />
          <span className="text-gray-300 text-xs">Live</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#11183C] border border-[#1B2559]">
          <FaCoins className="text-yellow-400 text-sm" />
          <span className="text-gray-300 text-xs">Smart</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <FaRocket className="text-purple-400 text-sm" />
          <span className="text-purple-300 text-xs font-medium">Pro</span>
        </div>
      </div>

      {/* Right Section - Social Links & Copyright */}
      <div className="flex items-center gap-4">
        {/* Social Icons */}
        <div className="flex items-center gap-2">
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#1B2559] flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-[#26316A] transition-all duration-300 hover:scale-110"
          >
            <FaTwitter className="text-xs" />
          </a>
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#1B2559] flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-[#26316A] transition-all duration-300 hover:scale-110"
          >
            <FaLinkedin className="text-xs" />
          </a>
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#1B2559] flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-[#26316A] transition-all duration-300 hover:scale-110"
          >
            <FaGithub className="text-xs" />
          </a>
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#1B2559] flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-[#26316A] transition-all duration-300 hover:scale-110"
          >
            <FaYoutube className="text-xs" />
          </a>
        </div>

        <div className="w-px h-8 bg-[#1B2559]"></div>

        <div className="text-gray-500 text-xs whitespace-nowrap">
          © 2026 FIN WISEE
        </div>
      </div>
    </footer>
  );
}

export default Footer;