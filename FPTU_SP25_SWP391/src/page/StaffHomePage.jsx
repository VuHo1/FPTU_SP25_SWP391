import React, { useState, useEffect } from "react";
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
  CircularProgress,
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
  faBook, // Icon mới cho View Bookings
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
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
    paddingTop: "10px",
    boxShadow: darkMode
      ? "2px 0 8px rgba(0, 0, 0, 0.4)"
      : "2px 0 8px rgba(0, 0, 0, 0.15)",
    overflowY: "hidden",
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
  margin: "4px 12px",
  padding: "8px 16px",
  background: isActive ? (darkMode ? "#5a758c" : "#e0e0e0") : "transparent",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: darkMode ? "#455a64" : "#f8f4e1",
    transform: "translateX(5px)",
  },
}));

// Booking Card Styling
const BookingCard = styled(Box)(({ darkMode }) => ({
  padding: "15px",
  marginBottom: "15px",
  background: darkMode ? "rgba(69, 90, 100, 0.9)" : "rgba(248, 244, 225, 0.9)",
  borderRadius: "10px",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
  '& *': { // Áp dụng màu chữ cho tất cả phần tử con (Typography)
    color: 'inherit', // Đảm bảo Typography kế thừa màu từ BookingCard
  },
}));

const StaffHomePage = ({ darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: "https://kinaa1410-001-site1.qtempurl.com/api",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "*/*",
    },
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [bookingsResponse, usersResponse, timeSlotsResponse] = await Promise.all([
        axiosInstance.get("/bookings"),
        axiosInstance.get("/users"),
        axiosInstance.get("/timeslot"),
      ]);
      setBookings(bookingsResponse.data);
      setUsers(usersResponse.data);
      setTimeSlots(timeSlotsResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleExpand = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };
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
    { text: "View Bookings", icon: <FontAwesomeIcon icon={faBook} />, section: "bookings" }, // Nút mới
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
      if (section === "bookings") fetchBookings(); // Fetch khi nhấn "View Bookings"
    }
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 1 }}>
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            mb: 2,
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.2rem",
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
        <Divider sx={{ backgroundColor: darkMode ? "#5a758c" : "#ccc", my: 1 }} />
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
                    fontSize: "0.9rem",
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
          <Box darkMode={darkMode}>
            <ServiceDetailDashboard darkMode={darkMode} />
          </Box>
        )}
        {activeSection === "qa-customer" && <QaStaff darkMode={darkMode} />}
        {activeSection === "schedules" && <ScheduleManagement darkMode={darkMode} />}
        {activeSection === "bookings" && (
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
              All Bookings
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: darkMode ? "#1abc9c" : "#6c4f37" }} />
              </Box>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => {
                const user = users.find((u) => u.userId === booking.userId) || {};
                const timeSlot = timeSlots.find((ts) => ts.timeSlotId === booking.timeSlotId) || {};
                const isExpanded = expandedBookingId === booking.bookingId;
                return (
                  <BookingCard
                    key={booking.bookingId}
                    darkMode={darkMode}
                    onClick={() => handleToggleExpand(booking.bookingId)}
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{ cursor: "pointer" }}
                  >
                    <Typography>Booking ID: {booking.bookingId}</Typography>
                    <Typography>Appointment Date: {new Date(booking.appointmentDate).toLocaleDateString()}</Typography>
                    {isExpanded && (
                      <>
                        <Typography>User: {user.userName || "Unknown"} (ID: {booking.userId})</Typography>
                        <Typography>Therapist ID: {booking.therapistId}</Typography>
                        <Typography>Time Slot: {timeSlot.description || "N/A"} (ID: {booking.timeSlotId})</Typography>
                        <Typography>Date Created: {new Date(booking.dateCreated).toLocaleString()}</Typography>
                        <Typography>Total Price: {booking.totalPrice} VND</Typography>
                        <Typography>Note: {booking.note || "N/A"}</Typography>
                        <Typography>Status: {booking.status ? "Active" : "Inactive"}</Typography>
                        <Typography>Is Paid: {booking.isPaid ? "Yes" : "No"}</Typography>
                        <Typography>Use Wallet: {booking.useWallet ? "Yes" : "No"}</Typography>
                      </>
                    )}
                  </BookingCard>
                );
              })
            ) : (
              <Typography>No bookings available.</Typography>
            )}
          </Box>
        )}
      </MainContent>
    </Box>
  );
};

StaffHomePage.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default StaffHomePage;