import React from "react";

const ServiceDetailDashboard = ({ darkMode }) => {
  return (
    <section
      className="service-detail-dashboard"
      style={{
        backgroundColor: darkMode ? "#34495e" : "#ffffff",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
        Service Details
      </h2>
      <p style={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
        View and manage details of the services you provide.
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
        View Services
      </button>
    </section>
  );
};

export default ServiceDetailDashboard;
