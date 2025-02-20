import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { domain } from '../Constants/Constants';
import axios from 'axios';

export default function ExpenseTable() {
const [rows, setRows] = useState([]); // Store data in state
  const [loading, setLoading] = useState(true);
  const fetchExpenseData = async () => {
    try {
      const User_data=JSON.parse(sessionStorage.getItem("user_data"));
      const userID=User_data? User_data.user.id:null;
      const accessToken=User_data? User_data.access:null;    
      const response = await axios.get(`${domain}/exp/user-expenses/${userID}`,{
        //params: { userID }, // Pass userID as query param
        headers: {
          Authorization: `Bearer ${accessToken}`,

          'Content-Type': 'application/json', // Ensure correct content type
        },
      }); 
      const newExpensedata = Array.isArray(response.data)? response.data : [];//Array.isArray(response.data) 
      setRows(newExpensedata); // Set data from JSON file
     // console.log(newExpensedata)
     } catch (error) {
      console.error('Error fetching Expense Data:', error);
      setRows([]); // Set to empty array on error

    }
    finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExpenseData(); // Initial fetch
    const interval = setInterval(() => {
      fetchExpenseData();
    }, 10000); // 2 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);


  const column = [
    { field: "category", headerName: "Category", width: 200 },
    { field: "type", headerName: "Type", width: 200 },
    { field: "amount", headerName: "Amount", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "payment_date", headerName: "Date", width: 200 },
    { field: "group", headerName: "Group", width: 200 },
  ];

  return (
    <div style={{ height: 'full', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={column}
        filterMode="client"
        autoPageSize
        pageSizeOptions={[10]}
        // onFilterModelChange={onFilterChange}
        loading={loading}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f4f4",
            color: "#333",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      />
    </div>
  );
}