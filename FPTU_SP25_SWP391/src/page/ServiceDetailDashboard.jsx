import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import {
  getServiceCategories,
  getAllServices,
  postCreateService,
  updateService,
  deleteService,
  postImageService,
  getImageService,
  deleteImageService,
} from "../api/testApi";

const DashboardCard = styled("div")(({ darkMode }) => ({
  padding: "30px",
  borderRadius: "16px",
  background: darkMode ? "#000000" : "#ffffff",
  boxShadow: darkMode
    ? "0 8px 24px rgba(255, 255, 255, 0.1)"
    : "0 8px 24px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: darkMode
      ? "0 12px 32px rgba(255, 255, 255, 0.15)"
      : "0 12px 32px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledTableContainer = styled(TableContainer)(({ darkMode }) => ({
  background: darkMode ? "#000000" : "#ffffff",
  "& .MuiPaper-root": {
    background: darkMode ? "#000000" : "#ffffff",
    boxShadow: "none",
  },
}));

const ServiceDetailDashboard = ({ darkMode }) => {
  const [serviceForm, setServiceForm] = useState({
    serviceCategoryId: "",
    name: "",
    description: "",
    price: "",
    status: true,
  });
  const [serviceCategories, setServiceCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imageUrls, setImageUrls] = useState({}); // { serviceId: [{ imageServiceId, imageURL, isMain }] }
  const [selectedImages, setSelectedImages] = useState({}); // For deletion

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const [categoriesResponse, servicesResponse] = await Promise.all([
        getServiceCategories(token),
        getAllServices(token),
      ]);
      setServiceCategories(categoriesResponse.data || []);
      const servicesData = servicesResponse.data || [];
      setServices(servicesData);

      const imagePromises = servicesData.map((service) =>
        getImageService(service.serviceId, token)
          .then((res) => ({
            serviceId: service.serviceId,
            images: (res.data || []).map((img, index) => ({
              imageServiceId: img.imageServiceId,
              imageURL: img.imageURL,
              isMain: index === 0, // Default first image as main
            })),
          }))
          .catch(() => ({
            serviceId: service.serviceId,
            images: [],
          }))
      );
      const imageResults = await Promise.all(imagePromises);
      const imageMap = imageResults.reduce((acc, { serviceId, images }) => {
        acc[serviceId] = images;
        return acc;
      }, {});
      setImageUrls(imageMap);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      setError(
        `Failed to fetch data: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const isDuplicateName = (name, excludeServiceId = null) => {
    return services.some(
      (service) =>
        service.name.toLowerCase() === name.toLowerCase() &&
        (excludeServiceId ? service.serviceId !== excludeServiceId : true)
    );
  };

  const handleCreateService = async () => {
    if (!serviceForm.name.trim() || !serviceForm.serviceCategoryId) {
      setError("Service name and category are required.");
      return;
    }
    if (parseFloat(serviceForm.price) <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    if (isDuplicateName(serviceForm.name)) {
      alert("A service with this name already exists. Please choose a different name.");
      return;
    }
    const selectedCategory = serviceCategories.find(
      (cat) => cat.serviceCategoryId === serviceForm.serviceCategoryId
    );
    if (!selectedCategory?.status) {
      setError("Cannot create a service with an inactive category.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const serviceData = {
        serviceCategoryId: serviceForm.serviceCategoryId,
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        status: serviceForm.status,
        exist: true,
      };
      await postCreateService(serviceData, token);
      setServiceForm({
        serviceCategoryId: "",
        name: "",
        description: "",
        price: "",
        status: true,
      });
      await fetchData();
      alert("Service created successfully!");
    } catch (error) {
      console.error("Error creating service:", error.response?.data || error.message);
      setError(
        `Failed to create service: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      serviceCategoryId: service.serviceCategoryId,
      name: service.name,
      description: service.description || "",
      price: service.price || "",
      status: service.status,
    });
  };

  const handleUpdateService = async () => {
    if (!serviceForm.name.trim() || !serviceForm.serviceCategoryId) {
      setError("Service name and category are required.");
      return;
    }
    if (parseFloat(serviceForm.price) <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    if (isDuplicateName(serviceForm.name, editingService.serviceId)) {
      alert("A service with this name already exists. Please choose a different name.");
      return;
    }
    const selectedCategory = serviceCategories.find(
      (cat) => cat.serviceCategoryId === serviceForm.serviceCategoryId
    );
    if (!selectedCategory?.status) {
      setError("Cannot update a service to an inactive category.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const serviceData = {
        serviceCategoryId: serviceForm.serviceCategoryId,
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        status: serviceForm.status,
        exist: true,
      };
      await updateService(editingService.serviceId, serviceData, token);
      setServiceForm({
        serviceCategoryId: "",
        name: "",
        description: "",
        price: "",
        status: true,
      });
      setEditingService(null);
      await fetchData();
      alert("Service updated successfully!");
    } catch (error) {
      console.error("Error updating service:", error.response?.data || error.message);
      setError(
        `Failed to update service: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await deleteService(serviceId, token);
      setImageUrls((prev) => {
        const newImageUrls = { ...prev };
        delete newImageUrls[serviceId];
        return newImageUrls;
      });
      await fetchData();
      alert("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error.response?.data || error.message);
      setError(
        `Failed to delete service: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event, serviceId) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "skincare");
    data.append("cloud_name", "dhqfg7lrc");
    data.append("api_key", "YOUR_API_KEY"); // Replace with your Cloudinary API key

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://api.cloudinary.com/v1_1/dhqfg7lrc/image/upload", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        const uploadImgUrl = await res.json();
        const imageUrl = uploadImgUrl.url;
        const token = localStorage.getItem("token");
        const imageData = { serviceId: serviceId, imageURL: imageUrl };
        const postResponse = await postImageService(imageData, token);
        const newImage = {
          imageServiceId: postResponse.data.imageServiceId,
          imageURL: imageUrl,
          isMain: !imageUrls[serviceId]?.length, // First image is main by default
        };
        setImageUrls((prev) => ({
          ...prev,
          [serviceId]: [...(prev[serviceId] || []), newImage],
        }));
        alert("Image uploaded and saved successfully!");
      } else {
        setError("Error uploading image to Cloudinary: " + res.statusText);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Failed to upload image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = (serviceId, imageServiceId) => {
    setSelectedImages((prev) => {
      const serviceSelections = prev[serviceId] || [];
      if (serviceSelections.includes(imageServiceId)) {
        return {
          ...prev,
          [serviceId]: serviceSelections.filter((id) => id !== imageServiceId),
        };
      } else {
        return {
          ...prev,
          [serviceId]: [...serviceSelections, imageServiceId],
        };
      }
    });
  };

  const handleDeleteSelectedImages = async (serviceId) => {
    const imagesToDelete = selectedImages[serviceId] || [];
    if (imagesToDelete.length === 0) {
      alert("No images selected for deletion.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete the selected images?")) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const deletePromises = imagesToDelete.map((imageServiceId) =>
        deleteImageService(imageServiceId, token)
      );
      await Promise.all(deletePromises);
      setImageUrls((prev) => {
        const updatedImages = (prev[serviceId] || []).filter(
          (img) => !imagesToDelete.includes(img.imageServiceId)
        );
        if (updatedImages.length > 0 && !updatedImages.some((img) => img.isMain)) {
          updatedImages[0].isMain = true; // Set first remaining image as main
        }
        return {
          ...prev,
          [serviceId]: updatedImages,
        };
      });
      setSelectedImages((prev) => ({
        ...prev,
        [serviceId]: [],
      }));
      alert("Selected images deleted successfully!");
    } catch (error) {
      console.error("Error deleting images:", error.response?.data || error.message);
      setError(
        `Failed to delete images: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainImage = (serviceId, imageServiceId) => {
    setImageUrls((prev) => {
      const updatedImages = (prev[serviceId] || []).map((img) => ({
        ...img,
        isMain: img.imageServiceId === imageServiceId,
      }));
      return {
        ...prev,
        [serviceId]: updatedImages,
      };
    });
    // Note: Add backend API call here if supported (e.g., updateImageService)
  };

  const activeServiceCategories = serviceCategories.filter((category) => category.status);

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          color: darkMode ? "#ffffff" : "#6e6e73",
          mb: 4,
          fontStyle: "italic",
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Manage your service details here.
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
          sx={{ color: darkMode ? "#ffffff" : "#6e6e73", mb: 2 }}
        >
          Loading...
        </Typography>
      )}

      {/* Service Creation/Edit Form */}
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
          sx={{
            mb: 3,
            color: darkMode ? "#ffffff" : "#1d1d1f",
            fontWeight: 600,
          }}
        >
          {editingService ? "Edit Service" : "Add New Service"}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: darkMode ? "#ffffff" : "#6e6e73" }}>
                Service Category
              </InputLabel>
              <Select
                name="serviceCategoryId"
                value={serviceForm.serviceCategoryId}
                onChange={handleInputChange}
                disabled={loading || activeServiceCategories.length === 0}
                sx={{
                  color: darkMode ? "#ffffff" : "#1d1d1f",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#333333" : "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#444444" : "#1d1d1f",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#ffffff" : "#1d1d1f",
                  },
                }}
              >
                <MenuItem value="">Select Category</MenuItem>
                {activeServiceCategories.map((category) => (
                  <MenuItem
                    key={category.serviceCategoryId}
                    value={category.serviceCategoryId}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Service Name"
              name="name"
              value={serviceForm.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#333333" : "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#444444" : "#1d1d1f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "#ffffff" : "#1d1d1f",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#ffffff" : "#6e6e73",
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#ffffff" : "#1d1d1f",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={serviceForm.description}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#333333" : "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#444444" : "#1d1d1f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "#ffffff" : "#1d1d1f",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#ffffff" : "#6e6e73",
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#ffffff" : "#1d1d1f",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price ($)"
              name="price"
              type="number"
              value={serviceForm.price}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#333333" : "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#444444" : "#1d1d1f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "#ffffff" : "#1d1d1f",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#ffffff" : "#6e6e73",
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#ffffff" : "#1d1d1f",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: darkMode ? "#ffffff" : "#6e6e73" }}>
                Status
              </InputLabel>
              <Select
                name="status"
                value={serviceForm.status}
                onChange={handleInputChange}
                disabled={loading}
                sx={{
                  color: darkMode ? "#ffffff" : "#1d1d1f",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#333333" : "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#444444" : "#1d1d1f",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
              {loading
                ? editingService
                  ? "Updating..."
                  : "Creating..."
                : editingService
                ? "Update Service"
                : "Add Service"}
            </Button>
            {editingService && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({
                    serviceCategoryId: "",
                    name: "",
                    description: "",
                    price: "",
                    status: true,
                  });
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

      {/* Service List */}
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
            color: darkMode ? "#ffffff" : "#1d1d1f",
            fontWeight: 600,
          }}
        >
          All Services
        </Typography>
        <StyledTableContainer darkMode={darkMode} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>Name</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>Category</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>Price</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>Status</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>Images</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", textAlign: "center" }}
                  >
                    No services available.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.serviceId}>
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {service.name}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {serviceCategories.find(
                        (cat) => cat.serviceCategoryId === service.serviceCategoryId
                      )?.name || "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      ${service.price}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {service.description ? "Yes" : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {service.status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      {imageUrls[service.serviceId]?.length > 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {imageUrls[service.serviceId].map((img) => (
                            <Box
                              key={img.imageServiceId}
                              sx={{ display: "flex", alignItems: "center", gap: 1 }}
                            >
                              <Checkbox
                                checked={img.isMain}
                                onChange={() =>
                                  handleSetMainImage(service.serviceId, img.imageServiceId)
                                }
                                disabled={loading}
                                sx={{
                                  color: darkMode ? "#ffffff" : "#1976d2",
                                  "&.Mui-checked": { color: darkMode ? "#ffffff" : "#1976d2" },
                                }}
                              />
                              <img
                                src={img.imageURL}
                                alt={`${service.name} - ${img.imageServiceId}`}
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  borderRadius: "8px",
                                }}
                              />
                              <Checkbox
                                checked={(selectedImages[service.serviceId] || []).includes(
                                  img.imageServiceId
                                )}
                                onChange={() =>
                                  handleImageSelection(service.serviceId, img.imageServiceId)
                                }
                                disabled={loading}
                                sx={{
                                  color: darkMode ? "#ff5722" : "#d32f2f", // Red for deletion
                                  "&.Mui-checked": {
                                    color: darkMode ? "#ff5722" : "#d32f2f",
                                  },
                                }}
                              />
                            </Box>
                          ))}
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteSelectedImages(service.serviceId)}
                            disabled={
                              loading || !(selectedImages[service.serviceId]?.length > 0)
                            }
                            sx={{
                              mt: 1,
                              color: darkMode ? "#ffffff" : "#d32f2f",
                              borderColor: darkMode ? "#ffffff" : "#d32f2f",
                              "&:hover": { borderColor: darkMode ? "#cccccc" : "#c62828" },
                            }}
                          >
                            Delete Selected
                          </Button>
                        </Box>
                      ) : (
                        "No images"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditService(service)}
                        disabled={loading}
                        sx={{
                          mr: 1,
                          py: 0.5,
                          px: 2,
                          borderRadius: "6px",
                          color: darkMode ? "#ffffff" : "#1976d2",
                          borderColor: darkMode ? "#ffffff" : "#1976d2",
                          fontWeight: 500,
                          textTransform: "none",
                          "&:hover": {
                            borderColor: darkMode ? "#cccccc" : "#1565c0",
                            backgroundColor: darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(25, 118, 210, 0.1)",
                          },
                          "&.Mui-disabled": {
                            color: darkMode ? "#666" : "#999",
                            borderColor: darkMode ? "#424242" : "#e0e0e0",
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteService(service.serviceId)}
                        disabled={loading}
                        sx={{
                          mr: 1,
                          py: 0.5,
                          px: 2,
                          borderRadius: "6px",
                          color: darkMode ? "#ffffff" : "#d32f2f",
                          borderColor: darkMode ? "#ffffff" : "#d32f2f",
                          fontWeight: 500,
                          textTransform: "none",
                          "&:hover": {
                            borderColor: darkMode ? "#cccccc" : "#c62828",
                            backgroundColor: darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(211, 47, 47, 0.1)",
                          },
                          "&.Mui-disabled": {
                            color: darkMode ? "#666" : "#999",
                            borderColor: darkMode ? "#424242" : "#e0e0e0",
                          },
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={loading}
                        sx={{
                          py: 0.5,
                          px: 2,
                          borderRadius: "6px",
                          color: darkMode ? "#ffffff" : "#2e7d32",
                          borderColor: darkMode ? "#ffffff" : "#2e7d32",
                          fontWeight: 500,
                          textTransform: "none",
                          "&:hover": {
                            borderColor: darkMode ? "#cccccc" : "#4caf50",
                            backgroundColor: darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(46, 125, 50, 0.1)",
                          },
                          "&.Mui-disabled": {
                            color: darkMode ? "#666" : "#999",
                            borderColor: darkMode ? "#424242" : "#e0e0e0",
                          },
                        }}
                      >
                        Add Picture
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleFileUpload(e, service.serviceId)}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </DashboardCard>
    </Box>
  );
};

export default ServiceDetailDashboard;