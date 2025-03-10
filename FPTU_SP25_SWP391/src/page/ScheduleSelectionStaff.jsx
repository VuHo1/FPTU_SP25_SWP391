import React from "react";

const ScheduleSelectionStaff = ({ darkMode }) => {
  return (
    <section
      className="schedule-selection"
      style={{
        backgroundColor: darkMode ? "#2c3e50" : "#f0f0f0",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
        Choose Your Schedule
      </h2>
      <p style={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
        Select your preferred working schedule.
      </p>
      <button
        style={{
          padding: "10px",
          backgroundColor: darkMode ? "#00d4ff" : "#007aff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Select Schedule
      </button>
    </section>
  );
};

export default ScheduleSelectionStaff;
