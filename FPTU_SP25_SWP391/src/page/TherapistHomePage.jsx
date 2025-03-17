// TherapistHomePage.jsx
import React, { useState, useEffect } from "react";
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
import {
  Schedule as ScheduleIcon,
  QuestionAnswer as QaIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Brightness4 as DarkModeIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Sidebar = styled(Drawer)(({ darkMode }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    background: darkMode
      ? "linear-gradient(180deg, #1c2526 0%, #2d3839 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
    borderRight: darkMode ? "1px solid #3d4a4b" : "1px solid #e0e0e0",
    paddingTop: "20px",
    boxShadow: darkMode
      ? "2px 0 8px rgba(0, 0, 0, 0.5)"
      : "2px 0 8px rgba(0, 0, 0, 0.05)",
  },
}));

const MainContent = styled(Box)(({ darkMode }) => ({
  flexGrow: 1,
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #1c2526 0%, #2d3839 100%)"
    : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
  transition: "all 0.3s ease",
}));

const StyledListItem = styled(ListItem)(({ darkMode, isActive }) => ({
  borderRadius: "8px",
  margin: "8px 16px",
  padding: "12px 20px",
  background: isActive ? (darkMode ? "#3d4a4b" : "#e0e0e0") : "transparent",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: darkMode ? "#3d4a4b" : "#f0f0f0",
    transform: "translateX(5px)",
  },
}));

const TherapistHomePage = ({ darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userId, token } = useAuth(); // Use userId and token directly

  useEffect(() => {
    if (location.state?.resetToHome) {
      setActiveSection("home");
      navigate("/skintherapist/home", { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    logout();
    setActiveSection("home");
    navigate("/sign_in", { replace: true });
  };

  const menuItems = [
    { text: "Choose Schedule", icon: <ScheduleIcon />, section: "schedule" },
    { text: "View QA Customer", icon: <QaIcon />, section: "qa-customer" },
    { text: "View Profile", icon: <PersonIcon />, section: "view-profile" },
    { text: "Edit Profile", icon: <EditIcon />, section: "edit-profile" },
    { text: "Toggle Dark Mode", icon: <DarkModeIcon />, action: toggleDarkMode },
    { text: "Logout", icon: <LogoutIcon />, action: handleLogout },
  ];

  const handleMenuClick = (section, action) => {
    if (action) {
      action();
    } else {
      setActiveSection(section);
      if (section === "schedule") {
        if (!userId || !token) {
          alert("Please log in to choose a schedule.");
          navigate("/sign_in");
          return;
        }
        navigate("/therapist/choose-schedule", { state: { therapistId: userId, token } });
      }
      if (section === "qa-customer") navigate("/therapist/qa-customer");
      if (section === "view-profile") navigate("/profile-role");
      if (section === "edit-profile") navigate("/edit-profilerole");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar variant="permanent" darkMode={darkMode}>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: darkMode ? "#ffffff" : "#1d1d1f",
              fontWeight: 700,
              textAlign: "center",
              mb: 3,
            }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Therapist Control Panel
          </Typography>
          <Divider sx={{ backgroundColor: darkMode ? "#3d4a4b" : "#e0e0e0", mb: 2 }} />
          <List>
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
                <ListItemIcon sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mr: 1 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}
                />
              </StyledListItem>
            ))}
          </List>
        </Box>
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
            color: darkMode ? "#ffffff" : "#1d1d1f",
            fontWeight: 700,
            mb: 4,
          }}
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Therapist Dashboard
        </Typography>

        {activeSection === "home" && (
          <Box>
            <Typography
              variant="h5"
              sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", mb: 2 }}
            >
              Welcome, Therapist!
            </Typography>
            <Typography sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
              Use the control panel on the left to manage your tasks and profile.
            </Typography>
          </Box>
        )}
      </MainContent>
    </Box>
  );
};

export default TherapistHomePage;