import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {Appname} from '../Constants/MenuItems'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FadeMenu from "./DropDownMenu";

const profileItems=[{title:'Profile',task:""},{title:'My Account',}]
export const Navbar = (props) => {
    const [showProfile,setShowProfile]=useState(false);
    const [notification,setNotification]=useState(false);
    const  handleNav=()=>{props.setIsMenu(!(props.isMenu));}
    //const handleProfile=;
    
    return (
    <div className="bg-indigo-500 flex justify-between items-end  h-20  p-4 mx-auto  shadow-md shadow-emerald-200/5">
      <h1 className="w-1/2 text-3xl text-white font-bold">{Appname}</h1>
      <div  className="hidden sm:flex flex-row-reverse text-lg  gap-2 sm:text-xl sm:gap-8 items-end ">
        <FadeMenu >
        <PersonRoundedIcon fontSize="large"   className="text-white  border-2 rounded-full"/> 
        </FadeMenu>
        <FadeMenu>
        <NotificationsActiveIcon fontSize="large"   className="text-white" />
        </FadeMenu>      
      </div>
      <div onClick={handleNav}className="block sm:hidden">{/*  */}
        {props.isMenu?<CloseIcon size={30}/>:<MenuIcon size={30} />}
      </div>
    </div>
  );
};
