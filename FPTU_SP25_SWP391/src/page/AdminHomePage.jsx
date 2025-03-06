import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Brightness4 as DarkModeIcon,
  ExitToApp as LogoutIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { createTherapist, createStaff, getAllUsers, deleteUser } from "../api/testApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Styled Components (unchanged)
const MainContent = styled(Box)(({ theme, darkMode }) => ({
  flexGrow: 1,
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
    : "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
  transition: "all 0.3s ease",
}));

const DashboardCard = styled(Paper)(({ theme, darkMode }) => ({
  padding: "30px",
  borderRadius: "16px",
  background: darkMode ? "#252525" : "#ffffff",
  boxShadow: darkMode
    ? "0 8px 24px rgba(0, 0, 0, 0.6)"
    : "0 8px 24px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: darkMode
      ? "0 12px 32px rgba(0, 0, 0, 0.8)"
      : "0 12px 32px rgba(0, 0, 0, 0.15)",
  },
}));

const Sidebar = styled(Drawer)(({ theme, darkMode }) => ({
  width: 260,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 260,
    background: darkMode
      ? "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)",
    borderRight: darkMode ? "1px solid #3d3d3d" : "1px solid #e0e0e0",
    paddingTop: "20px",
    boxShadow: darkMode
      ? "2px 0 10px rgba(0, 0, 0, 0.5)"
      : "2px 0 10px rgba(0, 0, 0, 0.05)",
  },
}));

const StyledListItem = styled(ListItem)(({ darkMode, isActive }) => ({
  borderRadius: "12px",
  margin: "8px 16px",
  padding: "12px 20px",
  background: isActive ? (darkMode ? "#3d3d3d" : "#e0e0e0") : "transparent",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: darkMode ? "#3d3d3d" : "#f0f0f0",
    transform: "translateX(5px)",
  },
}));

