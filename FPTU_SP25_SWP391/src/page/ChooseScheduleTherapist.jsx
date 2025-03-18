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
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { 
  createTherapistSchedule, 
  getTherapistSchedules,
  deleteTherapistSchedule,
} from "../api/testApi";
import { useAuth } from "./AuthContext";

// Enhanced Styling
const ScheduleContainer = styled(Box)(({ darkMode }) => ({
  flexGrow: 1,
  padding: "50px 30px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)"
    : "linear-gradient(145deg, #f0f4f8 0%, #e0e8f0 100%)",
  fontFamily: "'Roboto', sans-serif",
}));

const FormWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "40px",
  borderRadius: "20px",
  background: darkMode
    ? "linear-gradient(180deg, #252525 0%, #1e1e1e 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
  boxShadow: darkMode
    ? "0 10px 40px rgba(0, 0, 0, 0.8)"
    : "0 10px 40px rgba(0, 0, 0, 0.05)",
  border: darkMode ? "1px solid #3a3a3a" : "1px solid #e0e0e0",
  maxWidth: "700px",
  margin: "0 auto",
  transition: "all 0.3s ease",
}));

const StyledButton = styled(Button)(({ darkMode }) => ({
  padding: "14px 28px",
  borderRadius: "12px",
  fontWeight: 600,
  fontSize: "16px",
  textTransform: "none",
  background: darkMode
    ? "linear-gradient(90deg, #1e88e5 0%, #1976d2 100%)"
    : "linear-gradient(90deg, #2196f3 0%, #1976d2 100%)",
  color: "#ffffff",
  "&:hover": {
    background: darkMode
      ? "linear-gradient(90deg, #42a5f5 0%, #1e88e5 100%)"
      : "linear-gradient(90deg, #42a5f5 0%, #2196f3 100%)",
    boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
  },
  transition: "all 0.3s ease",
}));

const ScheduleTableWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "40px",
  borderRadius: "20px",
  background: darkMode
    ? "linear-gradient(180deg, #252525 0%, #1e1e1e 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
  boxShadow: darkMode
    ? "0 10px 40px rgba(0, 0, 0, 0.8)"
    : "0 10px 40px rgba(0, 0, 0, 0.05)",
  border: darkMode ? "1px solid #3a3a3a" : "1px solid #e0e0e0",
  marginTop: "60px",
  maxWidth: "1200px",
  margin: "60px auto",
  maxHeight: "650px",
  overflowY: "auto",
  transition: "all 0.3s ease",
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
    fetchSchedules();
  }, [therapistId, authToken]);

  const fetchSchedules = async () => {
    if (!therapistId || !authToken) return;
    try {
      const response = await getTherapistSchedules(authToken);
      const fetchedSchedules = Array.isArray(response.data) ? response.data : [];
      setSchedules(fetchedSchedules.filter((schedule) => schedule.therapistId === Number(therapistId)));
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
    }
  };

  const handleDayChange = (event) => setSelectedDay(event.target.value);
  const handleStartTimeChange = (event) => setStartTime(event.target.value);
  const handleEndTimeChange = (event) => setEndTime(event.target.value);

  const handleSubmit = async () => {
    if (!selectedDay || !startTime || !endTime) {
      alert("Please complete all fields.");
      return;
    }

    if (!therapistId || !authToken) {
      alert("Authentication required. Please log in.");
      navigate("/sign_in");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    // Check for overlapping schedules on the same day
    const dayNumber = dayToNumber[selectedDay];
    const hasOverlap = schedules.some((schedule) => {
      if (schedule.dayOfWeek !== dayNumber) return false;
      const existingStart = schedule.startWorkingTime;
      const existingEnd = schedule.endWorkingTime;
      return (
        (startTime < existingEnd && endTime > existingStart) // Overlap condition
      );
    });

    if (hasOverlap) {
      alert("A schedule already exists for this day and time range.");
      return;
    }

    const scheduleData = {
      therapistId: Number(therapistId),
      dayOfWeek: dayNumber,
      StartTime: startTime,
      EndTime: endTime,
    };

    try {
      const response = await createTherapistSchedule(scheduleData, authToken);
      alert(`Schedule added for ${selectedDay} from ${startTime.slice(0, 5)} to ${endTime.slice(0, 5)}!`);
      setSchedules([...schedules, response.data]);
      setSelectedDay("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      alert("Failed to add schedule. Please try again.");
      console.error("Schedule creation error:", error);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await deleteTherapistSchedule(scheduleId, authToken);
      setSchedules(schedules.filter((schedule) => schedule.scheduleId !== scheduleId));
      alert("Schedule deleted successfully!");
    } catch (error) {
      alert("Failed to delete schedule. Please try again.");
      console.error("Delete error:", error);
    }
  };

  const handleBack = () => {
    navigate("/skintherapist/home", { state: { resetToHome: true } });
  };

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
          color: darkMode ? "#e0e0e0" : "#1a1a1a",
          fontWeight: 700,
          mb: 6,
          textAlign: "center",
          letterSpacing: "0.8px",
          fontFamily: "'Roboto', sans-serif",
        }}
        component={motion.div}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Therapist Schedule Manager
      </Typography>

      <FormWrapper
        darkMode={darkMode}
        elevation={6}
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel sx={{ color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 500 }}>Day of Week</InputLabel>
          <Select
            value={selectedDay}
            onChange={handleDayChange}
            sx={{
              color: darkMode ? "#e0e0e0" : "#1a1a1a",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#4b5e6d" : "#c0c7ce" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#90a4ae" : "#90a4ae" },
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderRadius: "12px",
              fontSize: "16px",
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

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel sx={{ color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 500 }}>Start Time</InputLabel>
          <Select
            value={startTime}
            onChange={handleStartTimeChange}
            sx={{
              color: darkMode ? "#e0e0e0" : "#1a1a1a",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#4b5e6d" : "#c0c7ce" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#90a4ae" : "#90a4ae" },
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderRadius: "12px",
              fontSize: "16px",
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

        <FormControl fullWidth sx={{ mb: 5 }}>
          <InputLabel sx={{ color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 500 }}>End Time</InputLabel>
          <Select
            value={endTime}
            onChange={handleEndTimeChange}
            sx={{
              color: darkMode ? "#e0e0e0" : "#1a1a1a",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#4b5e6d" : "#c0c7ce" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#90a4ae" : "#90a4ae" },
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderRadius: "12px",
              fontSize: "16px",
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

        <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            darkMode={darkMode}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Schedule
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={handleBack}
            darkMode={darkMode}
            sx={{
              background: "transparent",
              borderColor: darkMode ? "#1e88e5" : "#1976d2",
              color: darkMode ? "#1e88e5" : "#1976d2",
              "&:hover": {
                borderColor: darkMode ? "#42a5f5" : "#2196f3",
                background: darkMode ? "rgba(30, 136, 229, 0.1)" : "rgba(25, 118, 210, 0.1)",
              },
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Dashboard
          </StyledButton>
        </Box>
      </FormWrapper>

      <ScheduleTableWrapper
        darkMode={darkMode}
        elevation={6}
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ color: darkMode ? "#e0e0e0" : "#1a1a1a", fontWeight: 600 }}
          >
            Current Schedules
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: darkMode ? "#90a4ae" : "#607d8b", fontWeight: 500 }}
          >
            {schedules.length} Schedules
          </Typography>
        </Box>
        <TableContainer sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: darkMode ? "#2d2d2d" : "#f4f6f8", color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 600, fontSize: "16px" }}>Time</TableCell>
                {days.map((day) => (
                  <TableCell key={day} align="center" sx={{ backgroundColor: darkMode ? "#2d2d2d" : "#f4f6f8", color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 600, fontSize: "16px" }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleGrid.map((row, index) => (
                <TableRow key={index} sx={{ "&:hover": { backgroundColor: darkMode ? "#333" : "#f9f9f9" } }}>
                  <TableCell sx={{ color: darkMode ? "#e0e0e0" : "#1a1a1a", fontWeight: 500, fontSize: "15px" }}>{row.time}</TableCell>
                  {days.map((day) => (
                    <TableCell key={day} align="center" sx={{ color: row[day] ? "#4caf50" : darkMode ? "#e0e0e0" : "#1a1a1a", fontSize: "15px" }}>
                      {row[day]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {schedules.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h5"
              sx={{ color: darkMode ? "#e0e0e0" : "#1a1a1a", mb: 3, fontWeight: 600 }}
            >
              Schedule Details
            </Typography>
            <TableContainer sx={{ borderRadius: "12px", overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: darkMode ? "#2d2d2d" : "#f4f6f8", color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 600, fontSize: "16px" }}>Day</TableCell>
                    <TableCell sx={{ backgroundColor: darkMode ? "#2d2d2d" : "#f4f6f8", color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 600, fontSize: "16px" }}>Start</TableCell>
                    <TableCell sx={{ backgroundColor: darkMode ? "#2d2d2d" : "#f4f6f8", color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 600, fontSize: "16px" }}>End</TableCell>
                    <TableCell sx={{ backgroundColor: darkMode ? "#2d2d2d" : "#f4f6f8", color: darkMode ? "#b0bec5" : "#4b5e6d", fontWeight: 600, fontSize: "16px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.scheduleId} sx={{ "&:hover": { backgroundColor: darkMode ? "#333" : "#f9f9f9" } }}>
                      <TableCell sx={{ color: darkMode ? "#e0e0e0" : "#1a1a1a", fontSize: "15px" }}>
                        {days[schedule.dayOfWeek]}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#e0e0e0" : "#1a1a1a", fontSize: "15px" }}>
                        {(schedule.startWorkingTime || "").slice(0, 5)}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#e0e0e0" : "#1a1a1a", fontSize: "15px" }}>
                        {(schedule.endWorkingTime || "").slice(0, 5)}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete Schedule">
                          <IconButton
                            onClick={() => handleDelete(schedule.scheduleId)}
                            sx={{ color: darkMode ? "#ef5350" : "#d32f2f" }}
                            component={motion.div}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </ScheduleTableWrapper>
    </ScheduleContainer>
  );
};

export default ChooseScheduleTherapist;