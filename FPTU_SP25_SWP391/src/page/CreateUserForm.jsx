import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { createTherapist, createStaff, getAllUsers } from "../api/testApi";

const DashboardCard = styled("div")(({ darkMode }) => ({
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

export default function CreateUserForm({ darkMode, onUserCreated }) {
  // State Management
  const [userForm, setUserForm] = useState({ userName: "", email: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // Data Fetching
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await getAllUsers(token);
      setAllUsers(response.data || []);
      setSearchResult([]); // Reset search results on fetch
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (role) => {
    try {
      console.log("Attempting to create user with role:", role);
      console.log("Current Form Data:", userForm);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");

      const createFn = role === "Therapist" ? createTherapist : createStaff;
      const response = await createFn(userForm, token);

      console.log("API Response:", response);

      const newUser = { ...userForm, role, password: "****" };
      console.log("Newly Created User (Masked Password):", newUser);

      onUserCreated(newUser);
      setUserForm({ userName: "", email: "", password: "" });
      setSearchTerm("");
      setSearchResult([]);
      await fetchAllUsers();

      alert(`${role} created successfully!`);
    } catch (error) {
      console.error(`Error creating ${role}:`, error);
      alert(`Failed to create ${role}: ${error.response?.data?.message || error.message}`);
    }
  };

  // Search Handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterUsers(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResult([]);
  };

  const filterUsers = (value) => {
    if (value.trim() === "") {
      setSearchResult([]);
    } else {
      const filtered = allUsers.filter((user) =>
        user.userName.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResult(filtered);
    }
  };

  return (
    <DashboardCard
      darkMode={darkMode}
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* User Creation Section */}
      <Typography
        variant="h6"
        sx={{ mb: 3, color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}
      >
        Create New User
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Staff
          </Button>
        </Grid>
      </Grid>

      {/* User Search Section */}
      <Typography
        variant="h6"
        sx={{ mb: 2, color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}
      >
        Search Users
      </Typography>
      {loading && (
        <Typography
          variant="body2"
          sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 2 }}
        >
          Loading...
        </Typography>
      )}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={10}>
          <TextField
            label="Search by Username"
            value={searchTerm}
            onChange={handleSearchChange}
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
        <Grid item xs={12} sm={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearSearch}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: "8px",
              color: darkMode ? "#d81b60" : "#6e6e73",
              borderColor: darkMode ? "#d81b60" : "#6e6e73",
              "&:hover": { borderColor: darkMode ? "#c2185b" : "#555" },
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}>
                Username
              </TableCell>
              <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}>
                Email
              </TableCell>
              <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 600 }}>
                Role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResult.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", textAlign: "center" }}
                >
                  {searchTerm ? "No matching users found." : "Enter a username to search."}
                </TableCell>
              </TableRow>
            ) : (
              searchResult.map((user) => (
                <TableRow key={user.userName}>
                  <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                    {user.userName}
                  </TableCell>
                  <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                    {user.role || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
}