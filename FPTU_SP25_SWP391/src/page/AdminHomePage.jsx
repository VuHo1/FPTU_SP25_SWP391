import React from "react";
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import { styled } from "@mui/system";

// Styled Components
const MainContent = styled(Box)(({ theme, darkMode }) => ({
  flexGrow: 1,
  padding: "32px",
  minHeight: "100vh",
  backgroundColor: darkMode ? "#121212" : "#f5f5f5",
  transition: "all 0.3s",
}));

const DashboardCard = styled(Paper)(({ theme, darkMode }) => ({
  padding: "24px",
  borderRadius: "12px",
  backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
  boxShadow: darkMode 
    ? "0 4px 20px rgba(0, 0, 0, 0.5)" 
    : "0 4px 20px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const Sidebar = styled(Drawer)(({ theme, darkMode }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
    borderRight: darkMode ? "1px solid #2d2d2d" : "1px solid #e0e0e0",
  },
}));

export default function AdminHomePage({ darkMode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar Menu Items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Users", icon: <PeopleIcon /> },
    { text: "Analytics", icon: <BarChartIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: darkMode ? "#ffffff" : "#1d1d1f", 
          mb: 2,
          fontWeight: 600 
        }}
      >
        Admin Panel
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            sx={{
              borderRadius: "8px",
              mb: 1,
              "&:hover": {
                backgroundColor: darkMode ? "#2d2d2d" : "#f0f0f0",
              },
            }}
          >
            <ListItemIcon sx={{ color: darkMode ? "#a1a1a6" : "#6e6e73" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar for Desktop */}
      <Sidebar
        variant="permanent"
        darkMode={darkMode}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        {drawerContent}
      </Sidebar>

      {/* Sidebar for Mobile */}
      <Sidebar
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        darkMode={darkMode}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {drawerContent}
      </Sidebar>

      {/* Main Content */}
      <MainContent darkMode={darkMode}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon sx={{ color: darkMode ? "#ffffff" : "#1d1d1f" }} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: darkMode ? "#ffffff" : "#1d1d1f",
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        {/* Welcome Message */}
        <Typography
          variant="subtitle1"
          sx={{
            color: darkMode ? "#a1a1a6" : "#6e6e73",
            mb: 4,
          }}
        >
          Welcome back, Admin! Here's an overview of your platform.
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          {[
            { title: "Total Users", value: "124,563", change: "+12.5%" },
            { title: "Active Sessions", value: "8,234", change: "+5.2%" },
            { title: "Revenue", value: "$45,231", change: "+8.9%" },
            { title: "Pending Tickets", value: "142", change: "-3.1%" },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DashboardCard darkMode={darkMode}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: darkMode ? "#a1a1a6" : "#6e6e73",
                    mb: 1,
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: darkMode ? "#ffffff" : "#1d1d1f",
                    mb: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: stat.change.startsWith("+") ? "#4caf50" : "#f44336",
                  }}
                >
                  {stat.change} from last month
                </Typography>
              </DashboardCard>
            </Grid>
          ))}
        </Grid>
      </MainContent>
    </Box>
  );
}