import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { getAllUsers, deleteUser, getServiceCategories } from "../api/testApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faBuilding,
  faUser,
  faEdit,
  faMoon,
  faSignOutAlt,
  faTrashAlt,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import CreateUserForm from "./CreateUserForm";
import ServicesDashboard from "./ServicesDashboard";
import TimeSlotSchedule from "./TimeSlotSchedule";
import ScheduleManagement from "./ScheduleManagement";

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

// Dashboard Card Styling
const DashboardCard = styled("div")(({ darkMode }) => ({
  padding: "30px",
  borderRadius: "16px",
  background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
  boxShadow: darkMode
    ? "0 8px 24px rgba(0, 0, 0, 0.4)"
    : "0 8px 24px rgba(0, 0, 0, 0.15)",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: darkMode
      ? "0 12px 32px rgba(0, 0, 0, 0.6)"
      : "0 12px 32px rgba(0, 0, 0, 0.2)",
  },
}));

// Sidebar Styling
const Sidebar = styled(Drawer)(({ darkMode }) => ({
  width: 260,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 260,
    height: "100vh",
    background: darkMode
      ? "linear-gradient(180deg, #1c2526 0%, #34495e 100%)"
      : "linear-gradient(180deg, #f8f4e1 0%, #e5e5e5 100%)",
    borderRight: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
    paddingTop: "10px", // Reduced padding
    boxShadow: darkMode
      ? "2px 0 10px rgba(0, 0, 0, 0.4)"
      : "2px 0 10px rgba(0, 0, 0, 0.15)",
    overflowY: "hidden", // No scrolling
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
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

// Styled Logout Item
const LogoutListItem = styled(ListItem)(({ darkMode }) => ({
  borderRadius: "8px",
  margin: "4px 12px", // Reduced margin
  padding: "8px 16px", // Reduced padding
  background: darkMode ? "#e74c3c" : "#f2dede",
  color: darkMode ? "#ecf0f1" : "#721c24",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: darkMode ? "#c0392b" : "#ebccd1",
    transform: "translateX(5px)",
  },
}));

export default function AdminHomePage({ darkMode, toggleDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [idSort, setIdSort] = useState("");
  const [nameSort, setNameSort] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      await deleteUser(userId, token);
      setUsers((prev) => prev.filter((user) => user.userId !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.userId !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setFilteredUsers((prev) => [...prev, newUser]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const usersResponse = await getAllUsers(token);
        setUsers(usersResponse.data || []);
        setFilteredUsers(usersResponse.data || []);

        const servicesResponse = await getServiceCategories(token);
        setServices(servicesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let updatedUsers = [...users];
    if (!roleFilter || roleFilter !== "Admin") {
      updatedUsers = updatedUsers.filter((user) => user.role !== "Admin");
    }
    if (roleFilter) updatedUsers = updatedUsers.filter((user) => user.role === roleFilter);
    if (idSort === "asc") updatedUsers.sort((a, b) => (a.userId || 0) - (b.userId || 0));
    else if (idSort === "desc") updatedUsers.sort((a, b) => (b.userId || 0) - (a.userId || 0));
    if (nameSort === "asc") updatedUsers.sort((a, b) => a.userName.localeCompare(b.userName));
    else if (nameSort === "desc") updatedUsers.sort((a, b) => b.userName.localeCompare(a.userName));
    setFilteredUsers(updatedUsers);
    setFilterTrigger((prev) => prev + 1);
    setCurrentPage(1);
  }, [users, idSort, nameSort, roleFilter]);

  const handleLogout = () => {
    logout();
    setUsers([]);
    setServices([]);
    setFilteredUsers([]);
    setTabValue(0);
    setIdSort("");
    setNameSort("");
    setRoleFilter("");
    setFilterTrigger(0);
    setCurrentPage(1);
    navigate("/sign_in", { replace: true });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalUsers = users.length;
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status).length;
  const inactiveServices = totalServices - activeServices;
  const roleBreakdown = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const menuItems = [
    { text: "Dashboard", icon: <FontAwesomeIcon icon={faTachometerAlt} />, action: () => setTabValue(0) },
    { text: "Users", icon: <FontAwesomeIcon icon={faUsers} />, action: () => setTabValue(1) },
    { text: "Services", icon: <FontAwesomeIcon icon={faBuilding} />, action: () => setTabValue(2) },
    { text: "Time Slots", icon: <FontAwesomeIcon icon={faBuilding} />, action: () => setTabValue(3) },
    { text: "Schedules", icon: <FontAwesomeIcon icon={faCalendar} />, action: () => setTabValue(4) },
    { text: "User Profile", icon: <FontAwesomeIcon icon={faUser} />, action: () => navigate("/profile-role") },
    { text: "Edit Profile", icon: <FontAwesomeIcon icon={faEdit} />, action: () => navigate("/edit-profilerole") },
    { text: "Toggle Dark Mode", icon: <FontAwesomeIcon icon={faMoon} />, action: toggleDarkMode },
  ];

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
            fontSize: "1.2rem", // Slightly smaller font
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <FontAwesomeIcon icon={faUser} /> Admin Panel
        </Typography>
        <List sx={{ padding: 0 }}>
          {menuItems.map((item, index) => (
            <StyledListItem
              button
              key={item.text}
              onClick={item.action}
              darkMode={darkMode}
              isActive={tabValue === index && index < 5}
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
                    fontSize: "0.9rem", // Smaller font size
                  },
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ my: 1, backgroundColor: darkMode ? "#5a758c" : "#ccc" }} /> {/* Reduced margin */}
        <LogoutListItem
          button
          onClick={handleLogout}
          darkMode={darkMode}
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ListItemIcon sx={{ color: darkMode ? "#ecf0f1" : "#721c24", mr: 1, minWidth: "30px" }}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              "& .MuiTypography-root": {
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 600,
                color: darkMode ? "#ecf0f1" : "#721c24",
                fontSize: "0.9rem", // Smaller font size
              },
            }}
          />
        </LogoutListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar variant="permanent" darkMode={darkMode} sx={{ display: { xs: "none", sm: "block" } }}>
        {drawerContent}
      </Sidebar>
      <Sidebar
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        darkMode={darkMode}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {drawerContent}
      </Sidebar>
      <MainContent
        darkMode={darkMode}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: darkMode ? "#ecf0f1" : "#2c3e50" }}
          >
            <FontAwesomeIcon icon={faTachometerAlt} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: darkMode ? "#ecf0f1" : "#2c3e50",
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
            <FontAwesomeIcon icon={faTachometerAlt} /> Admin Dashboard
          </Typography>
        </Box>

        {/* Dashboard Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                color: darkMode ? "#bdc3c7" : "#7f8c8d",
                mb: 4,
                fontStyle: "italic",
                fontFamily: "'Roboto', sans-serif",
              }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Overview of users and services.
            </Typography>
            <CreateUserForm darkMode={darkMode} onUserCreated={handleUserCreated} />
            <DashboardCard
              darkMode={darkMode}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Users Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 1, fontFamily: "'Roboto', sans-serif" }}
                    >
                      Total Users
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {totalUsers}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#4caf50", fontFamily: "'Roboto', sans-serif" }}
                    >
                      +{Math.round(totalUsers * 0.05)} this month
                    </Typography>
                  </DashboardCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 1, fontFamily: "'Roboto', sans-serif" }}
                    >
                      Customers
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {roleBreakdown["Customer"] || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#4caf50", fontFamily: "'Roboto', sans-serif" }}
                    >
                      +{Math.round((roleBreakdown["Customer"] || 0) * 0.03)} this month
                    </Typography>
                  </DashboardCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 1, fontFamily: "'Roboto', sans-serif" }}
                    >
                      Therapists
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {roleBreakdown["Therapist"] || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#4caf50", fontFamily: "'Roboto', sans-serif" }}
                    >
                      +{Math.round((roleBreakdown["Therapist"] || 0) * 0.02)} this month
                    </Typography>
                  </DashboardCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 1, fontFamily: "'Roboto', sans-serif" }}
                    >
                      Staff
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {roleBreakdown["Staff"] || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#4caf50", fontFamily: "'Roboto', sans-serif" }}
                    >
                      +{Math.round((roleBreakdown["Staff"] || 0) * 0.01)} this month
                    </Typography>
                  </DashboardCard>
                </Grid>
              </Grid>
            </DashboardCard>
            <DashboardCard
              darkMode={darkMode}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{ mt: 4 }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Services Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 1, fontFamily: "'Roboto', sans-serif" }}
                    >
                      Total Services
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {totalServices}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#4caf50", fontFamily: "'Roboto', sans-serif" }}
                    >
                      +{Math.round(totalServices * 0.067)} this month
                    </Typography>
                  </DashboardCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 1, fontFamily: "'Roboto', sans-serif" }}
                    >
                      Active Services
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {activeServices}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#4caf50", fontFamily: "'Roboto', sans-serif" }}
                    >
                      +{Math.round(activeServices * 0.032)} this month
                    </Typography>
                  </DashboardCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 1, fontFamily: "'Roboto', sans-serif" }}
                    >
                      Inactive Services
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {inactiveServices}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#f44336", fontFamily: "'Roboto', sans-serif" }}
                    >
                      -{Math.round(inactiveServices * 0.025)} this month
                    </Typography>
                  </DashboardCard>
                </Grid>
              </Grid>
            </DashboardCard>
          </Box>
        )}

        {/* Users Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                color: darkMode ? "#bdc3c7" : "#7f8c8d",
                mb: 4,
                fontStyle: "italic",
                fontFamily: "'Roboto', sans-serif",
              }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Manage staff and therapist accounts here.
            </Typography>
            <CreateUserForm darkMode={darkMode} onUserCreated={handleUserCreated} />
            <DashboardCard
              darkMode={darkMode}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                All Users (Total: {filteredUsers.length})
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Roboto', sans-serif" }}>
                      Sort by User
                    </InputLabel>
                    <Select
                      value={idSort}
                      onChange={(e) => setIdSort(e.target.value)}
                      sx={{
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                        backgroundColor: darkMode ? "#2c3e50" : "#fff",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="asc">1 to 10</MenuItem>
                      <MenuItem value="desc">10 to 1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Roboto', sans-serif" }}>
                      Sort by Name
                    </InputLabel>
                    <Select
                      value={nameSort}
                      onChange={(e) => setNameSort(e.target.value)}
                      sx={{
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                        backgroundColor: darkMode ? "#2c3e50" : "#fff",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="asc">A-Z</MenuItem>
                      <MenuItem value="desc">Z-A</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Roboto', sans-serif" }}>
                      Filter by Role
                    </InputLabel>
                    <Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      sx={{
                        color: darkMode ? "#ecf0f1" : "#2c3e50",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                        backgroundColor: darkMode ? "#2c3e50" : "#fff",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Customer">Customer</MenuItem>
                      <MenuItem value="Therapist">Therapist</MenuItem>
                      <MenuItem value="Staff">Staff</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <TableContainer
                component={motion.div}
                key={filterTrigger}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: darkMode ? "#bdc3c7" : "#7f8c8d",
                          fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif",
                          backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          color: darkMode ? "#bdc3c7" : "#7f8c8d",
                          fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif",
                          backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                        }}
                      >
                        Username
                      </TableCell>
                      <TableCell
                        sx={{
                          color: darkMode ? "#bdc3c7" : "#7f8c8d",
                          fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif",
                          backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          color: darkMode ? "#bdc3c7" : "#7f8c8d",
                          fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif",
                          backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                        }}
                      >
                        Role
                      </TableCell>
                      <TableCell
                        sx={{
                          color: darkMode ? "#bdc3c7" : "#7f8c8d",
                          fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif",
                          backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentUsers.map((user, index) => (
                      <TableRow
                        key={user.userId || user.userName}
                        sx={{
                          "&:hover": { background: darkMode ? "#455a64" : "#f8f4e1" },
                        }}
                      >
                        <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                          {indexOfFirstUser + index + 1}
                        </TableCell>
                        <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                          {user.userName}
                        </TableCell>
                        <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                          {user.email}
                        </TableCell>
                        <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                          {user.role}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => user.userId && handleDeleteUser(user.userId)}
                            disabled={!user.userId}
                            sx={{ color: darkMode ? "#f44336" : "#721c24" }}
                            component={motion.div}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root": { color: darkMode ? "#ecf0f1" : "#2c3e50" },
                    "& .Mui-selected": { backgroundColor: darkMode ? "#1abc9c" : "#6c4f37", color: "#fff" },
                  }}
                />
              </Box>
            </DashboardCard>
          </Box>
        )}

        {/* Services Tab */}
        {tabValue === 2 && <ServicesDashboard darkMode={darkMode} />}

        {/* Time Slots Tab */}
        {tabValue === 3 && <TimeSlotSchedule darkMode={darkMode} onReturn={() => setTabValue(0)} />}

        {/* Schedules Tab */}
        {tabValue === 4 && <ScheduleManagement darkMode={darkMode} />}
      </MainContent>
    </Box>
  );
}