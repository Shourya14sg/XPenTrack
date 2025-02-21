import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerClose, handleDrawerTransitionEnd }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.clear(); // Clear all user data
    navigate("/login"); // Redirect to login page
  };

  // Sidebar items (moved inside the component after handleLogout is defined)
  const sideBarItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    { text: "Split Bills", icon: <CardMembershipIcon />, link: "/dashboard/splitbills" },
    { text: "Debt Analysis", icon: <CurrencyExchangeIcon />, link: "/dashboard/debtaly" },
    { text: "Expense Analysis", icon: <BarChartIcon />, link: "/dashboard/expensegraphs" },
    { text: "User Profile", icon: <AccountCircleIcon />, link: "/dashboard/userpro" },
    { text: "Logout", icon: <ExitToAppIcon />, action: handleLogout }, // Logout button
  ];

  const drawer = (
    <div>
      <Divider />
      <List>
        {sideBarItems.map(({ text, icon, link, action }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={link ? "a" : "button"} onClick={action || undefined} href={link || undefined}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar menu">
      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Permanent Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            height: `calc(100vh - 56px)`, // Sidebar fits under Navbar
            mt: "56px",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
