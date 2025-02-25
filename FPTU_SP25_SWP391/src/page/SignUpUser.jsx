import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { register } from "../api/testApi";

export default function SignUp({ darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
    const [role, setRole] = useState("User"); // Default role
  

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please fill in all required fields!" });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Password mismatch!", text: "Please confirm your password correctly!" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({ email, password });
      Swal.fire({ icon: "success", title: "Sign Up Successful!", text: "You can now log in." });
      navigate("/sign_in");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Sign Up Failed!", text: error.message || "An error occurred." });
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: `url('https://cdn.chiaki.vn/unsafe/0x480/left/top/smart/filters:quality(75)/https://chiaki.vn/upload/news/content/2024/06/cach-chon-san-pham-skincare-phu-hop-jpg-1718864826-20062024132706.jpg') no-repeat center center fixed`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          backgroundColor: darkMode ? "#34495e" : "rgba(255, 255, 255, 0.9)",
          padding: "40px 50px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "450px",
        }}
      >
        <h2 style={{ fontSize: "28px", color: darkMode ? "#ecf0f1" : "#6c4f37", fontWeight: "600", marginBottom: "30px" }}>Create an Account</h2>

        <input
          type="email"
          placeholder="Email Address"
          style={{ width: "100%", padding: "15px", border: `2px solid ${darkMode ? "#ecf0f1" : "#6c4f37"}`, backgroundColor: darkMode ? "#34495e" : "#f8f4e1", color: darkMode ? "#ecf0f1" : "#6c4f37", fontSize: "18px", marginBottom: "20px", borderRadius: "10px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", padding: "15px", border: `2px solid ${darkMode ? "#ecf0f1" : "#6c4f37"}`, backgroundColor: darkMode ? "#34495e" : "#f8f4e1", color: darkMode ? "#ecf0f1" : "#6c4f37", fontSize: "18px", marginBottom: "20px", borderRadius: "10px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          style={{ width: "100%", padding: "15px", border: `2px solid ${darkMode ? "#ecf0f1" : "#6c4f37"}`, backgroundColor: darkMode ? "#34495e" : "#f8f4e1", color: darkMode ? "#ecf0f1" : "#6c4f37", fontSize: "18px", marginBottom: "25px", borderRadius: "10px" }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

<select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            border: `2px solid ${darkMode ? "#ecf0f1" : "#6c4f37"}`,
            backgroundColor: darkMode ? "#34495e" : "#f8f4e1",
            color: darkMode ? "#ecf0f1" : "#6c4f37",
            fontSize: "18px",
            marginBottom: "25px",
            borderRadius: "10px",
            outline: "none",
            fontFamily: "'Georgia', serif",
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value="User">User</option>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          style={{ width: "100%", padding: "15px", backgroundColor: darkMode ? "#1abc9c" : "#6c4f37", color: "#fff", fontSize: "18px", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}
          onClick={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        <div style={{ marginTop: "20px" }}>
          <h6 style={{ color: darkMode ? "#ecf0f1" : "#6c4f37", marginBottom: "8px" }}>Already have an account?</h6>
          <Link to="/sign_in" style={{ color: darkMode ? "#1abc9c" : "#6c4f37", fontWeight: "bold", textDecoration: "none" }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
