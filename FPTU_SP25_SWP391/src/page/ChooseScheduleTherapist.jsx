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
  getAllTimeSlots,
} from "../api/testApi";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

// Enhanced Professional Styling
const ScheduleContainer = styled(Box)(({ darkMode }) => ({
  flexGrow: 1,
  padding: "60px 40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #1c2526 0%, #34495e 100%)"
    : "linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%)",
  fontFamily: "'Roboto', sans-serif",
  overflowY: "auto",
}));

const FormWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "32px",
  borderRadius: "16px",
  background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
  boxShadow: darkMode
    ? "0 8px 24px rgba(0, 0, 0, 0.4)"
    : "0 8px 24px rgba(0, 0, 0, 0.15)",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
  maxWidth: "720px",
  margin: "0 auto 64px",
  transition: "all 0.3s ease-in-out",
}));

const StyledButton = styled(Button)(({ darkMode }) => ({
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "15px",
  fontFamily: "'Poppins', sans-serif",
  textTransform: "none",
  background: darkMode ? "#1abc9c" : "#6c4f37",
  color: "#fff",
  "&:hover": {
    background: darkMode ? "#16a085" : "#503a28",
    boxShadow: darkMode
      ? "0 4px 12px rgba(26, 188, 156, 0.3)"
      : "0 4px 12px rgba(108, 79, 55, 0.3)",
  },
  transition: "all 0.3s ease-in-out",
}));

const ScheduleTableWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "32px",
  borderRadius: "16px",
  background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
  boxShadow: darkMode
    ? "0 8px 24px rgba(0, 0, 0, 0.4)"
    : "0 8px 24px rgba(0, 0, 0, 0.15)",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
  maxWidth: "1280px",
  margin: "0 auto",
  transition: "all 0.3s ease-in-out",
}));

const ScheduleGrid = styled(Box)(({ darkMode }) => ({
  display: "grid",
  gridTemplateColumns: "120px repeat(7, 1fr)",
  gap: "8px",
  padding: "16px",
  borderRadius: "12px",
  background: darkMode ? "#34495e" : "#f8f4e1",
  boxShadow: darkMode ? "inset 0 2px 8px rgba(0, 0, 0, 0.4)" : "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
}));

