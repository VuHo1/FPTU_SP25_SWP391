import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  getAllUsers,
  getServiceCategories,
  createTherapistSpecialty,
  getAllTherapistSpecialties,
  deleteTherapistSpecialty, // Newly added import
} from "../api/testApi";

// Custom styled components for a professional look
const DashboardPaper = styled(Paper)(({ theme, darkMode }) => ({
  backgroundColor: darkMode ? "#1e2a38" : "#ffffff",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: darkMode
    ? "0 4px 20px rgba(255, 255, 255, 0.05)"
    : "0 4px 20px rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
}));

const SectionTitle = styled(Typography)(({ darkMode }) => ({
  color: darkMode ? "#e0e0e0" : "#2c3e50",
  fontWeight: 600,
  fontSize: "1.5rem",
  marginBottom: "20px",
  letterSpacing: "0.5px",
}));

const StyledTableContainer = styled(TableContainer)(({ darkMode }) => ({
  backgroundColor: darkMode ? "#263544" : "#f9fafb",
  borderRadius: "8px",
  "& .MuiTableHead-root": {
    backgroundColor: darkMode ? "#2e4053" : "#edf2f7",
  },
  "& .MuiTableCell-head": {
    color: darkMode ? "#b0c4de" : "#4a5568",
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: "0.85rem",
    letterSpacing: "0.5px",
  },
  "& .MuiTableCell-body": {
    color: darkMode ? "#d1d5db" : "#2d3748",
    fontSize: "0.9rem",
    borderBottom: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
  },
}));

const FormBox = styled(Box)(({ darkMode }) => ({
  backgroundColor: darkMode ? "#263544" : "#f9fafb",
  padding: "20px",
  borderRadius: "8px",
  border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
}));

const StyledButton = styled(Button)(({ darkMode }) => ({
  backgroundColor: darkMode ? "#3182ce" : "#2b6cb0",
  color: "#ffffff",
  padding: "10px 24px",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: darkMode ? "#2b6cb0" : "#2c5282",
  },
  "&:disabled": {
    backgroundColor: darkMode ? "#4a5568" : "#cbd5e0",
  },
}));

