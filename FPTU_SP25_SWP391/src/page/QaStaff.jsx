import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

// QA Container Styling
const QaContainer = styled(Box)(({ darkMode }) => ({
  background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
  padding: "20px",
  borderRadius: "8px",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
  boxShadow: darkMode
    ? "0 8px 24px rgba(0, 0, 0, 0.4)"
    : "0 8px 24px rgba(0, 0, 0, 0.15)",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
}));

const QaStaff = ({ darkMode }) => {
  return (
    <QaContainer
      darkMode={darkMode}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Typography
        variant="h5"
        sx={{
          color: darkMode ? "#ecf0f1" : "#2c3e50",
          fontWeight: 600,
          mb: 2,
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <FontAwesomeIcon icon={faComments} /> Customer Q&A
      </Typography>
      <Typography
        sx={{
          color: darkMode ? "#bdc3c7" : "#7f8c8d",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "1rem",
        }}
      >
        This section is for staff to view and respond to customer questions. (Placeholder content)
      </Typography>
      {/* Add your QA logic here, e.g., fetch questions, display a list, etc. */}
    </QaContainer>
  );
};

export default QaStaff;