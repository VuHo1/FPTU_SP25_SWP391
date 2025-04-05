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

// Professional Styling Redesign
const ScheduleContainer = styled(Box)(({ darkMode }) => ({
  flexGrow: 1,
  padding: "60px 40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(145deg, #1e272e 0%, #2f3e50 100%)"
    : "linear-gradient(145deg, #f9f7f1 0%, #e8ecef 100%)",
  fontFamily: "'Roboto', sans-serif",
  overflowY: "auto",
  position: "relative",
}));

const HeaderSection = styled(Box)(({ darkMode }) => ({
  marginBottom: "40px",
  textAlign: "center",
  background: darkMode
    ? "rgba(46, 62, 80, 0.95)"
    : "rgba(255, 255, 255, 0.95)",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: darkMode
    ? "0 6px 20px rgba(0, 0, 0, 0.5)"
    : "0 6px 20px rgba(0, 0, 0, 0.1)",
  border: darkMode ? "1px solid #3b4d63" : "1px solid #d3dce6",
}));

const FormWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "40px",
  borderRadius: "20px",
  background: darkMode ? "rgba(46, 62, 80, 0.98)" : "rgba(255, 255, 255, 0.98)",
  boxShadow: darkMode
    ? "0 10px 30px rgba(0, 0, 0, 0.5)"
    : "0 10px 30px rgba(0, 0, 0, 0.08)",
  border: darkMode ? "1px solid #3b4d63" : "1px solid #d3dce6",
  maxWidth: "800px",
  margin: "0 auto 60px",
  transition: "all 0.3s ease-in-out",
}));

const StyledButton = styled(Button)(({ darkMode }) => ({
  padding: "14px 28px",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "16px",
  fontFamily: "'Poppins', sans-serif",
  textTransform: "none",
  background: darkMode
    ? "linear-gradient(90deg, #00c4cc 0%, #007bff 100%)"
    : "linear-gradient(90deg, #6c4f37 0%, #8a6f4e 100%)",
  color: "#ffffff",
  "&:hover": {
    background: darkMode
      ? "linear-gradient(90deg, #00a3aa 0%, #0056b3 100%)"
      : "linear-gradient(90deg, #503a28 0%, #6c4f37 100%)",
    boxShadow: darkMode
      ? "0 6px 18px rgba(0, 196, 204, 0.4)"
      : "0 6px 18px rgba(108, 79, 55, 0.3)",
  },
  transition: "all 0.3s ease-in-out",
}));

const ScheduleTableWrapper = styled(Paper)(({ darkMode }) => ({
  padding: "40px",
  borderRadius: "20px",
  background: darkMode ? "rgba(46, 62, 80, 0.98)" : "rgba(255, 255, 255, 0.98)",
  boxShadow: darkMode
    ? "0 10px 30px rgba(0, 0, 0, 0.5)"
    : "0 10px 30px rgba(0, 0, 0, 0.08)",
  border: darkMode ? "1px solid #3b4d63" : "1px solid #d3dce6",
  maxWidth: "1400px",
  margin: "0 auto",
  transition: "all 0.3s ease-in-out",
}));

const ScheduleGrid = styled(Box)(({ darkMode }) => ({
  display: "grid",
  gridTemplateColumns: "150px repeat(7, 1fr)",
  gap: "10px",
  padding: "20px",
  borderRadius: "15px",
  background: darkMode ? "#2f3e50" : "#f1f4f8",
  boxShadow: darkMode
    ? "inset 0 4px 12px rgba(0, 0, 0, 0.5)"
    : "inset 0 4px 12px rgba(0, 0, 0, 0.05)",
}));

const ScheduleHeader = styled(Typography)(({ darkMode }) => ({
  fontSize: "15px",
  fontWeight: 700,
  fontFamily: "'Poppins', sans-serif",
  color: darkMode ? "#e6ecef" : "#2c3e50",
  textAlign: "center",
  padding: "14px",
  background: darkMode
    ? "linear-gradient(90deg, #3b4d63 0%, #5a758c 100%)"
    : "linear-gradient(90deg, #dfe6e9 0%, #b2bec3 100%)",
  borderRadius: "10px",
  boxShadow: darkMode
    ? "0 3px 6px rgba(0, 0, 0, 0.3)"
    : "0 3px 6px rgba(0, 0, 0, 0.1)",
}));

const ScheduleCell = styled(Box)(({ darkMode, isScheduled }) => ({
  padding: "14px",
  textAlign: "center",
  fontSize: "15px",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  color: isScheduled ? (darkMode ? "#00c4cc" : "#6c4f37") : darkMode ? "#a3bffa" : "#636e72",
  background: isScheduled
    ? (darkMode ? "rgba(0, 196, 204, 0.2)" : "rgba(108, 79, 55, 0.2)")
    : "transparent",
  borderRadius: "8px",
  border: darkMode ? "1px solid #3b4d63" : "1px solid #d3dce6",
  transition: "all 0.3s ease",
  "&:hover": {
    background: darkMode ? "rgba(59, 77, 99, 0.9)" : "rgba(223, 230, 233, 0.7)",
    borderColor: darkMode ? "#00c4cc" : "#6c4f37",
    cursor: "pointer",
    transform: "scale(1.03)",
  },
}));