export default function AdminHomePage({ darkMode, toggleDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userForm, setUserForm] = useState({ userName: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (role) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");

      const createFn = role === "Therapist" ? createTherapist : createStaff;
      const response = await createFn(userForm, token);

      const newUser = { ...userForm, role, password: "****" };
      setUsers((prev) => [...prev, newUser]);
      setUserForm({ userName: "", email: "", password: "" });

      console.log("Account created successfully:", {
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        responseData: response.data,
      });

      alert(`${role} created successfully!`);
    } catch (error) {
      console.error(`Error creating ${role}:`, error);
      alert(`Failed to create ${role}: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");

      await deleteUser(userId, token);

      setUsers((prev) => prev.filter((user) => user.userId !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.userId !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found. Please log in again.");
        const response = await getAllUsers(token);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let updatedUsers = [...users];
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
    setFilteredUsers([]);
    setUserForm({ userName: "", email: "", password: "" });
    setTabValue(0);
    setIdSort("");
    setNameSort("");
    setRoleFilter("");
    setFilterTrigger(0);
    setCurrentPage(1);
    navigate("/sign_in", { replace: true });
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, action: () => setTabValue(0) },
    { text: "Users", icon: <PeopleIcon />, action: () => setTabValue(1) },
    { text: "Services", icon: <BusinessIcon />, action: () => setTabValue(2) },
    { text: "User Profile", icon: <PersonIcon />, action: () => navigate("/profile") },
    { text: "Edit Profile", icon: <EditIcon />, action: () => navigate("/edit-profile") },
    { text: "Toggle Dark Mode", icon: <DarkModeIcon />, action: toggleDarkMode },
    { text: "Logout", icon: <LogoutIcon />, action: handleLogout },
  ];

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          color: darkMode ? "#ffffff" : "#1d1d1f",
          mb: 3,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "1px",
        }}
      >
        Admin Panel
      </Typography>
      <List>
        {menuItems.map((item, index) => (
          <StyledListItem
            button
            key={item.text}
            onClick={item.action}
            darkMode={darkMode}
            isActive={tabValue === index && index < 3}
          >
            <ListItemIcon sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mr: 1 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 500 }}
            />
          </StyledListItem>
        ))}
      </List>
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
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: darkMode ? "#ffffff" : "#1d1d1f" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: darkMode ? "#ffffff" : "#1d1d1f",
              letterSpacing: "1px",
            }}
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        {/* Dashboard Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 4, fontStyle: "italic" }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Overview of users and services.
            </Typography>

            <DashboardCard
              darkMode={darkMode}
              sx={{ mb: 4 }}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}
              >
                Create New User
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Username"
                    name="userName"
                    value={userForm.userName}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: darkMode ? "#a1a1a6" : "#e0e0e0" },
                        "&:hover fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                        "&.Mui-focused fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                      },
                      "& .MuiInputLabel-root": { color: darkMode ? "#a1a1a6" : "#6e6e73" },
                      "& .MuiInputBase-input": { color: darkMode ? "#ffffff" : "#1d1d1f" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Email"
                    name="email"
                    value={userForm.email}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: darkMode ? "#a1a1a6" : "#e0e0e0" },
                        "&:hover fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                        "&.Mui-focused fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                      },
                      "& .MuiInputLabel-root": { color: darkMode ? "#a1a1a6" : "#6e6e73" },
                      "& .MuiInputBase-input": { color: darkMode ? "#ffffff" : "#1d1d1f" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={userForm.password}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: darkMode ? "#a1a1a6" : "#e0e0e0" },
                        "&:hover fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                        "&.Mui-focused fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                      },
                      "& .MuiInputLabel-root": { color: darkMode ? "#a1a1a6" : "#6e6e73" },
                      "& .MuiInputBase-input": { color: darkMode ? "#ffffff" : "#1d1d1f" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCreateUser("Therapist")}
                    sx={{
                      mr: 2,
                      py: 1.5,
                      px: 4,
                      borderRadius: "8px",
                      background: darkMode ? "#1976d2" : "#1d1d1f",
                      "&:hover": { background: darkMode ? "#1565c0" : "#333" },
                      transition: "background 0.3s ease",
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Therapist
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCreateUser("Staff")}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: "8px",
                      background: darkMode ? "#d81b60" : "#6e6e73",
                      "&:hover": { background: darkMode ? "#c2185b" : "#555" },
                      transition: "background 0.3s ease",
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Staff
                  </Button>
                </Grid>
              </Grid>
            </DashboardCard>

            <DashboardCard
              darkMode={darkMode}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}
              >
                Services Overview
              </Typography>
              <Grid container spacing={3}>
                {[
                  { title: "Total Services", value: "342", change: "+6.7%" },
                  { title: "Active Bookings", value: "1,234", change: "+3.2%" },
                  { title: "Service Revenue", value: "$12,345", change: "+9.1%" },
                  { title: "Pending Approvals", value: "15", change: "-2.5%" },
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <DashboardCard
                      darkMode={darkMode}
                      component={motion.div}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 1, fontWeight: 500 }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: darkMode ? "#ffffff" : "#1d1d1f", mb: 1 }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.change.startsWith("+") ? "#4caf50" : "#f44336",
                          fontWeight: 500,
                        }}
                      >
                        {stat.change} from last month
                      </Typography>
                    </DashboardCard>
                  </Grid>
                ))}
              </Grid>
            </DashboardCard>
          </Box>
        )}

        {/* Users Tab with Delete Button */}
        {tabValue === 1 && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 4, fontStyle: "italic" }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Manage staff and therapist accounts here.
            </Typography>

            <DashboardCard
              darkMode={darkMode}
              sx={{ mb: 4 }}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}
              >
                Create New User
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Username"
                    name="userName"
                    value={userForm.userName}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: darkMode ? "#a1a1a6" : "#e0e0e0" },
                        "&:hover fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                        "&.Mui-focused fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                      },
                      "& .MuiInputLabel-root": { color: darkMode ? "#a1a1a6" : "#6e6e73" },
                      "& .MuiInputBase-input": { color: darkMode ? "#ffffff" : "#1d1d1f" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Email"
                    name="email"
                    value={userForm.email}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: darkMode ? "#a1a1a6" : "#e0e0e0" },
                        "&:hover fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                        "&.Mui-focused fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                      },
                      "& .MuiInputLabel-root": { color: darkMode ? "#a1a1a6" : "#6e6e73" },
                      "& .MuiInputBase-input": { color: darkMode ? "#ffffff" : "#1d1d1f" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={userForm.password}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: darkMode ? "#a1a1a6" : "#e0e0e0" },
                        "&:hover fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                        "&.Mui-focused fieldset": { borderColor: darkMode ? "#ffffff" : "#1d1d1f" },
                      },
                      "& .MuiInputLabel-root": { color: darkMode ? "#a1a1a6" : "#6e6e73" },
                      "& .MuiInputBase-input": { color: darkMode ? "#ffffff" : "#1d1d1f" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCreateUser("Therapist")}
                    sx={{
                      mr: 2,
                      py: 1.5,
                      px: 4,
                      borderRadius: "8px",
                      background: darkMode ? "#1976d2" : "#1d1d1f",
                      "&:hover": { background: darkMode ? "#1565c0" : "#333" },
                      transition: "background 0.3s ease",
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Therapist
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCreateUser("Staff")}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: "8px",
                      background: darkMode ? "#d81b60" : "#6e6e73",
                      "&:hover": { background: darkMode ? "#c2185b" : "#555" },
                      transition: "background 0.3s ease",
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Staff
                  </Button>
                </Grid>
              </Grid>
            </DashboardCard>

            <DashboardCard
              darkMode={darkMode}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}
              >
                All Users
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
                      Sort by User
                    </InputLabel>
                    <Select
                      value={idSort}
                      onChange={(e) => setIdSort(e.target.value)}
                      sx={{
                        color: darkMode ? "#ffffff" : "#1d1d1f",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#a1a1a6" : "#e0e0e0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#ffffff" : "#1d1d1f",
                        },
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
                    <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
                      Sort by Name
                    </InputLabel>
                    <Select
                      value={nameSort}
                      onChange={(e) => setNameSort(e.target.value)}
                      sx={{
                        color: darkMode ? "#ffffff" : "#1d1d1f",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#a1a1a6" : "#e0e0e0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#ffffff" : "#1d1d1f",
                        },
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
                    <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
                      Filter by Role
                    </InputLabel>
                    <Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      sx={{
                        color: darkMode ? "#ffffff" : "#1d1d1f",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#a1a1a6" : "#e0e0e0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#ffffff" : "#1d1d1f",
                        },
                      }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Customer">Customer</MenuItem>
                      <MenuItem value="Therapist">Therapist</MenuItem>
                      <MenuItem value="Staff">Staff</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
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
                      <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                        User ID
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                        Username
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                        Role
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow
                        key={user.userId || user.userName}
                        sx={{
                          "&:hover": {
                            background: darkMode ? "#2d2d2d" : "#f5f5f5",
                            transition: "background 0.3s ease",
                          },
                        }}
                      >
                        <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                          {user.userId || "N/A"}
                        </TableCell>
                        <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                          {user.userName}
                        </TableCell>
                        <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                          {user.email}
                        </TableCell>
                        <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                          {user.role}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => user.userId && handleDeleteUser(user.userId)}
                            disabled={!user.userId}
                            sx={{ color: darkMode ? "#f44336" : "#d32f2f" }}
                          >
                            <DeleteIcon />
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
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: darkMode ? "#ffffff" : "#1d1d1f",
                    },
                  }}
                />
              </Box>
            </DashboardCard>
          </Box>
        )}

        {/* Services Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 4, fontStyle: "italic" }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Overview of services on the platform.
            </Typography>
            <Grid container spacing={3}>
              {[
                { title: "Total Services", value: "342", change: "+6.7%" },
                { title: "Active Bookings", value: "1,234", change: "+3.2%" },
                { title: "Service Revenue", value: "$12,345", change: "+9.1%" },
                { title: "Pending Approvals", value: "15", change: "-2.5%" },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <DashboardCard
                    darkMode={darkMode}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 1, fontWeight: 500 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: darkMode ? "#ffffff" : "#1d1d1f", mb: 1 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.change.startsWith("+") ? "#4caf50" : "#f44336",
                        fontWeight: 500,
                      }}
                    >
                      {stat.change} from last month
                    </Typography>
                  </DashboardCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </MainContent>
    </Box>
  );
}