import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../api/testApi";
import { motion } from "framer-motion";
import { useAuth } from "../page/AuthContext";
import { jwtDecode } from "jwt-decode";
import "../styles/SignIn.css";

export default function SignIn({ darkMode }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState("password");
  const navigate = useNavigate();
  const { login: setAuthData } = useAuth();

  const handleEmailChange = (event) => setUserName(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const togglePasswordVisibility = () => setInputType(inputType === "password" ? "text" : "password");

  const handleSave = async () => {
    if (!userName || !password) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please fill in all required fields!" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await login({ userName, password });
      Swal.fire({ icon: "success", title: "Login success!", text: response?.data?.message || "Successfully" });

      const { token, userId } = response.data;
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      setAuthData({ username: userName, userId, token, role });

      switch (role) {
        case "Customer": navigate("/"); break;
        case "Staff": navigate("/staff/home"); break;
        case "Admin": navigate("/admin/home"); break;
        case "Therapist": navigate("/skintherapist/home"); break;
        default: navigate("/");
      }
      setIsLoading(false);
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error.response) errorMessage = error.response.data.message || error.response.data || "Login failed.";
      else if (error.request) errorMessage = "No response from the server. Please check your network.";
      else errorMessage = error.message || "An unexpected error occurred.";

      Swal.fire({ icon: "error", title: "Please check your input!!!", text: errorMessage });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSave();
  };

  return (
    <div className={`sign-in-container ${darkMode ? "dark" : "light"}`}>
      <motion.div className="sign-in-box" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <motion.div className="sign-in-logo" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Link to="/">
            <img src="/src/assets/images/logo/logo.png" alt="Logo" className="logo-img" />
          </Link>
        </motion.div>

        <motion.h2 className="sign-in-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          Welcome Back
        </motion.h2>

        <motion.input type="text" placeholder="Username" value={userName} onChange={handleEmailChange} onKeyDown={handleKeyDown}
          className="sign-in-input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }} />

        <motion.div className="password-container" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
          <input type={inputType} placeholder="Password" value={password} onChange={handlePasswordChange} onKeyDown={handleKeyDown} className="sign-in-input" />
          <span className="password-toggle" onClick={togglePasswordVisibility}>{inputType === "password" ? "Show" : "Hide"}</span>
        </motion.div>

        <motion.button type="submit" onClick={handleSave} disabled={isLoading} className="sign-in-button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {isLoading ? "Logging In..." : "Log In"}
        </motion.button>

        <motion.div className="sign-in-links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }}>
          <h6>New to our Service?</h6>
          <Link to="/signUpUser" className="sign-in-link">Register Now</Link>
          <h6>Forgot your password?</h6>
          <Link to="/forgotPassword" className="sign-in-link">Reset Password</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
