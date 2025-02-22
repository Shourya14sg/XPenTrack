import { Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'

const ExpenseTable = () => {
    const [rows, setRows] = useState([]); 

    const fetchExpenseData = async () => {
        try {
          const User_data=JSON.parse(sessionStorage.getItem("user_data"));
          const userID=User_data? User_data.user.id:null;
          const accessToken=User_data? User_data.access:null;    
          const response = await axios.get(`${domain}/exp/user-expenses/${userID}`,{
            //params: { userID }, // Pass userID as query param
            headers: {
              Authorization: `Bearer ${accessToken}`,
    
              'Content-Type': 'application/json', 
            },
          }); 
          const newExpensedata = Array.isArray(response.data)? response.data : []; 
          setRows(newExpensedata); // Set data from JSON file
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
          }, 500000); // 2 minutes
          return () => clearInterval(interval); // Cleanup interval on unmount
        },[open]);
    
    const column = [
        { field: "category", headerName: "Category", width: 180},
        { field: "type", headerName: "Type", width: 180},
        { field: "amount", headerName: "Amount", width: 180 },
        { field: "description", headerName: "Description", width: 180 },
        { field: "group_name", headerName: "Group", width: 180 },
        {
          field: "payment_date",
          headerName: "Date",
          width: 180,
          renderCell: (params) => {
            const date = new Date(params.value);
            return date.toLocaleDateString("en-GB");
          },
        },
        {
          field: "edit",
          headerName: "Actions",
          width: 120,
          sortable: false,
          renderCell: (params) => 
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEditClick(params.row)}
              sx={{width:"10vh"}}
            >
              Edit
            </Button>
        },
      ];

  return (
    <Box
    sx={{
        height:400,
        width:"100%"
    }}
    >
        <Typography
        variant='h3'
        component='h3'
        sx={{textAlign:"center", mt:3, mb:3}}
        >User Expenses
        </Typography>
        <DataGrid
        columns={column}
        disableColumnMenu
        disableColumnSelector  
        rows={rows}
        initialState={{
            pagination:{
                paginationModel:{pageSize:5}
            }
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        slots={{toolbar:GridToolbar}}
        slotProps={{
            toolbar:{showQuickFilter:true}
        }}
        sx={{
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              visibility: 'visible !important', // Ensure the title is always visible
            },
            '& .MuiDataGrid-iconButtonContainer': {
              visibility: 'hidden',
            },
            '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-iconButtonContainer': {
              visibility: 'hidden',
            },
          }}
        />
    </Box>
  )
}

export default ExpenseTable
