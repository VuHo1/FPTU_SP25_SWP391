import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import {
  getAllTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
} from "../api/testApi";

const MainContent = styled(Box)(({ darkMode }) => ({
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
    : "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
  transition: "all 0.3s ease",
}));

const TimeSlotSchedule = ({ darkMode, onReturn }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [editTimeSlotId, setEditTimeSlotId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTimeSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      const timeSlotsResponse = await getAllTimeSlots(token);
      setTimeSlots(timeSlotsResponse.data || []);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const normalizeTime = (time) => {
    if (!time) return "";
    if (!time.includes(":")) return `${time}:00:00`;
    if (time.split(":").length === 2) return `${time}:00`;
    return time;
  };

  const isTimeInRange = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 7 * 60; // 7:00 AM = 420 minutes
    const maxMinutes = 21 * 60; // 9:00 PM = 1260 minutes
    return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
  };

  const handleCreateOrUpdateTimeSlot = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const normalizedStartTime = normalizeTime(startTime);
      const normalizedEndTime = normalizeTime(endTime);

      if (!normalizedStartTime || !normalizedEndTime) {
        throw new Error("Start Time and End Time are required.");
      }

      // Check if startTime and endTime are within 7 AM to 9 PM
      if (!isTimeInRange(normalizedStartTime)) {
        throw new Error("Start Time must be between 7:00 AM and 9:00 PM.");
      }
      if (!isTimeInRange(normalizedEndTime)) {
        throw new Error("End Time must be between 7:00 AM and 9:00 PM.");
      }

      // Ensure endTime is after startTime
      const startMinutes = parseInt(normalizedStartTime.split(":")[0]) * 60 + parseInt(normalizedStartTime.split(":")[1]);
      const endMinutes = parseInt(normalizedEndTime.split(":")[0]) * 60 + parseInt(normalizedEndTime.split(":")[1]);
      if (endMinutes <= startMinutes) {
        throw new Error("End Time must be after Start Time.");
      }

      if (editTimeSlotId) {
        const timeSlotData = {
          timeSlotId: editTimeSlotId,
          startTime: normalizedStartTime,
          endTime: normalizedEndTime,
          description: description || `${startTime} - ${endTime}`,
        };
        console.log("Updating time slot with data:", timeSlotData);
        const response = await updateTimeSlot(editTimeSlotId, timeSlotData, token);
        console.log("Server response after update:", response.data);

        setTimeSlots((prev) =>
          prev.map((slot) =>
            slot.timeSlotId === editTimeSlotId ? { ...slot, ...response.data } : slot
          )
        );
        await fetchTimeSlots();
        alert("Time slot updated successfully!");
      } else {
        const timeSlotData = {
          startTime: normalizedStartTime,
          endTime: normalizedEndTime,
        };
        console.log("Creating time slot with data:", timeSlotData);
        const response = await createTimeSlot(timeSlotData, token);
        console.log("Server response after create:", response.data);
        setTimeSlots((prev) => [...prev, response.data]);
        alert("Time slot created successfully!");
      }

      setStartTime("");
      setEndTime("");
      setDescription("");
      setEditTimeSlotId(null);
    } catch (error) {
      console.error("Error creating/updating time slot:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(", ")
          : error.response?.data?.message || error.message;
      alert(`Failed to create/update time slot: ${errorMessage}`);
    }
  };

  const handleEditTimeSlot = (timeSlot) => {
    setEditTimeSlotId(timeSlot.timeSlotId);
    setStartTime(timeSlot.startTime.slice(0, 5));
    setEndTime(timeSlot.endTime.slice(0, 5));
    setDescription(timeSlot.description);
  };

  const handleDeleteTimeSlot = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      await deleteTimeSlot(id, token);
      setTimeSlots((prev) => prev.filter((slot) => slot.timeSlotId !== id));
      alert("Time slot deleted successfully!");
    } catch (error) {
      console.error("Error deleting time slot:", error);
      alert("Failed to delete time slot.");
    }
  };

  const filteredTimeSlots = timeSlots.filter((slot) =>
    `${slot.startTime} ${slot.endTime} ${slot.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTimeSlots.length / itemsPerPage);
  const paginatedTimeSlots = filteredTimeSlots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <MainContent
      darkMode={darkMode}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton
          onClick={onReturn}
          sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: darkMode ? "#ffffff" : "#1d1d1f" }}
        >
          Time Slot Management
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", mb: 2 }}
        >
          {editTimeSlotId ? "Update Time Slot" : "Create New Time Slot"}
        </Typography>
        <TextField
          label="Start Time (7:00 AM - 9:00 PM)"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: "07:00", max: "21:00" }} // Restrict input range in UI
        />
        <TextField
          label="End Time (7:00 AM - 9:00 PM)"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: "07:00", max: "21:00" }} // Restrict input range in UI
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder={`${startTime} - ${endTime}`}
          disabled={!editTimeSlotId}
        />
        <Button
          variant="contained"
          onClick={handleCreateOrUpdateTimeSlot}
          disabled={!startTime || !endTime}
          sx={{ backgroundColor: darkMode ? "#4caf50" : "#1976d2" }}
        >
          {editTimeSlotId ? "Update Time Slot" : "Create Time Slot"}
        </Button>
        {editTimeSlotId && (
          <Button
            variant="outlined"
            onClick={() => {
              setEditTimeSlotId(null);
              setStartTime("");
              setEndTime("");
              setDescription("");
            }}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ color: darkMode ? "#ffffff" : "#1d1d1f", mb: 2 }}
        >
          Existing Time Slots
        </Typography>
        <TextField
          label="Search Time Slots"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Search by start time, end time, or description"
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>ID</TableCell>
              <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>Start Time</TableCell>
              <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>End Time</TableCell>
              <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>Description</TableCell>
              <TableCell sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTimeSlots.map((slot) => (
              <TableRow key={slot.timeSlotId}>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>{slot.timeSlotId}</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>{slot.startTime}</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>{slot.endTime}</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }}>{slot.description}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditTimeSlot(slot)}
                    sx={{ color: darkMode ? "#ffb300" : "#1976d2" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteTimeSlot(slot.timeSlotId)}
                    sx={{ color: darkMode ? "#f44336" : "#d32f2f" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ button: { color: darkMode ? "#ffffff" : "#1d1d1f" } }}
          />
        </Box>
      )}
    </MainContent>
  );
};

export default TimeSlotSchedule;