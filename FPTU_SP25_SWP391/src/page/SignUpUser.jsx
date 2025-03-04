import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { signUpUser } from "../api/testApi";

export default function SignUp({ darkMode }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const roleToIdMap = {
    User: 1,
    Therapist: 2,
    Staff: 3,
    Admin: 4,
  };

  const handleSignUp = async (e) => {
    if (e) e.preventDefault();
    if (!userName || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password mismatch!",
        text: "Please confirm your password correctly!",
      });
      return;
    }

    setIsLoading(true);
    const data = {
      userName:userName,
      email:email,
      password:password,
      roleId: role
    };

    try {
      const response = await signUpUser(data);
      // Logs for debugging successful signup
      console.log("Signup Successful! Input Data:", {
        userName,
        email,
        password: "[REDACTED]", // Avoid logging sensitive data directly
        role,
        roleId: roleToIdMap[role],
      });
      console.log("API Response:", response);
      console.log("Full Response Object:", {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      Swal.fire({
        icon: "success",
        title: "Sign Up Successful!",
        text: "You can now log in.",
      });
      navigate("/sign_in");
    } catch (error) {
      console.error("Sign Up Error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed!",
        text: error.response?.data?.message || error.message || "An error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: darkMode
          ? "linear-gradient(135deg, #1c2526 0%, #34495e 100%)"
          : "linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%)",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundColor: darkMode
            ? "rgba(52, 73, 94, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          padding: "40px 50px",
          borderRadius: "20px",
          boxShadow: darkMode
            ? "0 8px 30px rgba(0, 0, 0, 0.5)"
            : "0 8px 30px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "450px",
          backdropFilter: "blur(10px)",
          border: darkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "28px",
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "700",
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Create an Account
        </motion.h2>

        <form onSubmit={handleSignUp}>
          <motion.input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: darkMode ? "1px solid #ecf0f1" : "1px solid #ccc",
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontSize: "16px",
              marginBottom: "20px",
              borderRadius: "12px",
              outline: "none",
              fontFamily: "'Roboto', sans-serif",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = darkMode ? "#1abc9c" : "#6c4f37";
              e.target.style.boxShadow = darkMode
                ? "0 0 8px rgba(26, 188, 156, 0.5)"
                : "0 0 8px rgba(108, 79, 55, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? "#ecf0f1" : "#ccc";
              e.target.style.boxShadow = "none";
            }}
            required
          />

          <motion.input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: darkMode ? "1px solid #ecf0f1" : "1px solid #ccc",
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontSize: "16px",
              marginBottom: "20px",
              borderRadius: "12px",
              outline: "none",
              fontFamily: "'Roboto', sans-serif",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = darkMode ? "#1abc9c" : "#6c4f37";
              e.target.style.boxShadow = darkMode
                ? "0 0 8px rgba(26, 188, 156, 0.5)"
                : "0 0 8px rgba(108, 79, 55, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? "#ecf0f1" : "#ccc";
              e.target.style.boxShadow = "none";
            }}
            required
          />

          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: darkMode ? "1px solid #ecf0f1" : "1px solid #ccc",
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontSize: "16px",
              marginBottom: "20px",
              borderRadius: "12px",
              outline: "none",
              fontFamily: "'Roboto', sans-serif",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = darkMode ? "#1abc9c" : "#6c4f37";
              e.target.style.boxShadow = darkMode
                ? "0 0 8px rgba(26, 188, 156, 0.5)"
                : "0 0 8px rgba(108, 79, 55, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? "#ecf0f1" : "#ccc";
              e.target.style.boxShadow = "none";
            }}
            required
          />

          <motion.input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: darkMode ? "1px solid #ecf0f1" : "1px solid #ccc",
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontSize: "16px",
              marginBottom: "20px",
              borderRadius: "12px",
              outline: "none",
              fontFamily: "'Roboto', sans-serif",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = darkMode ? "#1abc9c" : "#6c4f37";
              e.target.style.boxShadow = darkMode
                ? "0 0 8px rgba(26, 188, 156, 0.5)"
                : "0 0 8px rgba(108, 79, 55, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? "#ecf0f1" : "#ccc";
              e.target.style.boxShadow = "none";
            }}
            required
          />

          <motion.select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: darkMode ? "1px solid #ecf0f1" : "1px solid #ccc",
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontSize: "16px",
              marginBottom: "25px",
              borderRadius: "12px",
              outline: "none",
              fontFamily: "'Roboto', sans-serif",
              cursor: "pointer",
              appearance: "none",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = darkMode ? "#1abc9c" : "#6c4f37";
              e.target.style.boxShadow = darkMode
                ? "0 0 8px rgba(26, 188, 156, 0.5)"
                : "0 0 8px rgba(108, 79, 55, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? "#ecf0f1" : "#ccc";
              e.target.style.boxShadow = "none";
            }}
            required
          >
            <option value="1">User (Role ID: 1)</option>
            <option value="2">Therapist (Role ID: 2)</option>
            <option value="3">Staff (Role ID: 3)</option>
            <option value="4">Admin (Role ID: 4)</option>
          </motion.select>

          <motion.button
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: darkMode ? "#1abc9c" : "#6c4f37",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "600",
              border: "none",
              borderRadius: "12px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "'Poppins', sans-serif",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              boxShadow: darkMode
                ? "0 4px 15px rgba(26, 188, 156, 0.3)"
                : "0 4px 15px rgba(108, 79, 55, 0.2)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = darkMode ? "#16a085" : "#503a28")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = darkMode ? "#1abc9c" : "#6c4f37")
            }
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          style={{ marginTop: "20px" }}
        >
          <h6
            style={{
              color: darkMode ? "#bdc3c7" : "#7f8c8d",
              fontSize: "14px",
              marginBottom: "10px",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Already have an account?
          </h6>
          <Link
            to="/sign_in"
            style={{
              color: darkMode ? "#1abc9c" : "#6c4f37",
              fontWeight: "600",
              textDecoration: "none",
              fontFamily: "'Roboto', sans-serif",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = darkMode ? "#16a085" : "#503a28")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = darkMode ? "#1abc9c" : "#6c4f37")
            }
          >
            Sign In
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}