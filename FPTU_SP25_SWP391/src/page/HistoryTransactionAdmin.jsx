import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination, // Import Pagination
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash, faHome } from "@fortawesome/free-solid-svg-icons";

const MainContent = styled(Box)(({ darkMode }) => ({
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #1c2526 0%, #34495e 100%)"
    : "linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%)",
  color: darkMode ? "#ecf0f1" : "#2c3e50",
}));

const StyledTableContainer = styled(TableContainer)(({ darkMode }) => ({
  backgroundColor: darkMode ? "#2c3e50" : "#ffffff",
  borderRadius: "8px",
  boxShadow: darkMode ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StyledTableHead = styled(TableHead)(({ darkMode }) => ({
  backgroundColor: darkMode ? "#34495e" : "#f8b195",
  "& th": {
    color: darkMode ? "#ecf0f1" : "#ffffff",
    fontWeight: "bold",
  },
}));

const StyledTableRow = styled(TableRow)(({ darkMode }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: darkMode ? "#374151" : "#f9fafb",
  },
  "&:hover": {
    backgroundColor: darkMode ? "#4b5563" : "#f3f4f6",
  },
}));

const HistoryTransactionAdmin = ({ darkMode }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paidFilter, setPaidFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const bookingsPerPage = 10; // 10 bookings per page

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all bookings from the API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://kinaa1410-001-site1.qtempurl.com/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (err) {
      setError("Failed to fetch bookings: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle search by bookingId and paid filter
  const applyFilters = () => {
    let filtered = bookings;

    // Apply bookingId search
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((booking) =>
        booking.bookingId.toString().includes(searchTerm.trim())
      );
    }

    // Apply paid filter
    if (paidFilter !== "all") {
      const isPaid = paidFilter === "paid";
      filtered = filtered.filter((booking) => booking.isPaid === isPaid);
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, paidFilter, bookings]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePaidFilterChange = (e) => {
    setPaidFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Placeholder for edit functionality
  const handleEdit = (bookingId) => {
    console.log(`Edit booking with ID: ${bookingId}`);
    // Implement PUT request to /api/bookings/{bookingId} here
  };

  // Placeholder for delete functionality
  const handleDelete = async (bookingId) => {
    if (window.confirm(`Are you sure you want to delete booking ID ${bookingId}?`)) {
      try {
        await axios.delete(`https://kinaa1410-001-site1.qtempurl.com/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });
        setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
        setFilteredBookings(filteredBookings.filter((booking) => booking.bookingId !== bookingId));
        // Adjust page if necessary after deletion
        if (currentBookings.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        setError("Failed to delete booking: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Handle return to admin home
  const handleReturnHome = () => {
    navigate("/admin/home");
  };

  return (
    <MainContent darkMode={darkMode}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Transaction History - Admin
        </Typography>
        <Button
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faHome} />}
          onClick={handleReturnHome}
          sx={{
            backgroundColor: darkMode ? "#60a5fa" : "#3b82f6",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: darkMode ? "#3b82f6" : "#2563eb",
            },
          }}
        >
          Return Home
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <TextField
          label="Search by Booking ID"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: "300px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: darkMode ? "#4b5563" : "#ffffff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              "& fieldset": {
                borderColor: darkMode ? "#6b7280" : "#d1d5db",
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#60a5fa" : "#3b82f6",
              },
              "&.Mui-focused fieldset": {
                borderColor: darkMode ? "#60a5fa" : "#3b82f6",
              },
            },
            "& .MuiInputLabel-root": {
              color: darkMode ? "#d1d5db" : "#6b7280",
            },
          }}
          InputProps={{
            endAdornment: (
              <FontAwesomeIcon icon={faSearch} style={{ color: darkMode ? "#d1d5db" : "#6b7280" }} />
            ),
          }}
        />
        <FormControl sx={{ width: "200px" }}>
          <InputLabel sx={{ color: darkMode ? "#d1d5db" : "#6b7280" }}>Paid Status</InputLabel>
          <Select
            value={paidFilter}
            onChange={handlePaidFilterChange}
            sx={{
              backgroundColor: darkMode ? "#4b5563" : "#ffffff",
              color: darkMode ? "#ecf0f1" : "#2c3e50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#6b7280" : "#d1d5db",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#60a5fa" : "#3b82f6",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#60a5fa" : "#3b82f6",
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: darkMode ? "#60a5fa" : "#3b82f6" }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 4 }}>
          {error}
        </Typography>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <StyledTableContainer component={Paper} darkMode={darkMode}>
            <Table>
              <StyledTableHead darkMode={darkMode}>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Therapist ID</TableCell>
                  <TableCell>Time Slot ID</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {currentBookings.length === 0 ? (
                  <StyledTableRow darkMode={darkMode}>
                    <TableCell colSpan={11} align="center">
                      No bookings found
                    </TableCell>
                  </StyledTableRow>
                ) : (
                  currentBookings.map((booking) => (
                    <StyledTableRow key={booking.bookingId} darkMode={darkMode}>
                      <TableCell>{booking.bookingId}</TableCell>
                      <TableCell>{booking.userId}</TableCell>
                      <TableCell>{booking.therapistId}</TableCell>
                      <TableCell>{booking.timeSlotId}</TableCell>
                      <TableCell>{new Date(booking.dateCreated).toLocaleString()}</TableCell>
                      <TableCell>{booking.totalPrice.toLocaleString()} ₫</TableCell>
                      <TableCell>{booking.note || "N/A"}</TableCell>
                      <TableCell>{booking.status === 1 ? "Active" : "Inactive"}</TableCell>
                      <TableCell>{booking.isPaid ? "Yes" : "No"}</TableCell>
                      <TableCell>{new Date(booking.appointmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(booking.bookingId)}
                          sx={{ color: darkMode ? "#60a5fa" : "#3b82f6" }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(booking.bookingId)}
                          sx={{ color: darkMode ? "#f87171" : "#ef4444" }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: darkMode ? "#ecf0f1" : "#2c3e50",
                    backgroundColor: darkMode ? "#4b5563" : "#ffffff",
                    "&:hover": {
                      backgroundColor: darkMode ? "#60a5fa" : "#3b82f6",
                      color: "#ffffff",
                    },
                  },
                  "& .Mui-selected": {
                    backgroundColor: darkMode ? "#60a5fa" : "#3b82f6",
                    color: "#ffffff",
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </MainContent>
  );
};

export default HistoryTransactionAdmin;