const ScheduleSelectionStaff = ({ darkMode }) => {
  const [therapists, setTherapists] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [therapistSpecialties, setTherapistSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newSpecialty, setNewSpecialty] = useState({ therapistId: "", serviceCategoryIds: [] });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!token) throw new Error("No authentication token found");
      setLoading(true);
      setError(null);

      const usersResponse = await getAllUsers(token);
      const therapistUsers = usersResponse.data.filter((user) => user.role === "Therapist");
      const categoriesResponse = await getServiceCategories(token);
      console.log("Raw service categories data:", categoriesResponse.data);
      const specialtiesResponse = await getAllTherapistSpecialties(token);

      setTherapists(therapistUsers);
      setServiceCategories(categoriesResponse.data);
      setTherapistSpecialties(specialtiesResponse);
    } catch (error) {
      setError("Failed to load data: " + (error.message || "Unknown error"));
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = (categoryId) => {
    if (!categoryId || isNaN(categoryId)) return;
    setNewSpecialty((prev) => ({
      ...prev,
      serviceCategoryIds: prev.serviceCategoryIds.includes(categoryId)
        ? prev.serviceCategoryIds.filter((id) => id !== categoryId)
        : [...prev.serviceCategoryIds, categoryId],
    }));
  };

  const handleCreateSpecialty = async () => {
    try {
      if (!newSpecialty.therapistId || newSpecialty.serviceCategoryIds.length === 0) {
        setError("Please select a therapist and at least one service category.");
        return;
      }
      const validCategoryIds = newSpecialty.serviceCategoryIds.filter((id) => id && !isNaN(id));
      if (validCategoryIds.length === 0) {
        setError("No valid service categories selected.");
        return;
      }
      setLoading(true);
      setError(null);
      setSuccess(null);

      const requests = validCategoryIds.map((categoryId) =>
        createTherapistSpecialty(newSpecialty.therapistId, categoryId, token)
      );
      await Promise.all(requests);

      const specialtiesResponse = await getAllTherapistSpecialties(token);
      setTherapistSpecialties(specialtiesResponse);

      const updatedTherapists = therapists.map((t) =>
        t.userId === Number(newSpecialty.therapistId)
          ? { ...t, serviceCategoryIds: [...(t.serviceCategoryIds || []), ...validCategoryIds] }
          : t
      );
      setTherapists(updatedTherapists);

      setNewSpecialty({ therapistId: "", serviceCategoryIds: [] });
      setSuccess("Adding specialty complete");
    } catch (error) {
      setError(`Failed to create specialty: ${error.message || "Unknown error"}`);
      console.error("Error creating specialty:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpecialty = async (specialtyId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await deleteTherapistSpecialty(specialtyId, token);

      // Update local state by removing the deleted specialty
      setTherapistSpecialties((prev) =>
        prev.filter((specialty) => specialty.id !== specialtyId)
      );

      setSuccess("Therapist specialty deleted successfully");
    } catch (error) {
      setError(`Failed to delete specialty: ${error.message || "Unknown error"}`);
      console.error("Error deleting specialty:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardPaper darkMode={darkMode}>
      <SectionTitle darkMode={darkMode}>Therapist Schedule Management</SectionTitle>

      {/* Status Messages */}
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <CircularProgress size={20} sx={{ color: darkMode ? "#718096" : "#a0aec0" }} />
          <Typography sx={{ color: darkMode ? "#718096" : "#a0aec0", fontSize: "0.95rem" }}>
            Loading data...
          </Typography>
        </Box>
      )}
      {error && (
        <Typography sx={{ color: "#f56565", mb: 3, fontSize: "0.95rem", fontWeight: 500 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography sx={{ color: "#48bb78", mb: 3, fontSize: "0.95rem", fontWeight: 500 }}>
          {success}
        </Typography>
      )}

      {!loading && !error && (
        <>
          {/* Therapists Table */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: darkMode ? "#cbd5e0" : "#4a5568",
                fontWeight: 600,
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Therapists
            </Typography>
            <StyledTableContainer darkMode={darkMode}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Therapist ID</TableCell>
                    <TableCell>Therapist Name</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {therapists.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center", color: darkMode ? "#718096" : "#a0aec0" }}>
                        No therapists available
                      </TableCell>
                    </TableRow>
                  ) : (
                    therapists.map((therapist) => (
                      <TableRow
                        key={therapist.userId}
                        sx={{ "&:hover": { backgroundColor: darkMode ? "#2d3748" : "#edf2f7" } }}
                      >
                        <TableCell>{therapist.userId}</TableCell>
                        <TableCell>{therapist.userName}</TableCell>
                        <TableCell>{therapist.email}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>

          {/* Service Categories Table */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: darkMode ? "#cbd5e0" : "#4a5568",
                fontWeight: 600,
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Service Categories
            </Typography>
            <StyledTableContainer darkMode={darkMode}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category ID</TableCell>
                    <TableCell>Category Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: "center", color: darkMode ? "#718096" : "#a0aec0" }}>
                        No service categories available
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceCategories.map((category) => (
                      <TableRow
                        key={category.serviceCategoryId}
                        sx={{ "&:hover": { backgroundColor: darkMode ? "#2d3748" : "#edf2f7" } }}
                      >
                        <TableCell>{category.serviceCategoryId}</TableCell>
                        <TableCell>{category.name}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>

          {/* Create Specialty Form */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: darkMode ? "#cbd5e0" : "#4a5568",
                fontWeight: 600,
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Assign Therapist Specialty
            </Typography>
            <FormBox darkMode={darkMode}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl sx={{ minWidth: 240 }}>
                  <InputLabel sx={{ color: darkMode ? "#a0aec0" : "#718096" }}>Select Therapist</InputLabel>
                  <Select
                    value={newSpecialty.therapistId}
                    onChange={(e) => setNewSpecialty({ ...newSpecialty, therapistId: e.target.value })}
                    sx={{
                      color: darkMode ? "#e2e8f0" : "#2d3748",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#4a5568" : "#cbd5e0" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#718096" : "#a0aec0" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#3182ce" : "#2b6cb0" },
                      backgroundColor: darkMode ? "#1a202c" : "#ffffff",
                      borderRadius: "6px",
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {therapists.map((therapist) => (
                      <MenuItem key={therapist.userId} value={therapist.userId}>
                        {therapist.userName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box>
                  <Typography sx={{ color: darkMode ? "#cbd5e0" : "#4a5568", mb: 1.5, fontWeight: 500 }}>
                    Service Categories
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {serviceCategories.map((category) => (
                      <FormControlLabel
                        key={category.serviceCategoryId}
                        control={
                          <Checkbox
                            checked={newSpecialty.serviceCategoryIds.includes(category.serviceCategoryId)}
                            onChange={() => handleToggleCategory(category.serviceCategoryId)}
                            sx={{
                              color: darkMode ? "#718096" : "#a0aec0",
                              "&.Mui-checked": { color: darkMode ? "#3182ce" : "#2b6cb0" },
                            }}
                          />
                        }
                        label={category.name}
                        sx={{
                          color: darkMode ? "#d1d5db" : "#2d3748",
                          marginRight: 3,
                          "&:hover": { color: darkMode ? "#e2e8f0" : "#1a202c" },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <StyledButton
                  variant="contained"
                  onClick={handleCreateSpecialty}
                  disabled={loading}
                  darkMode={darkMode}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Assign Specialty"}
                </StyledButton>
              </Box>
            </FormBox>
          </Box>

          {/* Therapist Specialties Table */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: darkMode ? "#cbd5e0" : "#4a5568",
                fontWeight: 600,
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Current Therapist Specialties
            </Typography>
            <StyledTableContainer darkMode={darkMode}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Therapist ID</TableCell>
                    <TableCell>Service Category ID</TableCell>
                    <TableCell>Category Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {therapistSpecialties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "center", color: darkMode ? "#718096" : "#a0aec0" }}>
                        No specialties assigned
                      </TableCell>
                    </TableRow>
                  ) : (
                    therapistSpecialties.map((specialty, index) => (
                      <TableRow
                        key={index}
                        sx={{ "&:hover": { backgroundColor: darkMode ? "#2d3748" : "#edf2f7" } }}
                      >
                        <TableCell>{specialty.therapistId}</TableCell>
                        <TableCell>{specialty.serviceCategoryId}</TableCell>
                        <TableCell>
                          {serviceCategories.find((cat) => cat.serviceCategoryId === specialty.serviceCategoryId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteSpecialty(specialty.id)}
                            disabled={loading}
                            sx={{
                              textTransform: "none",
                              borderRadius: "6px",
                              padding: "4px 12px",
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>
        </>
      )}
    </DashboardPaper>
  );
};

ScheduleSelectionStaff.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default ScheduleSelectionStaff;