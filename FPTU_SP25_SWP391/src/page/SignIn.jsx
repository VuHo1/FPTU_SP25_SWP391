import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { login } from "../api/testApi";
import { motion } from "framer-motion";

export default function SignIn({ darkMode }) {
  const [userName, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default role
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputType, setInputType] = useState("password");
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Fixed to use target.value
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // Fixed to use target.value
  };

  const togglePasswordVisibility = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const handleSave = async () => {
    if (!userName || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      setIsLoading(false);
      return;
    }
    const data = { userName, password };
    setIsLoading(true);

    try {
      const response = await login(data);
      Swal.fire({
        icon: "success",
        title: "Login success!",
        text: response?.data?.message || "Successfully",
      });

      const token = response.data.data.accessToken;
      localStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);
      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      localStorage.setItem("role", role);

      const full_name =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];
      localStorage.setItem("full_name", full_name);

      localStorage.setItem("userId", decodedToken.id);

      if (role === "User") {
        navigate("/");
      } else if (role === "Staff") {
        navigate("/shopProfile/shop");
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      try {
        const parsedResponse = JSON.parse(error.request.response);
        errorMessage = parsedResponse.message || errorMessage;
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
      }
      Swal.fire({
        icon: "error",
        title: "Please check your input!!!",
        text: errorMessage,
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSave();
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
          : "linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%)", // Professional gradient
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
          backdropFilter: "blur(10px)", // Frosted glass effect
          border: darkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: "25px" }}
        >
          <Link to={`/`}>
            <img
              src="/assets/logo2-Photoroom.png"
              alt="Logo"
              style={{
                width: "150px",
                filter: darkMode ? "brightness(1.2)" : "none",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </Link>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
          Welcome Back
        </motion.h2>

        <motion.input
          type="text"
          placeholder="Email Address"
          value={userName}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
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
        />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ position: "relative", marginBottom: "20px" }}
        >
          <input
            type={inputType}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: darkMode ? "1px solid #ecf0f1" : "1px solid #ccc",
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontSize: "16px",
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
          />
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: darkMode ? "#1abc9c" : "#6c4f37",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {inputType === "password" ? "Show" : "Hide"}
          </span>
        </motion.div>

        <motion.select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
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
        >
          <option value="User">User</option>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </motion.select>

        <motion.button
          type="submit"
          onClick={handleSave}
          disabled={isLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
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
            (e.currentTarget.style.backgroundColor = darkMode
              ? "#16a085"
              : "#503a28")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = darkMode
              ? "#1abc9c"
              : "#6c4f37")
          }
        >
          {isLoading ? "Logging In..." : "Log In"}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
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
            New to our Service?
          </h6>
          <Link
            to={`/signUpUser`}
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
            Register Now
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          style={{ marginTop: "15px" }}
        >
          <h6
            style={{
              color: darkMode ? "#bdc3c7" : "#7f8c8d",
              fontSize: "14px",
              marginBottom: "10px",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Forgot your password?
          </h6>
          <Link
            to={`/forgotPassword`}
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
            Reset Password
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
