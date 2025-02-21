import React, { useState,useEffect } from 'react'
import { AddExpence, Navbar } from '../Components';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExpenseTable from './ExpenseTable.jsx';
import { Box } from '@mui/material';
import NotificationTab from '../Components/Notifications/NotificationTab.jsx';
import axios from 'axios';
import { domain } from '../Constants/Constants.js';
import {Route,Routes, useNavigate} from 'react-router-dom'
import Sidebar from '../Components/Navigation/Sidebar.jsx';
import SplitBills from '../SplitBills/SplitBills.jsx'
import {ExpenseAnalysis,DebtAnalysis} from '.'
import { logout } from '../App.jsx';

const drawerWidth = 240;

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [visitProfile,SetVisitProfile]=useState(false);
  const User_data=JSON.parse(sessionStorage.getItem("user_data"));
  const userID=User_data? User_data.user.id:null;
  const accessToken=User_data? User_data.access:null;
  const navigate=useNavigate();
  
  
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${domain}/exp/pending-expenses/${userID}`,{
        params: {last_day:true}, 
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }); 
      const newNotifications = response.data// Object.values(response.data).flat()//Array.isArray(response.data) ? response.data : [];
      if (Object.keys(newNotifications).length >Object.keys(notifications).length ) {
        setHasNewNotifications(true);
        setNotifications(newNotifications);
      }
    } catch (error) {
      //console.error('Error fetching notifications:', error.response.status);
      setNotifications({}); // Set to empty array on error
      if(error.response.status==401){
        logout(navigate);
      }// logout();
    }
  };

  useEffect(() => {
    //window.history.replaceState(null, '', '/dashboard');
    fetchNotifications(); // Initial fetch
    const interval = setInterval(() => {
      fetchNotifications();
    }, 100000); 
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);


  return (
    <> 
        <Navbar
          hasNewNotifications={hasNewNotifications}
          onBellClick={() => {
            setShowNotifications(!showNotifications);
            visitProfile?SetVisitProfile(false):""
            setHasNewNotifications(false);
          }}
          onProfileClick={()=>{
            SetVisitProfile(!visitProfile)
            showNotifications?setShowNotifications(false):""
          }}
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
          {showNotifications && <NotificationTab onMouseLeave={() => setShowNotifications(false)} notifications={notifications} />}
          
          <Routes>
            <Route path="/" element={<ExpenseTable open={open}/>} />
            <Route path="/splitbills" element={<SplitBills/>} />
            <Route path="/debtanalysis" element={<DebtAnalysis />} />
            <Route path="/expensegraphs" element={<ExpenseAnalysis/>} />
            <Route path="/userpro" element={<ExpenseTable />} />
          </Routes>
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