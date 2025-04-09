import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTrash } from "@fortawesome/free-solid-svg-icons";

const QaContainer = styled(Box)(({ darkMode }) => ({
  padding: "30px",
  background: darkMode ? "linear-gradient(135deg, #34495e 0%, #2c3e50 100%)" : "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
  borderRadius: "16px",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
  boxShadow: darkMode
    ? "0 12px 36px rgba(0, 0, 0, 0.5)"
    : "0 12px 36px rgba(0, 0, 0, 0.1)",
  maxWidth: "1000px",
  margin: "40px auto",
}));

const StyledCard = styled(Card)(({ darkMode }) => ({
  background: darkMode ? "rgba(69, 90, 100, 0.9)" : "rgba(255, 255, 255, 0.95)",
  borderRadius: "12px",
  boxShadow: darkMode
    ? "0 6px 18px rgba(0, 0, 0, 0.3)"
    : "0 6px 18px rgba(0, 0, 0, 0.05)",
  padding: "20px",
  marginBottom: "30px",
}));

const StyledButton = styled(Button)(({ darkMode }) => ({
  background: darkMode
    ? "linear-gradient(45deg, #1abc9c 30%, #16a085 90%)"
    : "linear-gradient(45deg, #6c4f37 30%, #5a4030 90%)",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "8px",
  "&:hover": {
    background: darkMode
      ? "linear-gradient(45deg, #16a085 30%, #1abc9c 90%)"
      : "linear-gradient(45deg, #5a4030 30%, #6c4f37 90%)",
  },
}));

