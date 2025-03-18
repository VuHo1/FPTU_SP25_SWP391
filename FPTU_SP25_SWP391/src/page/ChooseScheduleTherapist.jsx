import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { createTherapistSchedule, getTherapistSchedules } from "../api/testApi";
import { useAuth } from "./AuthContext";

const ScheduleContainer = styled(Box)(({ darkMode }) => ({
  flexGrow: 1,
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #1c2526 0%, #2d3839 100%)"
    : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
  transition: "all 0.3s ease",
}));

const FormWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "30px",
  borderRadius: "12px",
  background: darkMode
    ? "linear-gradient(180deg, #2d3839 0%, #1c2526 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
  boxShadow: darkMode
    ? "0 4px 20px rgba(0, 0, 0, 0.5)"
    : "0 4px 20px rgba(0, 0, 0, 0.05)",
  border: darkMode ? "1px solid #3d4a4b" : "1px solid #e0e0e0",
  maxWidth: "600px",
  margin: "0 auto",
}));

const StyledButton = styled(Button)(({ darkMode }) => ({
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: 600,
  textTransform: "none",
  background: darkMode
    ? "linear-gradient(90deg, #3d4a4b 0%, #2d3839 100%)"
    : "linear-gradient(90deg, #e0e0e0 0%, #d0d0d0 100%)",
  color: darkMode ? "#ffffff" : "#1d1d1f",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: darkMode
      ? "linear-gradient(90deg, #4a5758 0%, #3d4a4b 100%)"
      : "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%)",
    transform: "translateX(5px)",
  },
}));

const ScheduleTableWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "25px",
  borderRadius: "12px",
  background: darkMode
    ? "linear-gradient(180deg, #2d3839 0%, #1c2526 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
  boxShadow: darkMode
    ? "0 4px 20px rgba(0, 0, 0, 0.5)"
    : "0 4px 20px rgba(0, 0, 0, 0.05)",
  border: darkMode ? "1px solid #3d4a4b" : "1px solid #e0e0e0",
  marginTop: "40px",
  maxWidth: "1000px",
  margin: "40px auto",
  maxHeight: "500px",
  overflowY: "auto",
}));

