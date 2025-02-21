import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import BarChartIcon from "@mui/icons-material/BarChart";

const drawerWidth = 240;
const Sidebar = () => {

  const drawer = (
    <div>     
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
  );
};

export default Sidebar;


const sideBarItems = [
  { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
  { text: "Split Bills", icon: <CardMembershipIcon />, link: "/dashboard/splitbills" },
  { text: "Debt Analysis", icon: <CurrencyExchangeIcon />, link: "/dashboard/debtanalysis" },
  { text: "Expense Analysis", icon: <BarChartIcon />, link: "/dashboard/expensegraphs" },
];
/**
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
 */