const QaStaff = ({ darkMode }) => {
  const [qaFormData, setQaFormData] = useState({
    serviceCategoryId: "",
    question: "",
    type: "string",
    status: true,
    options: [{ answerText: "", serviceIds: [] }],
  });
  const [qaFormErrors, setQaFormErrors] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState(null);
  const [qaSuccess, setQaSuccess] = useState(null);
  const [qaList, setQaList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: "https://kinaa1410-001-site1.qtempurl.com/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await axiosInstance.get("/ServiceCategory");
        setCategories(response.data.filter((cat) => cat.status && cat.exist));
      } catch (err) {
        setQaError("Unable to load service catalog.");
        console.error(err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const response = await axiosInstance.get("/Service");
        setServices(response.data.filter((svc) => svc.status && svc.exist));
      } catch (err) {
        setQaError("Unable to load service catalog.");
        console.error(err);
      } finally {
        setServicesLoading(false);
      }
    };

    if (token) {
      fetchCategories();
      fetchServices();
    } else {
      setQaError("Please login to continue.");
    }
  }, [token]);

  const fetchQaList = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await axiosInstance.get(`/Qa/servicecategory/${categoryId}`);
      setQaList(response.data);
    } catch (err) {
      setQaError("Unable to load question list for this category.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (token && selectedCategoryId) {
      fetchQaList(selectedCategoryId);
    }
  }, [selectedCategoryId, token]);

  const handleQaChange = (e) => {
    const { name, value } = e.target;
    setQaFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setQaFormData((prev) => {
      const newOptions = [...prev.options];
      if (field === "serviceIds") {
        newOptions[index][field] = value.map((id) => parseInt(id));
      } else {
        newOptions[index][field] = value;
      }
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setQaFormData((prev) => ({
      ...prev,
      options: [...prev.options, { answerText: "", serviceIds: [] }],
    }));
  };

  const removeOption = (index) => {
    setQaFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteQuestion = async (qaId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/Qa/${qaId}`);
      setQaList((prev) => prev.filter((qa) => qa.qaId !== qaId));
      setQaSuccess("Question deleted successfully!");
    } catch (err) {
      setQaError("Failed to delete question.");
      console.error(err);
    }
  };

  const validateQaForm = () => {
    const errors = {};

    if (!qaFormData.serviceCategoryId || isNaN(parseInt(qaFormData.serviceCategoryId))) {
      errors.serviceCategoryId = "Please select a valid service category.";
    }

    if (!qaFormData.question.trim()) {
      errors.question = "Question is required.";
    } else if (qaFormData.question.length < 5) {
      errors.question = "Question must be at least 5 characters long.";
    } else if (!qaFormData.question.endsWith("?")) {
      errors.question = "Question must end with a question mark (?}";
    }

    if (qaFormData.options.length === 0) {
      errors.options = "At least one answer option is required.";
    } else {
      qaFormData.options.forEach((option, index) => {
        if (!option.answerText.trim()) {
          errors[`option_${index}_answerText`] = `Answer option ${index + 1} is required.`;
        } else if (option.answerText.length < 5) {
          errors[`option_${index}_answerText`] = `Answer option ${index + 1} must be at least 5 characters long.`;
        }

        if (option.serviceIds.length === 0) {
          errors[`option_${index}_serviceIds`] = `Please select at least one service for option ${index + 1}.`;
        }
      });
    }

    setQaFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleQaSubmit = async (e) => {
    e.preventDefault();
    setQaLoading(true);
    setQaError(null);
    setQaSuccess(null);

    if (!token) {
      setQaError("Please login to create a question.");
      setQaLoading(false);
      return;
    }

    if (!validateQaForm()) {
      setQaError("Please fix the errors in the form.");
      setQaLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/Qa", {
        serviceCategoryId: parseInt(qaFormData.serviceCategoryId),
        question: qaFormData.question,
        type: qaFormData.type,
        status: qaFormData.status,
        options: qaFormData.options,
      });
      setQaSuccess("Question created successfully!");
      setQaFormData({
        serviceCategoryId: "",
        question: "",
        type: "string",
        status: true,
        options: [{ answerText: "", serviceIds: [] }],
      });
      if (selectedCategoryId === response.data.serviceCategoryId) {
        setQaList((prev) => [...prev, response.data]);
      }
    } catch (err) {
      setQaError("An error occurred while creating the question.");
      console.error(err);
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <QaContainer
      darkMode={darkMode}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <StyledCard darkMode={darkMode}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              color: darkMode ? "#1abc9c" : "#6c4f37",
              fontWeight: 700,
              mb: 3,
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <FontAwesomeIcon icon={faComments} /> Create New Question
          </Typography>

          <form onSubmit={handleQaSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                Service Category
              </InputLabel>
              <Select
                name="serviceCategoryId"
                value={qaFormData.serviceCategoryId}
                onChange={handleQaChange}
                sx={{
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
                  borderRadius: "8px",
                }}
                disabled={categoriesLoading || categories.length === 0}
              >
                {categoriesLoading ? (
                  <MenuItem value="">
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : categories.length === 0 ? (
                  <MenuItem value="">No categories yet</MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem
                      key={category.serviceCategoryId}
                      value={category.serviceCategoryId}
                    >
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {qaFormErrors.serviceCategoryId && (
                <Typography sx={{ color: "#e74c3c", mt: 1, fontSize: "0.85rem" }}>
                  {qaFormErrors.serviceCategoryId}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Question"
              name="question"
              value={qaFormData.question}
              onChange={handleQaChange}
              fullWidth
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
                },
              }}
              InputLabelProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
              InputProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
              error={!!qaFormErrors.question}
              helperText={qaFormErrors.question}
            />

            {qaFormData.options.map((option, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: darkMode ? "1px solid #5a758c" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                }}
              >
                <TextField
                  label={`Answer Option ${index + 1}`}
                  value={option.answerText}
                  onChange={(e) =>
                    handleOptionChange(index, "answerText", e.target.value)
                  }
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
                    },
                  }}
                  InputLabelProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
                  InputProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
                  error={!!qaFormErrors[`option_${index}_answerText`]}
                  helperText={qaFormErrors[`option_${index}_answerText`]}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                    Linked Services
                  </InputLabel>
                  <Select
                    multiple
                    value={option.serviceIds}
                    onChange={(e) =>
                      handleOptionChange(index, "serviceIds", e.target.value)
                    }
                    disabled={servicesLoading || services.length === 0}
                    sx={{
                      color: darkMode ? "#ecf0f1" : "#2c3e50",
                      background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
                      borderRadius: "8px",
                    }}
                  >
                    {servicesLoading ? (
                      <MenuItem value="">
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : services.length === 0 ? (
                      <MenuItem value="">No services available</MenuItem>
                    ) : (
                      services.map((service) => (
                        <MenuItem key={service.serviceId} value={service.serviceId}>
                          {service.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {qaFormErrors[`option_${index}_serviceIds`] && (
                    <Typography sx={{ color: "#e74c3c", mt: 1, fontSize: "0.85rem" }}>
                      {qaFormErrors[`option_${index}_serviceIds`]}
                    </Typography>
                  )}
                </FormControl>
                {index > 0 && (
                  <Button
                    onClick={() => removeOption(index)}
                    color="error"
                    sx={{ mt: 2, fontSize: "0.85rem" }}
                  >
                    Remove Option
                  </Button>
                )}
              </Box>
            ))}

            <Button
              onClick={addOption}
              variant="outlined"
              sx={{
                mb: 3,
                color: darkMode ? "#1abc9c" : "#6c4f37",
                borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                borderRadius: "8px",
                margin: "20px",
                "&:hover": {
                  borderColor: darkMode ? "#16a085" : "#5a4030",
                  background: darkMode ? "rgba(26, 188, 156, 0.1)" : "rgba(108, 79, 55, 0.1)",
                },
              }}
            >
              Add Another Option
            </Button>

            <StyledButton
              type="submit"
              variant="contained"
              disabled={qaLoading || categoriesLoading}
              darkMode={darkMode}
            >
              {qaLoading ? <CircularProgress size={24} /> : "Create Question"}
            </StyledButton>

            {qaSuccess && (
              <Typography sx={{ color: darkMode ? "#1abc9c" : "#27ae60", mt: 2, fontWeight: 500 }}>
                {qaSuccess}
              </Typography>
            )}
            {qaError && (
              <Typography sx={{ color: darkMode ? "#e74c3c" : "#c0392b", mt: 2, fontWeight: 500 }}>
                {qaError}
              </Typography>
            )}
          </form>
        </CardContent>
      </StyledCard>

      <StyledCard darkMode={darkMode}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              color: darkMode ? "#1abc9c" : "#6c4f37",
              fontWeight: 700,
              mb: 3,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            List of Questions
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
              Select Category to View Questions
            </InputLabel>
            <Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              sx={{
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
                borderRadius: "8px",
              }}
              disabled={categoriesLoading || categories.length === 0}
            >
              {categoriesLoading ? (
                <MenuItem value="">
                  <CircularProgress size={20} />
                </MenuItem>
              ) : categories.length === 0 ? (
                <MenuItem value="">No categories yet</MenuItem>
              ) : (
                [
                  <MenuItem key="none" value="">
                    -- Select a category --
                  </MenuItem>,
                  ...categories.map((category) => (
                    <MenuItem
                      key={category.serviceCategoryId}
                      value={category.serviceCategoryId}
                    >
                      {category.name}
                    </MenuItem>
                  )),
                ]
              )}
            </Select>
          </FormControl>

          <TableContainer
            component={Paper}
            sx={{
              background: darkMode ? "rgba(44, 62, 80, 0.95)" : "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600 }}>Question</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600 }}>Options</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qaList.length === 0 && selectedCategoryId ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", textAlign: "center", py: 4 }}
                    >
                      No questions found for this category.
                    </TableCell>
                  </TableRow>
                ) : (
                  qaList.map((qa) => (
                    <TableRow
                      key={qa.qaId}
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        "&:hover": {
                          background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>{qa.qaId}</TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>{qa.question}</TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                        {categories.find((cat) => cat.serviceCategoryId === qa.serviceCategoryId)?.name || qa.serviceCategoryId}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                        {qa.options.map((opt) => (
                          <div key={opt.qaOptionId}>
                            <strong>{opt.answerText}</strong>:{" "}
                            {opt.serviceIds.map((id) => services.find((svc) => svc.serviceId === id)?.name || id).join(", ")}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDeleteQuestion(qa.qaId)}
                          color="error"
                          size="small"
                          sx={{ minWidth: "40px" }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>
    </QaContainer>
  );
};

export default QaStaff;