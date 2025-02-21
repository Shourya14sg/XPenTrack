import {Fade,MenuItem,Menu} from "@mui/material";
import { useState, useEffect } from "react";
import { Button, Divider, Typography, Box } from "@mui/material";
import { logout } from "../../App";
import LogoutIcon from '@mui/icons-material/Logout';

export default function ProfileMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const data = sessionStorage.getItem("user_data");
    if (data) {
      setUserData(JSON.parse(data).user);
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user_data"); // Clear user data
    setAnchorEl(null);
    logout();
    console.log("Logged out");
  };

  return (
    <div>
      <div
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {props.children}
      </div>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {userData ? (
          <Box sx={{ px: 2, pt: 1, minWidth: 250 }}>
            <Typography variant="h6" fontWeight="bold">
              {userData.username}
            </Typography>
            <Typography variant="body2" color="textSecondary" pb={2}>
              {userData.email}
            </Typography>

            <Divider sx={{ my: 1,}} />

            <Typography variant="body2" py={1} fontWeight={"bold"}>Total Expenses: ₹{userData.total_expenses}</Typography>
            <Typography variant="body2">Paid: ₹{userData.total_paid}</Typography>
            <Typography variant="body2">Pending: ₹{userData.total_pending}</Typography>

            <Divider sx={{ mt: 2  }} />

            <Button onClick={handleLogout} sx={{ color: "primary.main", fontWeight: "bold", }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
              Logout
            </Button>
          </Box>
        ) : (
          <MenuItem disabled>Loading...</MenuItem>
        )}
      </Menu>
    </div>
  );
}
