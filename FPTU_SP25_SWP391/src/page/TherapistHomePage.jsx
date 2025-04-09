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
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faUser,
  faEdit,
  faMoon,
  faSignOutAlt,
  faBook,
  faCheckCircle,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { confirmBookingCompleted, postCheckout } from "../api/testApi";

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
  padding: "20px",
  marginBottom: "20px",
  background: darkMode ? "rgba(69, 90, 100, 0.95)" : "rgba(255, 255, 255, 0.95)",
  borderRadius: "12px",
  boxShadow: darkMode ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
  color: darkMode ? "#ecf0f1" : "#2c3e50", // Fixed typo from "#2c3 G50"
  "& *": { color: "inherit" },
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  border: darkMode ? "1px solid #5a758c" : "1px solid #e0e0e0",
}));

// Status Badge Styling
const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  fontSize: "0.85rem",
  ...(status === 0 && { backgroundColor: "#f39c12", color: "#fff" }), // Pending: Yellow
  ...(status === 1 && { backgroundColor: "#3498db", color: "#fff" }), // Booked: Blue
  ...(status === 2 && { backgroundColor: "#2ecc71", color: "#fff" }), // Completed: Green
  ...(status === 3 && { backgroundColor: "#e74c3c", color: "#fff" }), // Canceled: Red
  ...(status === 4 && { backgroundColor: "#95a5a6", color: "#fff" }), // Failed: Gray
}));

const TherapistHomePage = ({ darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const { logout, userId, token, username } = useAuth();

  const axiosInstance = axios.create({
    baseURL: "https://kinaa1410-001-site1.qtempurl.com/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  });

  const fetchBookings = async () => {
    if (!userId) {
      alert("Therapist ID not found. Please log in.");
      navigate("/sign_in");
      return;
    }
    setLoading(true);
    try {
      const [bookingsResponse, usersResponse, timeSlotsResponse] = await Promise.all([
        axiosInstance.get(`/bookings/therapist/${userId}/bookings`),
        axiosInstance.get("/UserDetails"),
        axiosInstance.get("/timeslot"),
      ]);
      console.log("Bookings fetched:", bookingsResponse.data); // Debug
      setBookings(bookingsResponse.data);
      setUsers(usersResponse.data);
      setTimeSlots(timeSlotsResponse.data);
    } catch (err) {
      console.error("Error fetching therapist data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCompleted = async (bookingId) => {
    if (!window.confirm("Are you sure you want to mark this booking as completed?")) return;
    setLoading(true);
    try {
      await confirmBookingCompleted(bookingId, userId, token);
      alert("Booking marked as completed successfully!");
      await fetchBookings();
    } catch (error) {
      alert("Failed to confirm booking completion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (bookingId) => {
    if (loading) return; // Prevent action if already loading
    setLoading(true);
    try {
      const response = await postCheckout(bookingId, token);
      const checkoutUrl = response.data.checkoutUrl; // Adjust based on your API response structure
      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Redirect to payment gateway
      } else {
        alert("Checkout URL not provided by the server.");
      }
    } catch (error) {
      alert("Failed to initiate checkout. Please try again.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

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
    { text: "Choose Schedule", icon: <FontAwesomeIcon icon={faCalendar} />, section: "schedule" },
    { text: "View Bookings", icon: <FontAwesomeIcon icon={faBook} />, section: "bookings" },
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
      console.log("Active section set to:", section); // Debug
      if (section === "schedule") {
        if (!userId || !token) {
          alert("Please log in to choose a schedule.");
          navigate("/sign_in");
          return;
        }
        navigate("/therapist/choose-schedule", { state: { therapistId: userId, token } });
      }
      if (section === "view-profile") navigate("/profile-role");
      if (section === "edit-profile") navigate("/edit-profilerole");
      if (section === "bookings") fetchBookings();
    }
  };

  const handleToggleExpand = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return "Pending";
      case 1: return "Booked";
      case 2: return "Completed";
      case 3: return "Canceled";
      case 4: return "Failed";
      default: return "Unknown";
    }
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 1 }}>
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            mb: 1,
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
          <FontAwesomeIcon icon={faUser} /> Therapist Control Panel
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: darkMode ? "#bdc3c7" : "#7f8c8d",
            mb: 2,
            textAlign: "center",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "0.9rem",
          }}
        >
          Welcome, {username || "Therapist"}
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
          <FontAwesomeIcon icon={faCalendar} /> Therapist Dashboard
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
              Welcome, {username || "Therapist"}!
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

        {activeSection === "bookings" && (
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
              }}
            >
              My Bookings
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
                    component={motion.div}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Booking #{booking.bookingId}
                      </Typography>
                      <StatusChip label={getStatusLabel(booking.status)} status={booking.status} />
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <Typography>
                        <strong>Date:</strong> {new Date(booking.appointmentDate).toLocaleDateString()}
                      </Typography>
                      <Typography>
                        <strong>Time:</strong> {timeSlot.description || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Client:</strong>{" "}
                        {user.firstName && user.lastName ? `${user.lastName} ${user.firstName}` : "Unknown"}
                      </Typography>
                      <Typography>
                        <strong>Note:</strong> {booking.note || "N/A"}
                      </Typography>
                    </Box>
                    {isExpanded && (
                      <Box sx={{ mt: 2 }}>
                        <Typography>
                          <strong>Created:</strong> {new Date(booking.dateCreated).toLocaleString()}
                        </Typography>
                        <Typography>
                          <strong>Therapist ID:</strong> {booking.therapistId}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "flex-end", mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleToggleExpand(booking.bookingId)}
                        sx={{
                          textTransform: "none",
                          borderColor: darkMode ? "#ecf0f1" : "#2c3e50",
                          color: darkMode ? "#ecf0f1" : "#2c3e50",
                        }}
                      >
                        {isExpanded ? "Collapse" : "Details"}
                      </Button>
                      {/* Checkout Button - Always shown, clickable only when status === 0 */}
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FontAwesomeIcon icon={faCreditCard} />}
                        onClick={() => handleCheckout(booking.bookingId)}
                        disabled={booking.status !== 0} // Only clickable when status === 0
                        sx={{
                          textTransform: "none",
                          backgroundColor: booking.status === 0 ? (darkMode ? "#3498db" : "#2980b9") : darkMode ? "#4a6572" : "#b0bec5",
                          "&:hover": {
                            backgroundColor: booking.status === 0 ? (darkMode ? "#2980b9" : "#2471a3") : darkMode ? "#4a6572" : "#b0bec5",
                          },
                          opacity: booking.status === 0 ? 1 : 0.6,
                          filter: booking.status === 0 ? "none" : "blur(1px)",
                          transition: "opacity 0.3s ease, filter 0.3s ease",
                        }}
                      >
                        Checkout
                      </Button>
                      {booking.status === 1 && (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                          onClick={() => handleConfirmCompleted(booking.bookingId)}
                          disabled={loading}
                          sx={{
                            textTransform: "none",
                            backgroundColor: darkMode ? "#2ecc71" : "#27ae60",
                            "&:hover": { backgroundColor: darkMode ? "#27ae60" : "#219653" },
                          }}
                        >
                          Confirm Completed
                        </Button>
                      )}
                    </Box>
                  </BookingCard>
                );
              })
            ) : (
              <Typography sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d" }}>
                No bookings available. (Debug: Check fetchBookings response)
              </Typography>
            )}
          </Box>
        )}
      </MainContent>
    </Box>
  );
};

export default TherapistHomePage;