const TimeCell = styled(Box)(({ darkMode }) => ({
  padding: "14px",
  textAlign: "left",
  fontSize: "15px",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 600,
  color: darkMode ? "#e6ecef" : "#2c3e50",
  background: darkMode ? "rgba(59, 77, 99, 0.3)" : "rgba(178, 190, 195, 0.2)",
  borderRadius: "8px",
  border: darkMode ? "1px solid #3b4d63" : "1px solid #d3dce6",
}));

const ChooseScheduleTherapist = ({ darkMode }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token, username } = useAuth();

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
      return startTime < existingEnd && endTime > existingStart;
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
      fetchSchedules();
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
      <HeaderSection darkMode={darkMode}>
        <Typography
          variant="h4"
          sx={{
            color: darkMode ? "#e6ecef" : "#2c3e50",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
          component={motion.div}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FontAwesomeIcon icon={faCalendar} /> Therapist Schedule Management
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: darkMode ? "#a3bffa" : "#636e72",
            mt: 1,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "0.95rem",
          }}
        >
          Welcome, {username || "Therapist"}
        </Typography>
      </HeaderSection>

      <FormWrapper
        darkMode={darkMode}
        elevation={6}
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: darkMode ? "#e6ecef" : "#2c3e50",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            mb: 4,
          }}
        >
          Create New Schedule
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: darkMode ? "#e6ecef" : "#2c3e50", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            Day of Week
          </InputLabel>
          <Select
            value={selectedDay}
            onChange={handleDayChange}
            sx={{
              color: darkMode ? "#e6ecef" : "#2c3e50",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#3b4d63" : "#d3dce6" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#00c4cc" : "#6c4f37" },
              backgroundColor: darkMode ? "#2f3e50" : "#fff",
              borderRadius: "10px",
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
          <InputLabel sx={{ color: darkMode ? "#e6ecef" : "#2c3e50", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            Start Time
          </InputLabel>
          <Select
            value={startTime}
            onChange={handleStartTimeChange}
            sx={{
              color: darkMode ? "#e6ecef" : "#2c3e50",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#3b4d63" : "#d3dce6" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#00c4cc" : "#6c4f37" },
              backgroundColor: darkMode ? "#2f3e50" : "#fff",
              borderRadius: "10px",
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
          <InputLabel sx={{ color: darkMode ? "#e6ecef" : "#2c3e50", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            End Time
          </InputLabel>
          <Select
            value={endTime}
            onChange={handleEndTimeChange}
            sx={{
              color: darkMode ? "#e6ecef" : "#2c3e50",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#3b4d63" : "#d3dce6" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#00c4cc" : "#6c4f37" },
              backgroundColor: darkMode ? "#2f3e50" : "#fff",
              borderRadius: "10px",
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
              borderColor: darkMode ? "#00c4cc" : "#6c4f37",
              color: darkMode ? "#00c4cc" : "#6c4f37",
              "&:hover": {
                borderColor: darkMode ? "#007bff" : "#503a28",
                background: darkMode
                  ? "rgba(0, 196, 204, 0.1)"
                  : "rgba(108, 79, 55, 0.1)",
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
            sx={{
              color: darkMode ? "#e6ecef" : "#2c3e50",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <FontAwesomeIcon icon={faCalendar} /> Current Schedules
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: darkMode ? "#a3bffa" : "#636e72",
              fontWeight: 500,
              fontFamily: "'Roboto', sans-serif",
            }}
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
              <TimeCell darkMode={darkMode}>{row.time}</TimeCell>
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
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h5"
              sx={{
                color: darkMode ? "#e6ecef" : "#2c3e50",
                mb: 3,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <FontAwesomeIcon icon={faCalendar} /> Schedule Details
            </Typography>
            <TableContainer sx={{ borderRadius: "12px", overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: darkMode ? "#3b4d63" : "#dfe6e9",
                        color: darkMode ? "#e6ecef" : "#2c3e50",
                        fontWeight: 600,
                        fontSize: "15px",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Day
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: darkMode ? "#3b4d63" : "#dfe6e9",
                        color: darkMode ? "#e6ecef" : "#2c3e50",
                        fontWeight: 600,
                        fontSize: "15px",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Start
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: darkMode ? "#3b4d63" : "#dfe6e9",
                        color: darkMode ? "#e6ecef" : "#2c3e50",
                        fontWeight: 600,
                        fontSize: "15px",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      End
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: darkMode ? "#3b4d63" : "#dfe6e9",
                        color: darkMode ? "#e6ecef" : "#2c3e50",
                        fontWeight: 600,
                        fontSize: "15px",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow
                      key={schedule.scheduleId}
                      sx={{
                        "&:hover": { backgroundColor: darkMode ? "#2f3e50" : "#f1f4f8" },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: darkMode ? "#e6ecef" : "#2c3e50",
                          fontSize: "15px",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        {days[schedule.dayOfWeek]}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: darkMode ? "#e6ecef" : "#2c3e50",
                          fontSize: "15px",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        {(schedule.startWorkingTime || "").slice(0, 5)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: darkMode ? "#e6ecef" : "#2c3e50",
                          fontSize: "15px",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        {(schedule.endWorkingTime || "").slice(0, 5)}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete Schedule">
                          <IconButton
                            onClick={() => handleDelete(schedule.scheduleId)}
                            sx={{ color: darkMode ? "#ff6b6b" : "#721c24" }}
                            component={motion.div}
                            whileHover={{ scale: 1.15 }}
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