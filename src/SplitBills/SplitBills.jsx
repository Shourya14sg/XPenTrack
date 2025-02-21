import React, { useState } from 'react'
import ResponsiveDrawer from '../Drawer.jsx'
import NestedList from './GroupsTable'
import { AddExpence, Navbar } from "../Components";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import NotificationTab from "../Components/Notifications/NotificationTab.jsx";
import useNotifications from "../Pages/useNotification.jsx";


const drawerWidth = 240;

const SplitBills = () => {

  const [isMenu, setIsMenu] = useState(true);
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Use the custom notification hook
  const { notifications, hasNewNotifications, setHasNewNotifications } = useNotifications();

  return (
    <>
    <ResponsiveDrawer isMenu={isMenu}
        setIsMenu={setIsMenu}
        hasNewNotifications={hasNewNotifications}
        onBellClick={() => {
          setShowNotifications(!showNotifications);
          setHasNewNotifications(false);
        }}/>
    <Box sx={{
          marginTop: "5rem",
          marginLeft: isMenu ? `${drawerWidth}px` : "0px",
          transition: "margin 0.3s ease-in-out",
          padding: "20px",
        }}>
        {/* <CreateGroupForm/> */}
        <NestedList/>
    </Box>
    {showNotifications && <NotificationTab notifications={notifications} />}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 40,
          right: 40,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
      {open && <AddExpence open={open} setOpen={setOpen} />}
    </>
  )
}

export default SplitBills
