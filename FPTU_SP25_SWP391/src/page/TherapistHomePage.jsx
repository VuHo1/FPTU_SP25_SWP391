import React from "react";

export default function TherapistHomePage({ darkMode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: darkMode ? "#1c2526" : "#fafafa",
      }}
    >
      <h1 style={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
        Skin Therapist Home Page
      </h1>
      <p style={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
        Welcome, Skin Therapist! Manage your appointments and treatments here.
      </p>
    </div>
  );
}