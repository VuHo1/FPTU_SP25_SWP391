import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { jwtDecode } from "jwt-decode";
// import { login } from "../../../api/testApi";

export default function SignIn({darkMode}) {
  // const [emali, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [inputType, setInputType] = useState("password");
  // const navigate = useNavigate();

  // const handleEmailChange = (event) => {
  //   setEmail(event);
  // };

  // const handlePasswordChange = (event) => {
  //   setPassword(event);
  // };

  // // Nếu muốn thêm chức năng hiển thị mật khẩu khi nhấn nút
  // const togglePasswordVisibility = () => {
  //   setInputType(inputType === "password" ? "text" : "password");
  // };

  // const handleSave = async () => {
  //   if (!emali || !password) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Please fill in all required fields!",
  //     });
  //     setIsLoading(false);
  //     return;
  //   }
  //   const data = {
  //     email: emali,
  //     password: password,
  //   };

  //   setIsLoading(true);

  //   try {
  //     const response = await login(data);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Login success!",
  //       text: response?.data?.message || "Successfully",
  //     });

  //     console.log("Data: ", response);

  //     const token = response.data.data.accessToken;
  //     localStorage.setItem("token", token);
  //     console.log("Token: ", token);

  //     // Giải mã token để lấy thông tin role
  //     const decodedToken = jwtDecode(token);
  //     const role =
  //       decodedToken[
  //         "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  //       ]; // Giả sử 'role' là key chứa role trong token
  //     localStorage.setItem("role", role);
  //     console.log("decode: ", decodedToken);

  //     const full_name =
  //       decodedToken[
  //         "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
  //       ];
  //     localStorage.setItem("full_name", full_name);

  //     localStorage.setItem("userId", decodedToken.id);

  //     // Chuyển hướng dựa trên role
  //     if (role === "User") {
  //       navigate("/");
  //     } else if (role === "Staff") {
  //       navigate("/shopProfile/shop");
  //     }
  //     console.log("Data: ", response);
  //   } catch (error) {
  //     let errorMessage = "An unknown error occurred.";

  //     try {
  //       const parsedResponse = JSON.parse(error.request.response);
  //       errorMessage = parsedResponse.message || errorMessage;
  //     } catch (parseError) {
  //       console.error("Error parsing JSON response:", parseError);
  //     }

  //     Swal.fire({
  //       icon: "error",
  //       title: "Please check your input!!!",
  //       text: errorMessage,
  //     });
  //     setIsLoading(false);
  //     console.error("An error occurred while sending the API request:", error);
  //   }
  // };

  // // Hàm xử lý khi nhấn phím Enter
  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     handleSave();
  //   }
  // };
 

      return (
          <div
              style={{
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: darkMode ? "#2c3e50" : "#f8b195", // Dark mode background
                  transition: "background-color 0.3s ease",
              }}
          >
              <div
                  style={{
                      backgroundColor: darkMode ? "#34495e" : "rgba(255, 255, 255, 0.9)", // Dark mode box
                      padding: "40px 50px",
                      borderRadius: "15px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      textAlign: "center",
                      width: "450px",
                      transition: "background-color 0.3s ease",
                  }}
              >
                  <div style={{ marginBottom: "20px" }}>
                      <Link to={`/`}>
                          <img
                              src="/assets/logo2-Photoroom.png"
                              alt="Logo"
                              style={{
                                  width: "150px",
                                  filter: darkMode ? "grayscale(100%) brightness(1)" : "grayscale(100%) brightness(1.5)", // Adjust logo brightness in dark mode
                              }}
                          />
                      </Link>
                  </div>
  
                  <h2
                      style={{
                          fontSize: "28px",
                          color: darkMode ? "#ecf0f1" : "#6c4f37", // Text color changes in dark mode
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: "600",
                          marginBottom: "30px",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                      }}
                  >
                      Welcome Back
                  </h2>
  
                  <input
                      type="text"
                      placeholder="Email Address"
                      style={{
                          width: "100%",
                          padding: "15px",
                          border: `2px solid ${darkMode ? "#ecf0f1" : "#6c4f37"}`, // Border color change in dark mode
                          backgroundColor: darkMode ? "#34495e" : "#f8f4e1",
                          color: darkMode ? "#ecf0f1" : "#6c4f37",
                          fontSize: "18px",
                          marginBottom: "20px",
                          borderRadius: "10px",
                          outline: "none",
                          fontFamily: "'Georgia', serif",
                          transition: "0.3s ease-in-out",
                      }}
                  />
  
                  <input
                      type="password"
                      placeholder="Password"
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
                          transition: "0.3s ease-in-out",
                      }}
                  />
  
                  <button
                      type="submit"
                      style={{
                          width: "100%",
                          padding: "15px",
                          backgroundColor: darkMode ? "#1abc9c" : "#6c4f37", // Button color change
                          color: "#fff",
                          fontSize: "18px",
                          fontWeight: "bold",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "0.3s ease-in-out",
                          fontFamily: "'Georgia', serif",
                      }}
                  >
                      Log In
                  </button>
  
                  <div style={{ marginTop: "20px" }}>
                      <h6
                          style={{
                              color: darkMode ? "#ecf0f1" : "#6c4f37", // Text color change in dark mode
                              marginBottom: "8px",
                              fontFamily: "'Georgia', serif",
                          }}
                      >
                          New to our Hotel?
                      </h6>
                      <Link
                          to={`/signUpUser`}
                          style={{
                              color: darkMode ? "#1abc9c" : "#6c4f37", // Link color change in dark mode
                              fontWeight: "bold",
                              textDecoration: "none",
                              fontFamily: "'Georgia', serif",
                              transition: "0.3s ease-in-out",
                          }}
                      >
                          Register Now
                      </Link>
                  </div>
  
                  <div style={{ marginTop: "10px" }}>
                      <h6
                          style={{
                              color: darkMode ? "#ecf0f1" : "#6c4f37", // Text color change in dark mode
                              marginBottom: "8px",
                              fontFamily: "'Georgia', serif",
                          }}
                      >
                          Forgot your password?
                      </h6>
                      <Link
                          to={`/forgotPassword`}
                          style={{
                              color: darkMode ? "#1abc9c" : "#6c4f37", // Link color change in dark mode
                              fontWeight: "bold",
                              textDecoration: "none",
                              fontFamily: "'Georgia', serif",
                              transition: "0.3s ease-in-out",
                          }}
                      >
                          Reset Password
                      </Link>
                  </div>
              </div>
          </div>
      );
  };
  
  