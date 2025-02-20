import React, { useEffect, useState } from 'react'
import expensedata from '../Constants/Expensedatatemp.json';
import { DataGrid } from '@mui/x-data-grid';
import { domain } from '../Constants/Constants';
import axios from 'axios';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { TablePagination } from '@mui/material';


// const columns = [
//     { id: 'description', label: 'Description', minWidth: 170 },
//     { id: 'type', label: 'Type', minWidth: 100 },
//     {
//       id: 'category',
//       label: 'Category',
//       minWidth: 170,
//       align: 'right',
//     },
//     {
//       id: 'group',
//       label: 'Group',
//       minWidth: 170,
//       align: 'right',
//     },
//     {
//       id: 'date',
//       label: 'Date',
//       minWidth: 170,
//       align: 'right',
//     },
//     {
//       id: 'amount',
//       label: 'Amount',
//       minWidth: 170,
//       align: 'right',
//       format: (value) => value.toFixed(2),
//     },
//   ];
  
//   function createData(description, type, category, group, date, amount) {
//     return { description, type, category, group, date, amount };
//   }

// const rows = expensedata //data from json file

// function CustomizedTables() {

//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     return (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align}
//                   style={{ minWidth: column.minWidth }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row) => {
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       return (
//                         <TableCell key={column.id} align={column.align}>
//                           {column.format && typeof value === 'number'
//                             ? column.format(value)
//                             : value}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//     );
// }
// import { createFakeServer } from '@mui/x-data-grid-generator';

// const { useQuery, ...data } = createFakeServer();


function ServerFilterGrid() {
//   const [queryOptions, setQueryOptions] = React.useState({});
const [rows, setRows] = useState([]); // Store data in state
  const [loading, setLoading] = useState(true);
  const [data, setExpensedata] = useState();
  
  const fetchExpenseData = async () => {
    try {
      const User_data=JSON.parse(sessionStorage.getItem("user_data"));
      const userID=User_data? User_data.user.id:null;
      const accessToken=User_data? User_data.access:null;    
      const response = await axios.get(`${domain}/exp/expense/expenses`,{
        params: { userID }, // Pass userID as query param
        headers: {
          Authorization: `Bearer ${accessToken}`,

          'Content-Type': 'application/json', // Ensure correct content type
        },
      }); // Replace with your actual API endpoint
      const newExpensedata = Array.isArray(response.data) ? response.data : [];
      setExpensedata(newExpensedata);
      setRows(data); // Set data from JSON file
    } catch (error) {
      console.error('Error fetching Expense Data:', error);
      setExpensedata([]); // Set to empty array on error

    }
    finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExpenseData(); // Initial fetch
    const interval = setInterval(() => {
      fetchExpenseData();
    }, 120000); // 2 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);


  /*
  useEffect(() => {
    // Simulating API call delay
    setTimeout(() => {
      setRows(expensedata); // Set data from JSON file
      setLoading(false);
    }, 1000);
  }, []);
*/
  const column = [
    { field: "description", headerName: "Description", width: 200 },
    { field: "type", headerName: "Type", width: 200 },
    { field: "group", headerName: "Group", width: 200 },
    { field: "category", headerName: "Category", width: 200 },
    { field: "payment_date", headerName: "Date", width: 200 },
    { field: "amount", headerName: "Amount", width: 200 },
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
    </div>
  );
}

const ExpenseTable = () => {
    return (
        <div>
            <ServerFilterGrid />
        </div>
    )
}

export default ExpenseTable
