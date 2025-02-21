import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { domain } from '../Constants/Constants';
import axios from 'axios';
import { Button, Modal } from '@mui/material';
import EditExpenseModal from './EditExpenses.jsx';


function ExpenseTable({open}) {
  const [rows, setRows] = useState([]); // Store data in state
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectexp, setSelectExp] = useState(null)


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

  const handleSave = (updatedexp) => {
    setRows((prevRows) =>
        prevRows.map(row => 
            row.id === updatedexp.id 
            ? { 
                ...updatedexp, 
                group_name: updatedexp.group_name || row.group_name,
                payment_date: updatedexp.payment_date ? new Date(updatedexp.payment_date).toISOString() : row.payment_date
              }
            : row
        )
    );
}


  const handleEditClick = (expense) => {
    console.log("Edit clicked for:", expense);
    setSelectExp(expense);
    setOpenModal(true);
    
  };

  const column = [
    { field: "category", headerName: "Category", width: 180},
    { field: "type", headerName: "Type", width: 180 },
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

//   const onFilterChange = React.useCallback((filterModel) => {
//     // Here you save the data you need from the filter model
//     setQueryOptions({ filterModel: { ...filterModel } });
//   }, []);

//   const { isLoading, rows } = useQuery(queryOptions);

  return (

    <div style={{ height: 'full', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={column}
        filterMode="client"
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
      <EditExpenseModal open={openModal} handleClose={() => {setOpenModal(false)}} expense={selectexp} onSave={handleSave}/>
    </div>
  );
}


export default ExpenseTable
