import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileMenu from "./ProfileMenu"
import {Appname} from "../../Constants/Constants"
const Navbar = ({ onMenuClick, hasNewNotifications, onBellClick, onProfileClick }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        height: 56,
        display: "flex",
        justifyContent: "center",
        mb:2
      }}
    >
      <Toolbar sx={{ minHeight: 56, display: "flex", alignItems: "center" }}>
        {/* Mobile Sidebar Toggle Button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2,
            width: "32px", // Matches the icon size
            height: "32px", // Matches the icon size
            alignItems: "center",
            justifyContent: "center",
            padding: 0, // Removes extra padding
            display: { xs:"flex", sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* App Name */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {Appname}
        </Typography>

        {/* Notification Bell with Red Dot */}
        <IconButton
           sx={{
            width: "32px", // Matches the icon size
            height: "32px", // Matches the icon size
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0, // Removes extra padding
            mr:2
          }}
          color="inherit"
          onClick={onBellClick}
        >
          <Badge
            color="error"
            variant="dot"
            invisible={!hasNewNotifications}
            sx={{ "& .MuiBadge-dot": { width: 8, height: 8 } }} // Adjust red dot size
          >
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
        <ProfileMenu>
          <AccountCircleIcon sx={{ cursor: "pointer" }} onClick={onProfileClick} /> 
        </ProfileMenu>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
