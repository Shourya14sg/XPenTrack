import axios from 'axios';
import React, { useState,useEffect } from 'react'
import {domain} from '../../Constants/Constants'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";


export const DebtAnalysis = () => {
    const [loading ,setLoading]=useState(true);
    const[groups,setPendingGroups]=useState({});
    const User_data=JSON.parse(sessionStorage.getItem("user_data"));
    const userID=User_data? User_data.user.id:null;
    const accessToken=User_data? User_data.access:null;
    
    useEffect(()=>{
      const fetchPendingGroup= async ()=>{
      try{
        const res=await axios.get(`${domain}/exp/pending-expenses/${userID}`,{
        params: {last_day:false}, // query param
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          },
        })
        setPendingGroups(res?.data||{})
        //console.log(res.data)
      }catch(error){
        console.log("Error",error);
      }finally{
        setLoading(false);
    }}
    fetchPendingGroup();
  },[groups]);

  const handlePay=async (group_name,expenseid)=>{
    try{
    await axios.post(`${domain}/exp/settle/`,{split_expense_id:expenseid},{  
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        }
      }
    );
    setLoading(true)
    setPendingGroups((prevGroups) => {
        const updatedGroup = prevGroups[group_name].filter(exp => exp.split_expense_id !== expenseid);
        const newGroups = { ...prevGroups };

        if (updatedGroup.length > 0) {
          newGroups[group_name] = updatedGroup;
        } else {
          delete newGroups[group_name]; // Remove empty groups
        }
        return newGroups;
      });
  } catch (error) {
    console.log('Error processing payment:', error);
  }
};

  return (
    <div className="p-2 h-[100vh] overflow-y-auto scroll-sm bg-[#F8F8FF]">
      {loading ? (
        <p className="text-center text-gray-500">Loading groups...</p>
      ) : Object.keys(groups).length === 0 ? (
        <p className="text-center text-gray-500">No pending payments</p>
      ) : (
        <List className="w-full overflow-y-auto">
          {Object.entries(groups).map(([groupName, expenses]) => (
            <Paper key={groupName} className="p-4 m-4 font-bold">
              <Typography variant="h6" className="border-b pb-2">{groupName}</Typography>
              {expenses.map((expense) => (
                <ListItem key={expense.split_expense_id} className="flex justify-between">
                  <ListItemText 
                    primary={`${expense.owner_name} - ₹${expense.amount}`} 
                    secondary={expense.expense_description} 
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePay(groupName, expense.split_expense_id)}
                  >
                    Pay
                  </Button>
                </ListItem>
              ))}
            </Paper>
          ))}
        </List>
      )}
    </div>
  );
};