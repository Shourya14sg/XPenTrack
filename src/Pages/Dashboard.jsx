import React, { useState,useEffect } from 'react'
import { AddExpence, Navbar } from '../Components';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExpenseTable from './ExpenseTable.jsx';
import Box from "@mui/material/Box";
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
  const navigate=useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [visitProfile,SetVisitProfile]=useState(false);
  const [isMenu,setIsMenu]=useState(true)
  
  const User_data=JSON.parse(sessionStorage.getItem("user_data"));
  const userID=User_data? User_data.user.id:null;
  const accessToken=User_data? User_data.access:null;
  
  
  
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
      console.error(error);
      setNotifications({});
      if(error.response.status==401){
        logout(navigate);
      }
    }
  };

  useEffect(() => {
    //window.history.replaceState(null, '', '/dashboard');
    fetchNotifications(); // Initial fetch
    const interval = setInterval(() => {
      fetchNotifications();
    }, 20000); 
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [open]);


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
          onMenuClick={()=>{setIsMenu(!isMenu)}}
        />
        
        <Sidebar isMenu={isMenu} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 1,
            pr:1,
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