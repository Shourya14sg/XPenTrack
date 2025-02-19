import React, { useState } from 'react'
import { AddExpence, Navbar } from '../Components';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export const Dashboard = () => {
  const [isMenu,setIsMenu]=useState(true);
  const [open, setOpen] = useState(false);

  return (
    <> 
    <Navbar isMenu={isMenu} setIsMenu={setIsMenu}/>
    <div className={isMenu?"fixed left-0  h-full w-[30%]  shadow-md shadow-emerald-200/40  ease-in-out duration-300":'fixed left-[-100%]'}>
        <ul className="pt-2  uppercase gap-y-2 text-lg">
          <li className="p-4 border-b border-gray-500/50">Analyze</li>
          <li  className="p-4 border-b border-gray-500/50">Request</li>
          <li className="p-4 border-b border-gray-500/50">Debts</li>
        </ul>
      </div>
      
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
