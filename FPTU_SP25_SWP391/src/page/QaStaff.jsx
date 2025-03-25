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
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faList } from "@fortawesome/free-solid-svg-icons";

// Container Styling
const QaContainer = styled(Box)(({ darkMode }) => ({
  display: "flex",
  gap: "20px",
  padding: "20px",
  background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
  borderRadius: "8px",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
  boxShadow: darkMode
    ? "0 8px 24px rgba(0, 0, 0, 0.4)"
    : "0 8px 24px rgba(0, 0, 0, 0.15)",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
  maxWidth: "1200px",
  margin: "0 auto",
}));

const Panel = styled(Box)(({ darkMode }) => ({
  flex: 1,
  padding: "15px",
  background: darkMode ? "rgba(69, 90, 100, 0.8)" : "rgba(248, 244, 225, 0.8)",
  borderRadius: "8px",
}));

const QaStaff = ({ darkMode }) => {
  const [qaFormData, setQaFormData] = useState({
    serviceCategoryId: "",
    question: "",
    type: "Yes/No",
    status: true,
  });
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState(null);
  const [qaSuccess, setQaSuccess] = useState(null);
  const [qaList, setQaList] = useState([]);
  const [recFormData, setRecFormData] = useState({
    qaId: "",
    answerOption: "",
    serviceId: "",
    weight: "",
  });
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);
  const [recSuccess, setRecSuccess] = useState(null);
  const [recList, setRecList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: "https://kinaa1410-001-site1.qtempurl.com/api",
    headers: {
      "Authorization": `Bearer ${token}`,
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
        setRecError("Unable to load service catalog.");
        console.error(err);
      } finally {
        setServicesLoading(false);
      }
    };

    const fetchQaList = async () => {
      try {
        const response = await axiosInstance.get("/Qa");
        setQaList(response.data);
      } catch (err) {
        setQaError("Unable to load question list.");
        console.error(err);
      }
    };

    const fetchRecList = async () => {
      try {
        const response = await axiosInstance.get("/service-recommendations");
        setRecList(response.data);
      } catch (err) {
        setRecError("Could not load suggested rules list.");
        console.error(err);
      }
    };

    if (token) {
      fetchCategories();
      fetchServices();
      fetchQaList();
      fetchRecList();
    } else {
      setQaError("Please login to continue.");
    }
  }, [token]);

  const handleQaChange = (e) => {
    const { name, value } = e.target;
    setQaFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRecChange = (e) => {
    const { name, value } = e.target;
    setRecFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    try {
      const response = await axiosInstance.post("/Qa", {
        serviceCategoryId: parseInt(qaFormData.serviceCategoryId),
        question: qaFormData.question,
        type: qaFormData.type,
        status: qaFormData.status,
      });
      setQaSuccess("Question created successfully!");
      setQaFormData({
        serviceCategoryId: "",
        question: "",
        type: "Yes/No",
        status: true,
      });
      setQaList((prev) => [...prev, response.data]);
    } catch (err) {
      setQaError("An error occurred while creating the question. Please try again.");
      console.error(err);
    } finally {
      setQaLoading(false);
    }
  };

  const handleRecSubmit = async (e) => {
    e.preventDefault();
    setRecLoading(true);
    setRecError(null);
    setRecSuccess(null);

    if (!token) {
      setRecError("Please login to create a recommendation rule.");
      setRecLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/service-recommendations", {
        qaId: parseInt(recFormData.qaId),
        answerOption: recFormData.answerOption,
        serviceId: parseInt(recFormData.serviceId),
        weight: parseInt(recFormData.weight),
      });
      setRecSuccess("The proposed rule has been created successfully!");
      setRecFormData({
        qaId: "",
        answerOption: "",
        serviceId: "",
        weight: "",
      });
      setRecList((prev) => [...prev, response.data]);
    } catch (err) {
      setRecError("An error occurred while creating the recommendation rule. Please try again.");
      console.error(err);
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <QaContainer
      darkMode={darkMode}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >

      <Panel darkMode={darkMode}>
        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            fontWeight: 600,
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FontAwesomeIcon icon={faComments} /> Create Questions for Customers
        </Typography>

        <form onSubmit={handleQaSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
              Service Category
            </InputLabel>
            <Select
              name="serviceCategoryId"
              value={qaFormData.serviceCategoryId}
              onChange={handleQaChange}
              required
              disabled={categoriesLoading || categories.length === 0}
              sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
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
          </FormControl>

          <TextField
            label="Question"
            name="question"
            value={qaFormData.question}
            onChange={handleQaChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
            InputProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={qaLoading || categoriesLoading}
            sx={{
              backgroundColor: darkMode ? "#1abc9c" : "#6c4f37",
              "&:hover": { backgroundColor: darkMode ? "#16a085" : "#5a4030" },
            }}
          >
            {qaLoading ? <CircularProgress size={24} color="inherit" /> : "Create Question"}
          </Button>

          {qaSuccess && (
            <Typography sx={{ color: darkMode ? "#1abc9c" : "#27ae60", mt: 2 }}>
              {qaSuccess}
            </Typography>
          )}
          {qaError && (
            <Typography sx={{ color: darkMode ? "#e74c3c" : "#c0392b", mt: 2 }}>
              {qaError}
            </Typography>
          )}

        </form>

        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            mt: 4,
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          List of Questions
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: darkMode ? "#2c3e50" : "#ffffff" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>ID</TableCell>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>Question</TableCell>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>Service Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qaList.map((qa) => (
                <TableRow key={qa.qaId}>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>{qa.qaId}</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>{qa.question}</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                    {categories.find((cat) => cat.serviceCategoryId === qa.serviceCategoryId)?.name || qa.serviceCategoryId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Panel>

      <Panel darkMode={darkMode}>
        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            fontWeight: 600,
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FontAwesomeIcon icon={faList} /> Set Up Proposal Rules
        </Typography>

        <form onSubmit={handleRecSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
              Question
            </InputLabel>
            <Select
              name="qaId"
              value={recFormData.qaId}
              onChange={handleRecChange}
              required
              disabled={qaList.length === 0}
              sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
            >
              {qaList.length === 0 ? (
                <MenuItem value="">No questions</MenuItem>
              ) : (
                qaList.map((qa) => (
                  <MenuItem key={qa.qaId} value={qa.qaId}>
                    {qa.question} (ID: {qa.qaId})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
              Answer
            </InputLabel>
            <Select
              name="answerOption"
              value={recFormData.answerOption}
              onChange={handleRecChange}
              required
              sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
              Recommended Services
            </InputLabel>
            <Select
              name="serviceId"
              value={recFormData.serviceId}
              onChange={handleRecChange}
              required
              disabled={servicesLoading || services.length === 0}
              sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
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
                    {service.name} (ID: {service.serviceId})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Weight"
            name="weight"
            value={recFormData.weight}
            onChange={handleRecChange}
            type="number"
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
            InputProps={{ style: { color: darkMode ? "#ecf0f1" : "#2c3e50" } }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={recLoading || servicesLoading}
            sx={{
              backgroundColor: darkMode ? "#1abc9c" : "#6c4f37",
              "&:hover": { backgroundColor: darkMode ? "#16a085" : "#5a4030" },
            }}
          >
            {recLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Suggested Rules"
            )}
          </Button>

          {recSuccess && (
            <Typography sx={{ color: darkMode ? "#1abc9c" : "#27ae60", mt: 2 }}>
              {recSuccess}
            </Typography>
          )}
          {recError && (
            <Typography sx={{ color: darkMode ? "#e74c3c" : "#c0392b", mt: 2 }}>
              {recError}
            </Typography>
          )}
        </form>

        {/* Danh sách quy tắc đề xuất */}
        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#ecf0f1" : "#2c3e50",
            mt: 4,
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          List of Proposed Rules
        </Typography>
        <TableContainer component={Paper} sx={{
          backgroundColor: darkMode ? "#2c3e50" : "#ffffff"
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>ID</TableCell>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>Question</TableCell>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>Answer</TableCell>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>Service</TableCell>
                <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recList.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>{rec.id}</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                    {qaList.find((qa) => qa.qaId === rec.qaId)?.question || rec.qaId} ({qaList.find((qa) => qa.qaId === rec.qaId)?.id || rec.qaId})
                  </TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>{rec.answerOption}</TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                    {services.find((svc) => svc.serviceId === rec.serviceId)?.name || rec.serviceId}
                  </TableCell>
                  <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>{rec.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Panel>
    </QaContainer >
  );
};

export default QaStaff;