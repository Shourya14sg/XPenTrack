import React, { useState } from 'react'
import { AddExpence, Navbar } from '../Components';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExpenseTable from './ExpenseTable.jsx';
import ResponsiveDrawer from '../Drawer.jsx';
import { Box } from '@mui/material';

const drawerWidth = 240;

export const Dashboard = () => {
  const [isMenu,setIsMenu]=useState(true);
  const [open, setOpen] = useState(false);

  return (
    <> 
    <ResponsiveDrawer isMenu={isMenu} setIsMenu={setIsMenu}/>
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
      {open?
      <AddExpence
         open={open} 
         setOpen={setOpen} 
      />  :""}
    </>
  )
}
