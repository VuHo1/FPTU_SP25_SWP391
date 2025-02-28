import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function ForgotPassword({ darkMode }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your email address!",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Placeholder for API call (e.g., await resetPassword({ email }))
      // Replace this with your actual API call when implemented
      Swal.fire({
        icon: "success",
        title: "Reset Link Sent!",
        text: "Check your email for a password reset link.",
      });
      navigate("/sign_in"); // Redirect to sign-in after success
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed!",
        text: error.message || "An error occurred. Please try again.",
      });
    }
    setIsLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleResetPassword();
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
          backgroundColor: darkMode ? "rgba(52, 73, 94, 0.95)" : "rgba(255, 255, 255, 0.95)",
          padding: "40px 50px",
          borderRadius: "20px",
          boxShadow: darkMode
            ? "0 8px 30px rgba(0, 0, 0, 0.5)"
            : "0 8px 30px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "450px",
          backdropFilter: "blur(10px)", // Frosted glass effect
          border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
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
          Forgot Password
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            color: darkMode ? "#bdc3c7" : "#7f8c8d",
            fontSize: "16px",
            fontFamily: "'Roboto', sans-serif",
            marginBottom: "25px",
          }}
        >
          Enter your email to receive a password reset link.
        </motion.p>

        <motion.input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
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
            marginBottom: "25px",
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

        <motion.button
          onClick={handleResetPassword}
          disabled={isLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
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
          {isLoading ? "Sending..." : "Send Reset Link"}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
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
            Remembered your password?
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