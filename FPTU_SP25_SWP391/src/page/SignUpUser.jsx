import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { signUpUser } from "../api/testApi";
import "../styles/SignUpUser.css"; // Import CSS file

export default function SignUpUser({ darkMode }) {
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
    const data = { userName, email, password, roleId: role };

    try {
      const response = await signUpUser(data);
      console.log("Signup Successful!", { userName, email, role, roleId: roleToIdMap[role] });
      console.log("API Response:", response);
      Swal.fire({ icon: "success", title: "Sign Up Successful!", text: "You can now log in." });
      navigate("/sign_in");
    } catch (error) {
      console.error("Sign Up Error:", error.response?.data || error.message);
      Swal.fire({ icon: "error", title: "Sign Up Failed!", text: error.response?.data?.message || "An error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`signup-container ${darkMode ? "dark-mode" : ""}`}>
      <motion.div className="signup-box" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <motion.h2 className="signup-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          Create an Account
        </motion.h2>

        <form onSubmit={handleSignUp}>
          <motion.input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} className="signup-input" required />
          <motion.input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="signup-input" required />
          <motion.input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" required />
          <motion.input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="signup-input" required />

          <motion.button type="submit" disabled={isLoading} className="signup-button">
            {isLoading ? "Signing Up..." : "Sign Up"}
          </motion.button>
        </form>

        <motion.div className="signup-footer">
          <h6>Already have an account?</h6>
          <Link to="/sign_in" className="signup-link">Sign In</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
