import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ScheduleContainer = styled(Box)(({ darkMode }) => ({
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #1c2526 0%, #2d3839 100%)"
    : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
  transition: "all 0.3s ease",
}));

const ChooseScheduleTherapist = ({ darkMode }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const navigate = useNavigate();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedDay) {
      alert(`Schedule set for ${selectedDay}`);
      // Add logic here to save the schedule (e.g., API call)
    } else {
      alert("Please select a day.");
    }
  };

  const handleBack = () => {
    // Navigate back to /skintherapist/home with a reset flag
    navigate("/skintherapist/home", { state: { resetToHome: true } });
  };

  return (
    <ScheduleContainer
      darkMode={darkMode}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography
        variant="h4"
        sx={{
          color: darkMode ? "#ffffff" : "#1d1d1f",
          fontWeight: 700,
          mb: 4,
        }}
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Choose Your Schedule
      </Typography>

      <Box sx={{ maxWidth: 400 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
            Select Day
          </InputLabel>
          <Select
            value={selectedDay}
            onChange={handleDayChange}
            sx={{
              color: darkMode ? "#ffffff" : "#1d1d1f",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#3d4a4b" : "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#ffffff" : "#1d1d1f",
              },
            }}
          >
            <MenuItem value="">Select a day</MenuItem>
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
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
          Set Schedule
        </Button>

        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{
            ml: 2,
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            color: darkMode ? "#ffffff" : "#6e6e73",
            borderColor: darkMode ? "#3d4a4b" : "#6e6e73",
            "&:hover": { borderColor: darkMode ? "#ffffff" : "#555" },
          }}
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </ScheduleContainer>
  );
};

export default ChooseScheduleTherapist;