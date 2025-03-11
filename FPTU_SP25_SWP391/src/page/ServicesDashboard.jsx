import React, { useState, useEffect } from "react";
import {
  Box,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { getServiceCategories, postServiceCategory, updateServiceCategory, deleteServiceCategory } from "../api/testApi";

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

export default function ServicesDashboard({ darkMode }) {
  const [serviceForm, setServiceForm] = useState({ name: "", status: true });
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: value === "true" ? true : value === "false" ? false : value,
    }));
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");
      const response = await getServiceCategories(token);
      console.log("Fetched service categories:", response.data);
      setServices(response.data || []);
      setFilteredServices(response.data || []);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      setError(`Failed to fetch service categories: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if the name already exists, excluding the current service being edited
  const isDuplicateName = (name, excludeServiceId = null) => {
    return services.some(
      (service) =>
        service.name.toLowerCase() === name.toLowerCase() &&
        (excludeServiceId ? service.serviceCategoryId !== excludeServiceId : true)
    );
  };

  const handleCreateService = async () => {
    if (!serviceForm.name.trim()) {
      setError("Service category name cannot be empty.");
      return;
    }
    if (isDuplicateName(serviceForm.name)) {
      setError("A service category with this name already exists. Please choose a different name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");
      const serviceData = { name: serviceForm.name, status: serviceForm.status, exist: true };
      const response = await postServiceCategory(serviceData, token);
      console.log("Created service category:", response.data);
      setServiceForm({ name: "", status: true });
      await fetchServices();
      alert("Service category created successfully!");
    } catch (error) {
      console.error("Error creating service category:", error);
      setError(
        `Failed to create service category: ${
          error.response?.status === 415
            ? "Unsupported media type. Contact support."
            : error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    console.log("Editing service category:", service);
    setEditingService(service);
    setServiceForm({ name: service.name, status: service.status });
  };

  const handleUpdateService = async () => {
    if (!serviceForm.name.trim()) {
      setError("Service category name cannot be empty.");
      return;
    }
    if (isDuplicateName(serviceForm.name, editingService.serviceCategoryId)) {
      setError("A service category with this name already exists. Please choose a different name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");
      const serviceData = { ...editingService, name: serviceForm.name, status: serviceForm.status };
      const response = await updateServiceCategory(editingService.serviceCategoryId, serviceData, token);
      console.log("Updated service category:", response.data);
      setServiceForm({ name: "", status: true });
      setEditingService(null);
      await fetchServices();
      alert("Service category updated successfully!");
    } catch (error) {
      console.error("Error updating service category:", error);
      setError(`Failed to update service category: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceCategoryId) => {
    console.log("Deleting service category with ID:", serviceCategoryId);
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");
      const response = await deleteServiceCategory(serviceCategoryId, token);
      console.log("Deleted service category response:", response.data);
      await fetchServices();
      alert("Service category deleted successfully!");
    } catch (error) {
      console.error("Error deleting service category:", error);
      setError(`Failed to delete service category: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Search and Sort Logic
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterAndSortServices(value, sortField, sortOrder);
  };

  const handleSortChange = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    filterAndSortServices(searchTerm, field, newOrder);
  };

  const filterAndSortServices = (search, field, order) => {
    let result = [...services];

    // Filter by search term (name)
    if (search.trim()) {
      result = result.filter((service) =>
        service.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by field
    if (field) {
      result.sort((a, b) => {
        let aValue = field === "serviceCategoryId" ? (a[field] || "") : a[field];
        let bValue = field === "serviceCategoryId" ? (b[field] || "") : b[field];
        if (field === "status") {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        }
        if (order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredServices(result);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 4, fontStyle: "italic" }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Manage and create service categories here.
      </Typography>

      {error && (
        <Typography
          variant="body2"
          sx={{ color: "#f44336", mb: 2 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </Typography>
      )}

      {loading && (
        <Typography
          variant="body2"
          sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", mb: 2 }}
        >
          Loading...
        </Typography>
      )}

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
          {editingService ? "Edit Service Category" : "Create New Service Category"}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Service Category Name"
              name="name"
              value={serviceForm.name}
              onChange={handleServiceInputChange}
              fullWidth
              variant="outlined"
              disabled={loading}
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>Status</InputLabel>
              <Select
                name="status"
                value={serviceForm.status}
                onChange={handleServiceInputChange}
                disabled={loading}
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
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={editingService ? handleUpdateService : handleCreateService}
              disabled={loading}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: "8px",
                background: darkMode ? "#1976d2" : "#1d1d1f",
                "&:hover": { background: darkMode ? "#1565c0" : "#333" },
                "&.Mui-disabled": { background: darkMode ? "#555" : "#ccc" },
              }}
              component={motion.div}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? (editingService ? "Updating..." : "Creating...") : 
                (editingService ? "Update Service Category" : "Create Service Category")}
            </Button>
            {editingService && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({ name: "", status: true });
                }}
                disabled={loading}
                sx={{
                  ml: 2,
                  py: 1.5,
                  px: 4,
                  borderRadius: "8px",
                  color: darkMode ? "#d81b60" : "#6e6e73",
                  borderColor: darkMode ? "#d81b60" : "#6e6e73",
                  "&:hover": { borderColor: darkMode ? "#c2185b" : "#555" },
                }}
                component={motion.div}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                Cancel
              </Button>
            )}
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
          All Service Categories
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Search by Name"
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
        </Box>
        <TableContainer
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                  Category ID
                  <Button
                    onClick={() => handleSortChange("serviceCategoryId")}
                    sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", minWidth: "auto", p: 0, ml: 1 }}
                  >
                    {sortField === "serviceCategoryId" && sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </TableCell>
                <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                  Name
                  <Button
                    onClick={() => handleSortChange("name")}
                    sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", minWidth: "auto", p: 0, ml: 1 }}
                  >
                    {sortField === "name" && sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </TableCell>
                <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                  Status
                  <Button
                    onClick={() => handleSortChange("status")}
                    sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", minWidth: "auto", p: 0, ml: 1 }}
                  >
                    {sortField === "status" && sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </TableCell>
                <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredServices.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", textAlign: "center" }}
                  >
                    No service categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service, index) => (
                  <TableRow
                    key={service.serviceCategoryId || `${service.name}-${index}`}
                    sx={{
                      "&:hover": {
                        background: darkMode ? "#2d2d2d" : "#f5f5f5",
                        transition: "background 0.3s ease",
                      },
                    }}
                  >
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {service.serviceCategoryId || "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {service.name}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {service.status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditService(service)}
                        sx={{
                          mr: 1,
                          color: darkMode ? "#1976d2" : "#1d1d1f",
                          borderColor: darkMode ? "#1976d2" : "#1d1d1f",
                          "&:hover": { borderColor: darkMode ? "#1565c0" : "#333" },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteService(service.serviceCategoryId)}
                        sx={{
                          color: darkMode ? "#d81b60" : "#6e6e73",
                          borderColor: darkMode ? "#d81b60" : "#6e6e73",
                          "&:hover": { borderColor: darkMode ? "#c2185b" : "#555" },
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
        </TableContainer>
      </DashboardCard>
    </Box>
  );
}