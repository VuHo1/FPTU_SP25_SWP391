// page/AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null); // Add username state

  const login = (userName) => {
    setIsLoggedIn(true);
    setUsername(userName); // Update username when logging in
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null); // Clear username on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);