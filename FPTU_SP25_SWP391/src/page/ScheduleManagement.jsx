import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { getTherapistSchedules, updateTherapistSchedule, deleteTherapistSchedule } from "../api/testApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// Styled Container
const ScheduleContainer = styled(Box)(({ darkMode }) => ({
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

// Modal Styling
const ModalBox = styled(Box)(({ darkMode }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: darkMode ? "#34495e" : "#fff",
  border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
}));

const ScheduleManagement = ({ darkMode }) => {
  const [schedules, setSchedules] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editDay, setEditDay] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  // Days of the week mapping
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayToNumber = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

  // Fetch all therapist schedules
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      const response = await getTherapistSchedules(token);
      const fetchedSchedules = Array.isArray(response.data) ? response.data : [];
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error("Error fetching therapist schedules:", error);
      setSchedules([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Handle delete schedule
  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteTherapistSchedule(scheduleId, token);
      setSchedules(schedules.filter((schedule) => schedule.scheduleId !== scheduleId));
      alert("Schedule deleted successfully!");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("Failed to delete schedule. Please try again.");
    }
  };

  // Handle edit modal open
  const handleEditOpen = (schedule) => {
    setSelectedSchedule(schedule);
    setEditDay(days[schedule.dayOfWeek]);
    setEditStartTime(schedule.startWorkingTime.slice(0, 5));
    setEditEndTime(schedule.endWorkingTime.slice(0, 5));
    setOpenEditModal(true);
  };

  // Handle edit modal close
  const handleEditClose = () => {
    setOpenEditModal(false);
    setSelectedSchedule(null);
    setEditDay("");
    setEditStartTime("");
    setEditEndTime("");
  };

  // Handle update schedule
  const handleUpdate = async () => {
    if (!editDay || !editStartTime || !editEndTime) {
      alert("Please fill in all fields.");
      return;
    }
    if (editStartTime >= editEndTime) {
      alert("End time must be after start time.");
      return;
    }

    const updatedSchedule = {
      therapistId: selectedSchedule.therapistId,
      dayOfWeek: dayToNumber[editDay],
      StartTime: `${editStartTime}:00`,
      EndTime: `${editEndTime}:00`,
    };

    try {
      const token = localStorage.getItem("token");
      await updateTherapistSchedule(selectedSchedule.scheduleId, updatedSchedule, token);
      setSchedules(
        schedules.map((schedule) =>
          schedule.scheduleId === selectedSchedule.scheduleId
            ? { ...schedule, dayOfWeek: dayToNumber[editDay], startWorkingTime: `${editStartTime}:00`, endWorkingTime: `${editEndTime}:00` }
            : schedule
        )
      );
      alert("Schedule updated successfully!");
      handleEditClose();
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule. Please try again.");
    }
  };

  return (
    <ScheduleContainer
      darkMode={darkMode}
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography
        variant="h5"
        sx={{
          color: darkMode ? "#ecf0f1" : "#2c3e50",
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <FontAwesomeIcon icon={faCalendar} /> Therapist Schedule Management
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          background: darkMode ? "#34495e" : "#f8f4e1",
          borderRadius: "8px",
          boxShadow: darkMode ? "inset 0 2px 8px rgba(0, 0, 0, 0.4)" : "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Therapist Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Day of Week
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Start Time
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                End Time
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Time Slots
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: darkMode ? "#5a758c" : "#e0e0e0",
                  color: darkMode ? "#ecf0f1" : "#2c3e50",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <TableRow
                  key={schedule.scheduleId}
                  sx={{
                    "&:hover": { backgroundColor: darkMode ? "#455a64" : "#f8f4e1" },
                  }}
                >
                  <TableCell
                    sx={{
                      color: darkMode ? "#ecf0f1" : "#2c3e50",
                      fontSize: "14px",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {schedule.therapistName || "Unknown"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: darkMode ? "#ecf0f1" : "#2c3e50",
                      fontSize: "14px",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {days[schedule.dayOfWeek]}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: darkMode ? "#ecf0f1" : "#2c3e50",
                      fontSize: "14px",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {(schedule.startWorkingTime || "").slice(0, 5)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: darkMode ? "#ecf0f1" : "#2c3e50",
                      fontSize: "14px",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {(schedule.endWorkingTime || "").slice(0, 5)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: darkMode ? "#ecf0f1" : "#2c3e50",
                      fontSize: "14px",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {schedule.timeSlots && schedule.timeSlots.length > 0
                      ? schedule.timeSlots.map((slot) => slot.timeSlotDescription).join(", ")
                      : "None"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Schedule">
                      <IconButton
                        onClick={() => handleEditOpen(schedule)}
                        sx={{ color: darkMode ? "#1abc9c" : "#6c4f37" }}
                        component={motion.div}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Schedule">
                      <IconButton
                        onClick={() => handleDelete(schedule.scheduleId)}
                        sx={{ color: darkMode ? "#f44336" : "#721c24" }}
                        component={motion.div}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    color: darkMode ? "#bdc3c7" : "#7f8c8d",
                    fontSize: "14px",
                    fontFamily: "'Roboto', sans-serif",
                    textAlign: "center",
                  }}
                >
                  No schedules available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Schedule Modal */}
      <Modal open={openEditModal} onClose={handleEditClose}>
        <ModalBox darkMode={darkMode}>
          <Typography
            variant="h6"
            sx={{
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              fontFamily: "'Poppins', sans-serif",
              mb: 3,
            }}
          >
            Edit Schedule
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>Day of Week</InputLabel>
            <Select
              value={editDay}
              onChange={(e) => setEditDay(e.target.value)}
              sx={{
                color: darkMode ? "#ecf0f1" : "#2c3e50",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
              }}
            >
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Start Time"
            type="time"
            value={editStartTime}
            onChange={(e) => setEditStartTime(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiInputBase-input": { color: darkMode ? "#ecf0f1" : "#2c3e50" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
              "& .MuiInputLabel-root": { color: darkMode ? "#ecf0f1" : "#2c3e50" },
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time"
            type="time"
            value={editEndTime}
            onChange={(e) => setEditEndTime(e.target.value)}
            fullWidth
            sx={{
              mb: 3,
              "& .MuiInputBase-input": { color: darkMode ? "#ecf0f1" : "#2c3e50" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#5a758c" : "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#1abc9c" : "#6c4f37" },
              "& .MuiInputLabel-root": { color: darkMode ? "#ecf0f1" : "#2c3e50" },
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={handleEditClose}
              sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                backgroundColor: darkMode ? "#1abc9c" : "#6c4f37",
                "&:hover": { backgroundColor: darkMode ? "#16a085" : "#503a28" },
              }}
            >
              Save
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </ScheduleContainer>
  );
};

export default ScheduleManagement;