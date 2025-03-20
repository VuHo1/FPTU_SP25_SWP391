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

const StyledTableContainer = styled(TableContainer)(({ darkMode }) => ({
  background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
  "& .MuiPaper-root": {
    background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
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
  const [imageUrls, setImageUrls] = useState({});
  const [selectedImages, setSelectedImages] = useState({});

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
      const categories = categoriesResponse.data || [];
      setServiceCategories(categories);
      const servicesData = servicesResponse.data || [];

      // Adjust service status based on category status
      const adjustedServices = servicesData.map((service) => {
        const category = categories.find(
          (cat) => cat.serviceCategoryId === service.serviceCategoryId
        );
        return {
          ...service,
          status: category?.status === false ? false : service.status, // If category is inactive, service is inactive
        };
      });
      setServices(adjustedServices);

      const imagePromises = adjustedServices.map((service) =>
        getImageService(service.serviceId, token)
          .then((res) => ({
            serviceId: service.serviceId,
            images: (res.data || []).map((img, index) => ({
              imageServiceId: img.imageServiceId,
              imageURL: img.imageURL,
              isMain: index === 0,
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

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return `${parseFloat(price).toLocaleString("vi-VN")} ₫`;
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
        status: selectedCategory.status === false ? false : serviceForm.status, // Sync with category status
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
          isMain: !imageUrls[serviceId]?.length,
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
          updatedImages[0].isMain = true;
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
  };

  const activeServiceCategories = serviceCategories.filter((category) => category.status);

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          color: darkMode ? "#ecf0f1" : "#7f8c8d",
          mb: 4,
          fontStyle: "italic",
          fontFamily: "'Roboto', sans-serif",
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
          sx={{ color: "#f44336", mb: 2, fontFamily: "'Roboto', sans-serif" }}
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
          sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", mb: 2, fontFamily: "'Roboto', sans-serif" }}
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
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {editingService ? "Edit Service" : "Add New Service"}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d" }}>
                Service Category
              </InputLabel>
              <Select
                name="serviceCategoryId"
                value={serviceForm.serviceCategoryId}
                onChange={handleInputChange}
                disabled={loading || activeServiceCategories.length === 0}
                sx={{
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#5a758c" : "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
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
                    borderColor: darkMode ? "#5a758c" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#bdc3c7" : "#7f8c8d",
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontFamily: "'Roboto', sans-serif",
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
                    borderColor: darkMode ? "#5a758c" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#bdc3c7" : "#7f8c8d",
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontFamily: "'Roboto', sans-serif",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price (₫)"
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
                    borderColor: darkMode ? "#5a758c" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#bdc3c7" : "#7f8c8d",
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontFamily: "'Roboto', sans-serif",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d" }}>
                Status
              </InputLabel>
              <Select
                name="status"
                value={serviceForm.status}
                onChange={handleInputChange}
                disabled={loading || (editingService && !serviceCategories.find(cat => cat.serviceCategoryId === serviceForm.serviceCategoryId)?.status)}
                sx={{
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#5a758c" : "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
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
                background: darkMode ? "#1abc9c" : "#6c4f37",
                "&:hover": { background: darkMode ? "#16a085" : "#5a3f2f" },
                "&.Mui-disabled": { background: darkMode ? "#5a758c" : "#ccc" },
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
                  color: darkMode ? "#e74c3c" : "#e74c3c",
                  borderColor: darkMode ? "#e74c3c" : "#e74c3c",
                  "&:hover": { borderColor: darkMode ? "#c0392b" : "#c0392b" },
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
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          All Services
        </Typography>
        <StyledTableContainer darkMode={darkMode} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Poppins', sans-serif" }}>Name</TableCell>
                <TableCell sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Poppins', sans-serif" }}>Category</TableCell>
                <TableCell sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Poppins', sans-serif" }}>Price</TableCell>
                <TableCell sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Poppins', sans-serif" }}>Description</TableCell>
                <TableCell sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Poppins', sans-serif" }}>Status</TableCell>
                <TableCell sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Poppins', sans-serif" }}>Images</TableCell>
                <TableCell sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontFamily: "'Poppins', sans-serif" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", textAlign: "center", fontFamily: "'Roboto', sans-serif" }}
                  >
                    No services available.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => {
                  const category = serviceCategories.find(
                    (cat) => cat.serviceCategoryId === service.serviceCategoryId
                  );
                  const effectiveStatus = category?.status === false ? false : service.status;

                  return (
                    <TableRow key={service.serviceId}>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                        {service.name}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                        {category?.name || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                        {formatPrice(service.price)}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                        {service.description ? "Yes" : "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                        {effectiveStatus ? "Active" : "Inactive"}
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
                                    color: darkMode ? "#1abc9c" : "#6c4f37",
                                    "&.Mui-checked": { color: darkMode ? "#1abc9c" : "#6c4f37" },
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
                                    color: darkMode ? "#e74c3c" : "#e74c3c",
                                    "&.Mui-checked": {
                                      color: darkMode ? "#e74c3c" : "#e74c3c",
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
                                color: darkMode ? "#e74c3c" : "#e74c3c",
                                borderColor: darkMode ? "#e74c3c" : "#e74c3c",
                                "&:hover": { borderColor: darkMode ? "#c0392b" : "#c0392b" },
                              }}
                            >
                              Delete Selected
                            </Button>
                          </Box>
                        ) : (
                          <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontFamily: "'Roboto', sans-serif" }}>
                            No images
                          </Typography>
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
                            color: darkMode ? "#1abc9c" : "#6c4f37",
                            borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                            fontWeight: 500,
                            textTransform: "none",
                            "&:hover": {
                              borderColor: darkMode ? "#16a085" : "#5a3f2f",
                              backgroundColor: darkMode
                                ? "rgba(26, 188, 156, 0.1)"
                                : "rgba(108, 79, 55, 0.1)",
                            },
                            "&.Mui-disabled": {
                              color: darkMode ? "#5a758c" : "#999",
                              borderColor: darkMode ? "#5a758c" : "#e0e0e0",
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
                            color: darkMode ? "#e74c3c" : "#e74c3c",
                            borderColor: darkMode ? "#e74c3c" : "#e74c3c",
                            fontWeight: 500,
                            textTransform: "none",
                            "&:hover": {
                              borderColor: darkMode ? "#c0392b" : "#c0392b",
                              backgroundColor: darkMode
                                ? "rgba(231, 76, 60, 0.1)"
                                : "rgba(231, 76, 60, 0.1)",
                            },
                            "&.Mui-disabled": {
                              color: darkMode ? "#5a758c" : "#999",
                              borderColor: darkMode ? "#5a758c" : "#e0e0e0",
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
                            color: darkMode ? "#2ecc71" : "#2ecc71",
                            borderColor: darkMode ? "#2ecc71" : "#2ecc71",
                            fontWeight: 500,
                            textTransform: "none",
                            "&:hover": {
                              borderColor: darkMode ? "#27ae60" : "#27ae60",
                              backgroundColor: darkMode
                                ? "rgba(46, 204, 113, 0.1)"
                                : "rgba(46, 204, 113, 0.1)",
                            },
                            "&.Mui-disabled": {
                              color: darkMode ? "#5a758c" : "#999",
                              borderColor: darkMode ? "#5a758c" : "#e0e0e0",
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </DashboardCard>
    </Box>
  );
};

export default ServiceDetailDashboard;