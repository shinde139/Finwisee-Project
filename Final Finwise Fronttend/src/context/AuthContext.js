// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userId = localStorage.getItem('userId');
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      const profileImageUrl = localStorage.getItem('profileImageUrl');
      const profileImageThumbnail = localStorage.getItem('profileImageThumbnail');
      
      if (userId) {
        return {
          userId,
          name,
          email,
          profileImageUrl,
          profileImageThumbnail
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const login = (userData) => {
    console.log("📝 AuthContext login called with:", userData);
    
    try {
      // ✅ Store user data
      const userToStore = {
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        profileImageUrl: userData.profileImageUrl || null,
        profileImageThumbnail: userData.profileImageThumbnail || null
      };
      
      setUser(userToStore);
      
      // ✅ Store in localStorage
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('name', userData.name);
      localStorage.setItem('email', userData.email);
      
      if (userData.profileImageUrl) {
        localStorage.setItem('profileImageUrl', userData.profileImageUrl);
        console.log("✅ AuthContext stored profileImageUrl:", userData.profileImageUrl);
      }
      
      if (userData.profileImageThumbnail) {
        localStorage.setItem('profileImageThumbnail', userData.profileImageThumbnail);
      }
      
      console.log("✅ AuthContext: User stored successfully");
      return true;
    } catch (error) {
      console.error("❌ AuthContext login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};