const ChooseScheduleTherapist = ({ darkMode }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token } = useAuth();

  const therapistId = userId || location.state?.therapistId || localStorage.getItem("userId");
  const authToken = token || location.state?.token || localStorage.getItem("token");

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayToNumber = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return `${hour}:00:00`;
  });

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const start = i < 10 ? `0${i}:00` : `${i}:00`;
    const end = i + 1 < 10 ? `0${i + 1}:00` : `${i + 1}:00`;
    return { start, end };
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!therapistId || !authToken) return;
      try {
        const response = await getTherapistSchedules(authToken);
        const fetchedSchedules = Array.isArray(response.data) ? response.data : [];
        setSchedules(fetchedSchedules.filter((schedule) => schedule.therapistId === Number(therapistId)));
      } catch (error) {
        console.error("Error fetching schedules:", error.response?.data || error);
        setSchedules([]);
      }
    };
    fetchSchedules();
  }, [therapistId, authToken]);

  const handleDayChange = (event) => setSelectedDay(event.target.value);
  const handleStartTimeChange = (event) => setStartTime(event.target.value);
  const handleEndTimeChange = (event) => setEndTime(event.target.value);

  const handleSubmit = async () => {
    if (!selectedDay || !startTime || !endTime) {
      alert("Please select a day, start time, and end time.");
      return;
    }

    if (!therapistId || !authToken) {
      alert("Therapist ID or authentication token is missing. Please log in again.");
      navigate("/sign_in");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const scheduleData = {
      therapistId: Number(therapistId),
      dayOfWeek: dayToNumber[selectedDay],
      startTime: startTime,
      endTime: endTime,
    };

    console.log("Submitting schedule data:", JSON.stringify(scheduleData, null, 2));

    try {
      const response = await createTherapistSchedule(scheduleData, authToken);
      console.log("Schedule created successfully:", response.data);
      alert(`Schedule set for ${selectedDay} from ${startTime.slice(0, 5)} to ${endTime.slice(0, 5)} successfully!`);
      setSchedules([...schedules, response.data]);
      setSelectedDay("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      alert("Failed to set schedule. Please check your inputs and try again.");
      console.error("Schedule creation error:", error.response?.data || error);
    }
  };

  const handleBack = () => {
    navigate("/skintherapist/home", { state: { resetToHome: true } });
  };

  // Prepare schedule data for the table
  const scheduleGrid = timeSlots.map((slot) => {
    const row = { time: `${slot.start}-${slot.end}` };
    days.forEach((day, index) => {
      const daySchedules = schedules.filter((s) => s.dayOfWeek === dayToNumber[day]);
      const isScheduled = daySchedules.some(
        (s) =>
          (s.startWorkingTime || "00:00:00").slice(0, 5) <= slot.start &&
          (s.endWorkingTime || "00:00:00").slice(0, 5) > slot.start
      );
      row[day] = isScheduled ? "✓" : "";
    });
    return row;
  });

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
          textAlign: "center",
        }}
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Manage Your Schedule
      </Typography>

      <FormWrapper
        darkMode={darkMode}
        elevation={4}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>Select Day</InputLabel>
          <Select
            value={selectedDay}
            onChange={handleDayChange}
            sx={{
              color: darkMode ? "#ffffff" : "#1d1d1f",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#3d4a4b" : "#e0e0e0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#4a5758" : "#d0d0d0" },
              background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderRadius: "8px",
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

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>Start Time</InputLabel>
          <Select
            value={startTime}
            onChange={handleStartTimeChange}
            sx={{
              color: darkMode ? "#ffffff" : "#1d1d1f",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#3d4a4b" : "#e0e0e0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#4a5758" : "#d0d0d0" },
              background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderRadius: "8px",
            }}
          >
            <MenuItem value="">Select start time</MenuItem>
            {timeOptions.map((time) => (
              <MenuItem key={time} value={time}>
                {time.slice(0, 5)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>End Time</InputLabel>
          <Select
            value={endTime}
            onChange={handleEndTimeChange}
            sx={{
              color: darkMode ? "#ffffff" : "#1d1d1f",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#3d4a4b" : "#e0e0e0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#4a5758" : "#d0d0d0" },
              background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderRadius: "8px",
            }}
          >
            <MenuItem value="">Select end time</MenuItem>
            {timeOptions.map((time) => (
              <MenuItem key={time} value={time}>
                {time.slice(0, 5)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            darkMode={darkMode}
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Schedule
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={handleBack}
            darkMode={darkMode}
            sx={{
              background: "transparent",
              borderColor: darkMode ? "#3d4a4b" : "#e0e0e0",
              color: darkMode ? "#a1a1a6" : "#6e6e73",
              "&:hover": {
                borderColor: darkMode ? "#4a5758" : "#d0d0d0",
                background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
              },
            }}
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Dashboard
          </StyledButton>
        </Box>
      </FormWrapper>

      <ScheduleTableWrapper
        darkMode={darkMode}
        elevation={4}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h6"
          sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", mb: 2, fontWeight: 600 }}
        >
          Current Schedules
        </Typography>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: darkMode ? "#2d3839" : "#f5f5f5", color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>Time</TableCell>
                {days.map((day) => (
                  <TableCell key={day} align="center" sx={{ backgroundColor: darkMode ? "#2d3839" : "#f5f5f5", color: darkMode ? "#a1a1a6" : "#6e6e73", fontWeight: 600 }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleGrid.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", fontWeight: 500 }}>{row.time}</TableCell>
                  {days.map((day) => (
                    <TableCell key={day} align="center" sx={{ color: row[day] ? (darkMode ? "#4caf50" : "#1976d2") : darkMode ? "#ffffff" : "#1d1d1f" }}>
                      {row[day]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ScheduleTableWrapper>
    </ScheduleContainer>
  );
};

export default ChooseScheduleTherapist;