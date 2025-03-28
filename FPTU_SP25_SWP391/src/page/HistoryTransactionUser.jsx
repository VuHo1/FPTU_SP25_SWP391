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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { getUserBookings } from "../api/testApi"; // Adjust path
import { useAuth } from "../page/AuthContext"; // Adjust path

const MainContent = styled(Box)(({ darkMode }) => ({
  padding: "40px",
  minHeight: "100vh",
  background: darkMode
    ? "linear-gradient(135deg, #2d3436 0%, #636e72 100%)"
    : "linear-gradient(135deg, #f5f7fa 0%, #dfe4ea 100%)",
  color: darkMode ? "#dfe6e9" : "#2d3436",
}));

const StyledTableContainer = styled(TableContainer)(({ darkMode }) => ({
  backgroundColor: darkMode ? "#2d3436" : "#ffffff",
  borderRadius: "12px",
  boxShadow: darkMode
    ? "0 6px 20px rgba(0, 0, 0, 0.7)"
    : "0 6px 20px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
}));

const StyledTableHead = styled(TableHead)(({ darkMode }) => ({
  backgroundColor: darkMode ? "#0984e3" : "#00a8ff",
  "& th": {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "1rem",
    padding: "16px",
    borderBottom: darkMode ? "1px solid #636e72" : "1px solid #dfe4ea",
  },
}));

const StyledTableRow = styled(TableRow)(({ darkMode }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: darkMode ? "#353b48" : "#f9fbfc",
  },
  "&:hover": {
    backgroundColor: darkMode ? "#4b5466" : "#edf2f7",
    transition: "background-color 0.2s ease-in-out",
  },
  "& td": {
    padding: "14px 16px",
    fontSize: "0.95rem",
    borderBottom: darkMode ? "1px solid #636e72" : "1px solid #dfe4ea",
  },
}));

const FilterContainer = styled(Box)({
  display: "flex",
  gap: "20px",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
});

const ContentSection = styled(Box)({
  marginBottom: "30px",
});

const HistoryTransactionUser = ({ darkMode }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paidFilter, setPaidFilter] = useState("all");
  const { userId, token } = useAuth();

  const fetchUserBookings = async () => {
    if (!userId || !token) {
      setError("You must be logged in to view your transaction history.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getUserBookings(userId, token);
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (err) {
      setError("Failed to fetch bookings: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [userId, token]);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...bookings];

    if (paidFilter !== "all") {
      const isPaid = paidFilter === "paid";
      filtered = filtered.filter((booking) => booking.isPaid === isPaid);
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [paidFilter, bookings]);

  const handlePaidFilterChange = (e) => {
    setPaidFilter(e.target.value);
  };

  return (
    <MainContent darkMode={darkMode}>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, letterSpacing: "0.5px" }}>
          Transaction History
        </Typography>

        {/* Additional Content */}
        <ContentSection>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: "1.1rem",
              color: darkMode ? "#b2bec3" : "#636e72",
              lineHeight: 1.6,
            }}
          >
            Welcome to your Transaction History page! Here, you can review all your past bookings, track payment statuses, and manage your appointment records. Use the payment status filter below to quickly find paid or unpaid transactions.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.95rem",
              color: darkMode ? "#95a5a6" : "#7f8c8d",
              lineHeight: 1.5,
            }}
          >
            Note: All prices are displayed in VND (₫). If you have any questions about a booking or need assistance, please contact our support team via the <a href="/contact" style={{ color: darkMode ? "#74b9ff" : "#0984e3" }}>Contact page</a>.
          </Typography>
        </ContentSection>

        {/* Filter */}
        <FilterContainer>
          <FormControl sx={{ width: "180px" }}>
            <InputLabel sx={{ color: darkMode ? "#b2bec3" : "#636e72" }}>Payment Status</InputLabel>
            <Select
              value={paidFilter}
              onChange={handlePaidFilterChange}
              sx={{
                backgroundColor: darkMode ? "#353b48" : "#ffffff",
                color: darkMode ? "#dfe6e9" : "#2d3436",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#636e72" : "#dfe4ea" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#0984e3" : "#00a8ff" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#0984e3" : "#00a8ff" },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </Select>
          </FormControl>
        </FilterContainer>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: darkMode ? "#0984e3" : "#00a8ff" }} />
          </Box>
        )}

        {error && (
          <Typography variant="body1" color="error" sx={{ mb: 4, fontSize: "1rem" }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <StyledTableContainer component={Paper} darkMode={darkMode}>
            <Table>
              <StyledTableHead darkMode={darkMode}>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Therapist ID</TableCell>
                  <TableCell>Time Slot ID</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Use Wallet</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <StyledTableRow darkMode={darkMode}>
                    <TableCell colSpan={10} align="center">No bookings found</TableCell>
                  </StyledTableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <StyledTableRow key={booking.bookingId} darkMode={darkMode}>
                      <TableCell>{booking.bookingId}</TableCell>
                      <TableCell>{booking.therapistId}</TableCell>
                      <TableCell>{booking.timeSlotId}</TableCell>
                      <TableCell>{new Date(booking.dateCreated).toLocaleString()}</TableCell>
                      <TableCell>{booking.totalPrice.toLocaleString()} ₫</TableCell>
                      <TableCell>{booking.note || "N/A"}</TableCell>
                      <TableCell>{booking.status === 1 ? "Active" : "Inactive"}</TableCell>
                      <TableCell>{booking.isPaid ? "Yes" : "No"}</TableCell>
                      <TableCell>{new Date(booking.appointmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.useWallet ? "Yes" : "No"}</TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}

        {/* Additional Footer Content */}
        <ContentSection sx={{ mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.9rem",
              color: darkMode ? "#95a5a6" : "#7f8c8d",
              lineHeight: 1.5,
            }}
          >
            Need to review more details about a specific booking? Click on the Booking ID (coming soon) to view full details, including therapist information and payment receipts. For urgent issues, reach out to us at support@example.com.
          </Typography>
        </ContentSection>
      </Box>
    </MainContent>
  );
};

export default HistoryTransactionUser;