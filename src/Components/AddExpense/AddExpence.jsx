import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { expenseCategories } from "../../Constants/Constants";
import {domain} from '../../Constants/Constants'
import {SelectGroupDialog} from '../SelectGroup/SelectGroupDailog'

const dummyexpence={
    title: "",
    amount: 0,
    category: "",
    description: "",
    date:"",
    type:"personal",
  };
export const AddExpence = ({ open, setOpen }) => {
    const [expense, setExpense] = useState(dummyexpence);
    const [group,setGroup]=useState(null)
    const [groupDialogOpen, setGroupDialogOpen] = useState(false);
    const User = JSON.parse(sessionStorage.getItem("user_data"));

 const handleConfirm =async () => {
    let {title,amount,category}=expense;
    if(title==""||amount==0||category=="") return;
    const accessToken=User?User.access:null;
    const userId = User ? User.user.id : null; // Extract userId safely
    //if(token==null) return
    const updatedExpense={
        ...expense,
        owner:userId,
        ...(group !== null && { type:"group" })
    }
    console.log("Submitted:", updatedExpense);
    try {
        await axios.post(`${domain}/exp/expense/expenses/`, updatedExpense,{
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json', // Ensure correct content type
            },
        });
        setOpen(false); // Close only after successful submission
        setExpense(dummyexpence); // Reset form
        setGroup(null);
      } catch (error) {
        console.error("Error submitting expense:", error);
      }
  };
  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };
   


  return (
    <>
    <Dialog open={open} onClose={()=>setOpen(false)}>
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-3 mt-2 gap-y-4 gap-x-4 ">
          <TextField
            autoFocus
            label="Title"
            fullWidth
            variant="outlined"
            name="title"
            value={expense.title}
            onChange={handleChange}
            className="col-span-2"
          />
            <TextField
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              name="amount"
              value={expense.amount>=0&&expense.amount<Math.pow(10,8)?expense.amount:0}
              onChange={handleChange}
            />

          {/* Category Select Dropdown */}
          <div>
            <FormControl fullWidth>
              <InputLabel>Type of Expense</InputLabel>
              <Select
                value={expense.category}
                onChange={handleChange}
                name="category"
              >
                {expenseCategories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Description Field */}
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              name="description"
              value={expense.description}
              onChange={handleChange}
              className="col-span-2"
            />

          {/* Add User & Group Buttons */}
          <div className={(expense.amount<=0 || expense.title=="")?'hidden':"flex items-center gap-2 cursor-pointer "}
                onClick={()=>setGroupDialogOpen(true)}>
              <AddCircleOutlineIcon  color="primary"  />
            <span >Add Group</span>
            {group && <span className="text-sm text-gray-500 ml-2">({group.group_name})</span>}
          </div>
        </div>
      </DialogContent>
      <DialogActions >
        <Button onClick={()=>setOpen(false)} color="error">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    <SelectGroupDialog open={groupDialogOpen} setOpen={setGroupDialogOpen} group={group} setGroup={setGroup} expense={expense} setExpense={setExpense}/>
      
    </>
  );
};
