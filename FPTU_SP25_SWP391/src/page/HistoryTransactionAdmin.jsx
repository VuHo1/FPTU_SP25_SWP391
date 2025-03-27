import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const MainContent = styled(Box)(({ darkMode }) => ({
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #1c2526 0%, #34495e 100%)"
    : "linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%)",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
}));

const HistoryTransactionAdmin = ({ darkMode }) => {
  return (
    <MainContent darkMode={darkMode}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Transaction History - Admin
      </Typography>
      <Typography variant="body1">
        This page will display the transaction history for all users. (To be implemented)
      </Typography>
    </MainContent>
  );
};

export default HistoryTransactionAdmin;