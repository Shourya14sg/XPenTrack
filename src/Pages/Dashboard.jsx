import React, { useState,useEffect } from 'react'
import { AddExpence, Navbar } from '../Components';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExpenseTable from './ExpenseTable.jsx';
import ResponsiveDrawer from '../Components/Navigation/Drawer.jsx';
import { Box } from '@mui/material';
import NotificationTab from '../Components/Notifications/NotificationTab.jsx';
import axios from 'axios';
import { domain } from '../Constants/Constants.js';
import {Route,Routes} from 'react-router-dom'
import Sidebar from '../Components/Navigation/Sidebar.jsx';
import SplitBills from '../SplitBills/SplitBills.jsx'
import ExpenseAnalysis from './ExpenseAnalysis/ExpenseAnalysis.jsx'
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
      const response = await axios.get(`${domain}/exp/pending-expenses/${userID}`,{
        //params: { userID }, // query param
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }); 
      const newNotifications = Array.isArray(response.data) ? response.data : [];
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
    }, 10000); 
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  const handleDrawerToggle=()=>{
    setIsMenu(!isMenu);
  }


  return (
    <> 
        <Navbar
          hasNewNotifications={hasNewNotifications}
          onBellClick={() => {
            setShowNotifications(!showNotifications);
            setHasNewNotifications(false);
          }}
          handleDrawerToggle={handleDrawerToggle}
        />
        
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 1,
            mt: "4rem",
            ml: `${drawerWidth}px`,
          }}
        >
          {showNotifications && <NotificationTab notifications={notifications} />}
          <Routes>
            <Route path="/" element={<ExpenseTable />} />
            <Route path="/splitbills" element={<SplitBills/>} />
            <Route path="/debtaly" element={<ExpenseTable />} />
            <Route path="/expensegraphs" element={<ExpenseAnalysis/>} />
            <Route path="/userpro" element={<ExpenseTable />} />
          </Routes>{/**<Route path='/splitbills' element={<ProtectedRoute element={<SplitBills/>}/>} ></Route>
        <Route path='/debtaly' element={<ProtectedRoute element={<Dashboard/>}/>} ></Route>
        <Route path='/expensegraphs' element={<ProtectedRoute element={<ExpenseAnalysis/>}/>} ></Route>
        <Route path='/userpro' element={<ProtectedRoute element={<Dashboard/>}/>/*<Dashboard/>} ></Route> */}
        </Box>
        <Fab color="primary" aria-label="add"  onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 40,
            right: 40,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
        {open && <AddExpence open={open} setOpen={setOpen} />}
      
  </>
  );
};