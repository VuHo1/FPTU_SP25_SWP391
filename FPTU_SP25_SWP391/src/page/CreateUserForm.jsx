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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { createTherapist, createStaff, getAllUsers } from "../api/testApi";

// Dashboard Card Styling (Matching AdminHomePage)
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

export default function CreateUserForm({ darkMode, onUserCreated }) {
  // State Management
  const [userForm, setUserForm] = useState({ userName: "", email: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({ userName: "", email: "" });

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
      setErrorMessage(`Failed to fetch users: ${error.message}`);
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Validation Functions
  const validateUserName = (userName) => {
    return userName.trim().length > 1 ? "" : "Username must be more than 1 character.";
  };

  const validateEmail = (email) => {
    return email.includes("@") ? "" : "Email must contain an '@' symbol.";
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));

    // Validate on change and update errors
    if (name === "userName") {
      setFormErrors((prev) => ({ ...prev, userName: validateUserName(value) }));
    } else if (name === "email") {
      setFormErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleCreateUser = async (role) => {
    // Validate form before submission
    const userNameError = validateUserName(userForm.userName);
    const emailError = validateEmail(userForm.email);

    setFormErrors({ userName: userNameError, email: emailError });

    if (userNameError || emailError || !userForm.password) {
      setErrorMessage(
        "Please correct the following errors:\n" +
          (userNameError ? `- ${userNameError}\n` : "") +
          (emailError ? `- ${emailError}\n` : "") +
          (!userForm.password ? "- Password is required." : "")
      );
      setErrorDialogOpen(true);
      return;
    }

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
      setFormErrors({ userName: "", email: "" }); // Reset errors
      setSearchTerm("");
      setSearchResult([]);
      await fetchAllUsers();

      alert(`${role} created successfully!`);
    } catch (error) {
      console.error(`Error creating ${role}:`, error);
      setErrorMessage(`Failed to create ${role}: ${error.response?.data?.message || error.message}`);
      setErrorDialogOpen(true);
    }
  };

  // Handle closing the error dialog
  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
    setErrorMessage("");
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
        sx={{
          mb: 3,
          color: darkMode ? "#ecf0f1" : "#2c3e50",
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
        }}
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
            error={!!formErrors.userName}
            helperText={formErrors.userName}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                "&:hover fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                "&.Mui-focused fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                backgroundColor: darkMode ? "#2c3e50" : "#fff",
                color: darkMode ? "#ecf0f1" : "#2c3e50",
              },
              "& .MuiInputLabel-root": {
                color: darkMode ? "#bdc3c7" : "#7f8c8d",
                "&.Mui-focused": { color: darkMode ? "#1abc9c" : "#6c4f37" },
              },
              "& .MuiInputBase-input": {
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                fontFamily: "'Roboto', sans-serif",
              },
              "& .MuiFormHelperText-root": {
                color: darkMode ? "#f44336" : "#721c24",
              },
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
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                "&:hover fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                "&.Mui-focused fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                backgroundColor: darkMode ? "#2c3e50" : "#fff",
                color: darkMode ? "#ecf0f1" : "#2c3e50",
              },
              "& .MuiInputLabel-root": {
                color: darkMode ? "#bdc3c7" : "#7f8c8d",
                "&.Mui-focused": { color: darkMode ? "#1abc9c" : "#6c4f37" },
              },
              "& .MuiInputBase-input": {
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                fontFamily: "'Roboto', sans-serif",
              },
              "& .MuiFormHelperText-root": {
                color: darkMode ? "#f44336" : "#721c24",
              },
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
                "& fieldset": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                "&:hover fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                "&.Mui-focused fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                backgroundColor: darkMode ? "#2c3e50" : "#fff",
                color: darkMode ? "#ecf0f1" : "#2c3e50",
              },
              "& .MuiInputLabel-root": {
                color: darkMode ? "#bdc3c7" : "#7f8c8d",
                "&.Mui-focused": { color: darkMode ? "#1abc9c" : "#6c4f37" },
              },
              "& .MuiInputBase-input": {
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                fontFamily: "'Roboto', sans-serif",
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => handleCreateUser("Therapist")}
            sx={{
              mr: 2,
              py: 1.5,
              px: 4,
              borderRadius: "8px",
              background: darkMode ? "#1abc9c" : "#6c4f37",
              color: "#fff",
              "&:hover": { background: darkMode ? "#16a085" : "#5a3f2e" },
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Therapist
          </Button>
          <Button
            variant="contained"
            onClick={() => handleCreateUser("Staff")}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: "8px",
              background: darkMode ? "#3498db" : "#8e6f4e",
              color: "#fff",
              "&:hover": { background: darkMode ? "#2980b9" : "#7a5d41" },
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
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
        sx={{
          mb: 2,
          color: darkMode ? "#ecf0f1" : "#2c3e50",
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Search Users
      </Typography>
      {loading && (
        <Typography
          variant="body2"
          sx={{
            color: darkMode ? "#bdc3c7" : "#7f8c8d",
            mb: 2,
            fontFamily: "'Roboto', sans-serif",
          }}
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
                "& fieldset": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                "&:hover fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                "&.Mui-focused fieldset": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
                backgroundColor: darkMode ? "#2c3e50" : "#fff",
                color: darkMode ? "#ecf0f1" : "#2c3e50",
              },
              "& .MuiInputLabel-root": {
                color: darkMode ? "#bdc3c7" : "#7f8c8d",
                "&.Mui-focused": { color: darkMode ? "#1abc9c" : "#6c4f37" },
              },
              "& .MuiInputBase-input": {
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                fontFamily: "'Roboto', sans-serif",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: "8px",
              color: darkMode ? "#f44336" : "#721c24",
              borderColor: darkMode ? "#f44336" : "#721c24",
              "&:hover": {
                borderColor: darkMode ? "#d32f2f" : "#5a171d",
                backgroundColor: darkMode ? "rgba(244, 67, 54, 0.1)" : "rgba(114, 28, 36, 0.1)",
              },
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
          border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
          boxShadow: darkMode
            ? "0 8px 24px rgba(0, 0, 0, 0.4)"
            : "0 8px 24px rgba(0, 0, 0, 0.15)",
        }}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResult.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{
                    color: darkMode ? "#ecf0f1" : "#2c3e50",
                    textAlign: "center",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  {searchTerm ? "No matching users found." : "Enter a username to search."}
                </TableCell>
              </TableRow>
            ) : (
              searchResult.map((user) => (
                <TableRow
                  key={user.userName}
                  sx={{
                    "&:hover": { background: darkMode ? "#455a64" : "#f8f4e1" },
                  }}
                >
                  <TableCell
                    sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}
                  >
                    {user.userName}
                  </TableCell>
                  <TableCell
                    sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}
                  >
                    {user.role || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Error Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={handleErrorDialogClose}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title" sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
          Error
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="error-dialog-description"
            sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", whiteSpace: "pre-line" }}
          >
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorDialogClose}
            sx={{ color: darkMode ? "#1abc9c" : "#6c4f37" }}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
}