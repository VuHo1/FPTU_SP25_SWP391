// page/AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const login = (authData) => {
    console.log("Login called with:", authData);
    setIsLoggedIn(true);
    setUsername(authData.username);
    setUserId(authData.userId);
    setToken(authData.token);
    setRole(authData.role);
    localStorage.setItem("username", authData.username);
    localStorage.setItem("userId", authData.userId);
    localStorage.setItem("token", authData.token);
    localStorage.setItem("role", authData.role);
    console.log("AuthContext updated:", { username: authData.username, userId: authData.userId, token: authData.token, role: authData.role });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setUserId(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    console.log("Logged out, AuthContext cleared");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userId, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};