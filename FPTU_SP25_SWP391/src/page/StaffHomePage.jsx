import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBuilding,
  faComments,
  faUser,
  faEdit,
  faMoon,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import ScheduleSelectionStaff from "../page/ScheduleSelectionStaff";
import ServiceDetailDashboard from "../page/ServiceDetailDashboard";
import QaStaff from "../page/QaStaff";
import ScheduleManagement from "../page/ScheduleManagement";

// Sidebar Styling
const Sidebar = styled(Drawer)(({ darkMode }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    height: "100vh",
    background: darkMode
      ? "linear-gradient(180deg, #1c2526 0%, #34495e 100%)"
      : "linear-gradient(180deg, #f8f4e1 0%, #e5e5e5 100%)",
    borderRight: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
    paddingTop: "10px", // Reduced padding
    boxShadow: darkMode
      ? "2px 0 8px rgba(0, 0, 0, 0.4)"
      : "2px 0 8px rgba(0, 0, 0, 0.15)",
    overflowY: "hidden", // No scrolling
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

// Main Content Styling
const MainContent = styled(Box)(({ darkMode }) => ({
  flexGrow: 1,
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #1c2526 0%, #34495e 100%)"
    : "linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%)",
  transition: "all 0.3s ease",
}));

// Styled List Item
const StyledListItem = styled(ListItem)(({ darkMode, isActive }) => ({
  borderRadius: "8px",
  margin: "4px 12px", // Reduced margin
  padding: "8px 16px", // Reduced padding
  background: isActive ? (darkMode ? "#5a758c" : "#e0e0e0") : "transparent",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: darkMode ? "#455a64" : "#f8f4e1",
    transform: "translateX(5px)",
  },
}));

// Service Container Styling
const ServiceContainer = styled(Box)(({ darkMode }) => ({
  background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
  padding: "20px",
  borderRadius: "8px",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
  boxShadow: darkMode
    ? "0 8px 24px rgba(0, 0, 0, 0.4)"
    : "0 8px 24px rgba(0, 0, 0, 0.15)",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
}));

const StaffHomePage = ({ darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    setActiveSection("home");
    navigate("/sign_in", { replace: true });
  };

  const menuItems = [
    { text: "Therapist Edit Service", icon: <FontAwesomeIcon icon={faCalendar} />, section: "schedule" },
    { text: "View Services", icon: <FontAwesomeIcon icon={faBuilding} />, section: "services" },
    { text: "View QA Customer", icon: <FontAwesomeIcon icon={faComments} />, section: "qa-customer" },
    { text: "View Schedules", icon: <FontAwesomeIcon icon={faCalendar} />, section: "schedules" },
    { text: "View Profile", icon: <FontAwesomeIcon icon={faUser} />, section: "view-profile" },
    { text: "Edit Profile", icon: <FontAwesomeIcon icon={faEdit} />, section: "edit-profile" },
    { text: "Toggle Dark Mode", icon: <FontAwesomeIcon icon={faMoon} />, action: toggleDarkMode },
    { text: "Logout", icon: <FontAwesomeIcon icon={faSignOutAlt} />, action: handleLogout },
  ];

  const handleMenuClick = (section, action) => {
    if (action) {
      action();
    } else {
      setActiveSection(section);
      if (section === "qa-customer") navigate("/staff/qa-customer");
      if (section === "view-profile") navigate("/profile-role");
      if (section === "edit-profile") navigate("/edit-profilerole");
    }
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 1 }}>
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            mb: 2, // Reduced margin
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.2rem", // Smaller font
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FontAwesomeIcon icon={faUser} /> Staff Control Panel
        </Typography>
        <Divider sx={{ backgroundColor: darkMode ? "#5a758c" : "#ccc", my: 1 }} /> {/* Reduced margin */}
        <List sx={{ padding: 0 }}>
          {menuItems.map((item) => (
            <StyledListItem
              button
              key={item.text}
              onClick={() => handleMenuClick(item.section, item.action)}
              darkMode={darkMode}
              isActive={activeSection === item.section}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItemIcon sx={{ color: darkMode ? "#1abc9c" : "#6c4f37", mr: 1, minWidth: "30px" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 500,
                    color: darkMode ? "#ecf0f1" : "#2c3e50",
                    fontSize: "0.9rem", // Smaller font
                  },
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar variant="permanent" darkMode={darkMode}>
        {drawerContent}
      </Sidebar>

      <MainContent
        darkMode={darkMode}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            fontWeight: 700,
            mb: 4,
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FontAwesomeIcon icon={faCalendar} /> Staff Dashboard
        </Typography>

        {activeSection === "home" && (
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
              }}
            >
              Welcome, Staff Member!
            </Typography>
            <Typography
              sx={{
                color: darkMode ? "#bdc3c7" : "#7f8c8d",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1rem",
              }}
            >
              Use the control panel on the left to manage your tasks and profile.
            </Typography>
          </Box>
        )}

        {activeSection === "schedule" && <ScheduleSelectionStaff darkMode={darkMode} />}
        {activeSection === "services" && (
          <ServiceContainer darkMode={darkMode}>
            <ServiceDetailDashboard darkMode={darkMode} />
          </ServiceContainer>
        )}
        {activeSection === "qa-customer" && <QaStaff darkMode={darkMode} />}
        {activeSection === "schedules" && <ScheduleManagement darkMode={darkMode} />}
      </MainContent>
    </Box>
  );
};

StaffHomePage.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default StaffHomePage;