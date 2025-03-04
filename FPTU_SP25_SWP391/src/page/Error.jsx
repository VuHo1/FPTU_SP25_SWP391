// page/Error.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const Error = ({ darkMode }) => {
  return (
    <div
      className={`error-page ${darkMode ? "dark" : ""}`}
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: darkMode ? "#1c2526" : "#fafafa",
        padding: "20px",
      }}
    >
      <div
        className="error-container"
        style={{
          backgroundColor: darkMode ? "#2d3536" : "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: darkMode
            ? "0 6px 12px rgba(0, 0, 0, 0.3)"
            : "0 6px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          style={{
            fontSize: "60px",
            color: darkMode ? "#ff4d4d" : "#dc3545",
            marginBottom: "20px",
          }}
        />
        <h1
          style={{
            color: darkMode ? "#ffffff" : "#1d1d1f",
            fontSize: "32px",
            marginBottom: "15px",
          }}
        >
          Oops! Something Went Wrong
        </h1>
        <p
          style={{
            color: darkMode ? "#a1a1a6" : "#6e6e73",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          We encountered an unexpected error. Please try again later or return to the homepage.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: darkMode ? "#00d4ff" : "#007aff",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = darkMode ? "#00b8d9" : "#0056b3")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = darkMode ? "#00d4ff" : "#007aff")
          }
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Error;