const ScheduleHeader = styled(Typography)(({ darkMode }) => ({
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "'Poppins', sans-serif",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
  textAlign: "center",
  padding: "12px",
  background: darkMode ? "#5a758c" : "#e0e0e0",
  borderRadius: "8px",
  boxShadow: darkMode ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const ScheduleCell = styled(Box)(({ darkMode, isScheduled }) => ({
  padding: "12px",
  textAlign: "center",
  fontSize: "14px",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  color: isScheduled ? (darkMode ? "#1abc9c" : "#6c4f37") : darkMode ? "#bdc3c7" : "#7f8c8d",
  background: isScheduled
    ? (darkMode ? "rgba(26, 188, 156, 0.15)" : "rgba(108, 79, 55, 0.15)")
    : "transparent",
  borderRadius: "6px",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
  transition: "all 0.2s ease",
  "&:hover": {
    background: darkMode ? "rgba(69, 90, 100, 0.8)" : "rgba(224, 224, 224, 0.5)",
    borderColor: darkMode ? "#1abc9c" : "#6c4f37",
    cursor: "pointer",
  },
}));

const TimeCell = styled(Box)(({ darkMode }) => ({
  padding: "12px",
  textAlign: "left",
  fontSize: "14px",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 600,
  color: darkMode ? "#ecf0f1" : "#2c3e50",
  background: darkMode ? "rgba(90, 117, 140, 0.2)" : "rgba(224, 224, 224, 0.3)",
  borderRadius: "6px",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
}));

const ChooseScheduleTherapist = ({ darkMode }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token } = useAuth();

  const therapistId = userId || location.state?.therapistId || localStorage.getItem("userId");
  const authToken = token || location.state?.token || localStorage.getItem("token");

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayToNumber = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

  // Fetch time slots from TimeSlotSchedule
  const fetchTimeSlots = async () => {
    try {
      const response = await getAllTimeSlots(authToken);
      const fetchedTimeSlots = Array.isArray(response.data) ? response.data : [];
      setTimeSlots(fetchedTimeSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchTimeSlots();
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

    const dayNumber = dayToNumber[selectedDay];
    const hasOverlap = schedules.some((schedule) => {
      if (schedule.dayOfWeek !== dayNumber) return false;
      const existingStart = schedule.startWorkingTime;
      const existingEnd = schedule.endWorkingTime;
      return (startTime < existingEnd && endTime > existingStart);
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
      fetchSchedules(); // Refresh schedules after adding
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

  // Generate schedule grid based on fetched time slots
  const scheduleGrid = timeSlots.map((slot) => {
    const row = { time: `${slot.startTime.slice(0, 5)}-${slot.endTime.slice(0, 5)}`, start: slot.startTime, end: slot.endTime };
    days.forEach((day) => {
      const daySchedules = schedules.filter((s) => s.dayOfWeek === dayToNumber[day]);
      const isScheduled = daySchedules.some(
        (s) =>
          (s.startWorkingTime || "00:00:00").slice(0, 5) <= slot.startTime.slice(0, 5) &&
          (s.endWorkingTime || "00:00:00").slice(0, 5) > slot.startTime.slice(0, 5)
      );
      row[day] = isScheduled;
    });
    return row;
  });

  // Handle click on schedule cell
  const handleCellClick = (day, slot) => {
    setSelectedDay(day);
    setStartTime(slot.start);
    setEndTime(slot.end);
  };

  return (
    <ScheduleContainer
      darkMode={darkMode}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Typography
        variant="h4"
        sx={{
          color: darkMode ? "#ecf0f1" : "#2c3e50",
          fontWeight: 700,
          mb: 6,
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
        component={motion.div}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FontAwesomeIcon icon={faCalendar} /> Therapist Schedule Management
      </Typography>

      <FormWrapper
        darkMode={darkMode}
        elevation={4}
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            Day of Week
          </InputLabel>
          <Select
            value={selectedDay}
            onChange={handleDayChange}
            sx={{
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              borderRadius: "8px",
              fontSize: "15px",
              fontFamily: "'Roboto', sans-serif",
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
          <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            Start Time
          </InputLabel>
          <Select
            value={startTime}
            onChange={handleStartTimeChange}
            sx={{
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              borderRadius: "8px",
              fontSize: "15px",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            <MenuItem value="">Select start time</MenuItem>
            {timeSlots.map((slot) => (
              <MenuItem key={slot.timeSlotId} value={slot.startTime}>
                {slot.startTime.slice(0, 5)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            End Time
          </InputLabel>
          <Select
            value={endTime}
            onChange={handleEndTimeChange}
            sx={{
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
              backgroundColor: darkMode ? "#2c3e50" : "#fff",
              borderRadius: "8px",
              fontSize: "15px",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            <MenuItem value="">Select end time</MenuItem>
            {timeSlots.map((slot) => (
              <MenuItem key={slot.timeSlotId} value={slot.endTime}>
                {slot.endTime.slice(0, 5)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            darkMode={darkMode}
            component={motion.div}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Add Schedule
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={handleBack}
            darkMode={darkMode}
            sx={{
              background: "transparent",
              borderColor: darkMode ? "#1abc9c" : "#6c4f37",
              color: darkMode ? "#1abc9c" : "#6c4f37",
              "&:hover": {
                borderColor: darkMode ? "#16a085" : "#503a28",
                background: darkMode ? "rgba(26, 188, 156, 0.1)" : "rgba(108, 79, 55, 0.1)",
              },
            }}
            component={motion.div}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Back to Dashboard
          </StyledButton>
        </Box>
      </FormWrapper>

      <ScheduleTableWrapper
        darkMode={darkMode}
        elevation={4}
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FontAwesomeIcon icon={faCalendar} /> Current Schedules
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: darkMode ? "#bdc3c7" : "#7f8c8d", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}
          >
            {schedules.length} Schedules
          </Typography>
        </Box>

        <ScheduleGrid darkMode={darkMode}>
          <ScheduleHeader darkMode={darkMode}>Time</ScheduleHeader>
          {days.map((day) => (
            <ScheduleHeader key={day} darkMode={darkMode}>
              {day}
            </ScheduleHeader>
          ))}

          {scheduleGrid.map((row, index) => (
            <React.Fragment key={index}>
              <TimeCell darkMode={darkMode}>
                {row.time}
              </TimeCell>
              {days.map((day) => (
                <ScheduleCell
                  key={`${day}-${index}`}
                  darkMode={darkMode}
                  isScheduled={row[day]}
                  onClick={() => handleCellClick(day, row)}
                >
                  {row[day] ? "✓" : "—"}
                </ScheduleCell>
              ))}
            </React.Fragment>
          ))}
        </ScheduleGrid>

        {schedules.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h5"
              sx={{
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                mb: 3,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FontAwesomeIcon icon={faCalendar} /> Schedule Details
            </Typography>
            <TableContainer sx={{ borderRadius: "8px", overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: darkMode ? "#5a758c" : "#e0e0e0", color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600, fontSize: "14px", fontFamily: "'Poppins', sans-serif" }}>
                      Day
                    </TableCell>
                    <TableCell sx={{ backgroundColor: darkMode ? "#5a758c" : "#e0e0e0", color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600, fontSize: "14px", fontFamily: "'Poppins', sans-serif" }}>
                      Start
                    </TableCell>
                    <TableCell sx={{ backgroundColor: darkMode ? "#5a758c" : "#e0e0e0", color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600, fontSize: "14px", fontFamily: "'Poppins', sans-serif" }}>
                      End
                    </TableCell>
                    <TableCell sx={{ backgroundColor: darkMode ? "#5a758c" : "#e0e0e0", color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600, fontSize: "14px", fontFamily: "'Poppins', sans-serif" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.scheduleId} sx={{ "&:hover": { backgroundColor: darkMode ? "#455a64" : "#f8f4e1" } }}>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontSize: "14px", fontFamily: "'Roboto', sans-serif" }}>
                        {days[schedule.dayOfWeek]}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontSize: "14px", fontFamily: "'Roboto', sans-serif" }}>
                        {(schedule.startWorkingTime || "").slice(0, 5)}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontSize: "14px", fontFamily: "'Roboto', sans-serif" }}>
                        {(schedule.endWorkingTime || "").slice(0, 5)}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete Schedule">
                          <IconButton
                            onClick={() => handleDelete(schedule.scheduleId)}
                            sx={{ color: darkMode ? "#f44336" : "#721c24" }}
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