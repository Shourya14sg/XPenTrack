import React, { useState,useEffect } from 'react'
import { AddExpence, Navbar } from '../Components';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExpenseTable from './ExpenseTable.jsx';
import ResponsiveDrawer from '../Drawer.jsx';
import { Box } from '@mui/material';
import NotificationTab from '../Components/Notifications/NotificationTab.jsx';
import axios from 'axios';

const drawerWidth = 240;

export const Dashboard = () => {
  const [isMenu,setIsMenu]=useState(true);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const User_data=JSON.parse(sessionStorage.getItem("user_data"));
  const userID=User_data? User_data.user.id:null;
  const accessToken=User_data? User_data.access:null;
  
    const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications`,{
        params: { userID }, // Pass userID as query param
        headers: {
          Authorization: `Bearer ${accessToken}`,

          'Content-Type': 'application/json', // Ensure correct content type
        },
      }); // Replace with your actual API endpoint
      const newNotifications = Array.isArray(response.data) ? response.data : [];
      // Check if new notifications arrived
      //if(newNotifications==null) console.log("No notification")
      if (newNotifications.length > notifications.length) {
        setHasNewNotifications(true);
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(() => {
      fetchNotifications();
    }, 120000); // 2 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);



  return (
    <> 
    <ResponsiveDrawer isMenu={isMenu} setIsMenu={setIsMenu}  
        hasNewNotifications={hasNewNotifications}
        onBellClick={() => {
          setShowNotifications(!showNotifications);
          setHasNewNotifications(false);
        }} />
    <Box
        sx={{
          marginTop:"5rem",
          marginLeft: isMenu ? `${drawerWidth}px` : "0px", // Adjust margin when menu is open
          transition: "margin 0.3s ease-in-out",
          padding: "20px", // Add some padding for spacing
        }}
      >
        <ExpenseTable />
      </Box> 
      {showNotifications && <NotificationTab notifications={notifications} />}
      <Fab color="primary" aria-label="add" 
        sx={{
          position: 'fixed',
          bottom: 40,  
          right: 40,   
          zIndex: 1000, 
          
        }} 
        onClick={()=> setOpen(true)}
        >
          <AddIcon />
      </Fab>
      {open&&<AddExpence open={open} setOpen={setOpen} />}
    </>
  )
}
