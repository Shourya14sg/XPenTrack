import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { domain } from "../Constants/Constants";

const EditExpenseModal = ({ open, handleClose, expense, onSave }) => {
    const [formData, setFormData] = useState({
        id: "",
        type: "",
        owner: "",
        group: "",
        amount: "",
        category: "",
        description: "",
        status: "",
    });

    useEffect(() => {
        if (expense) {
            setFormData({
                id: expense.id || "",
                type: expense.type || "",
                owner: expense.owner || "",
                group: expense.group || "",
                amount: expense.amount || "",
                category: expense.category || "",
                description: expense.description || "",
                status: "Paid",
            });
        }
    }, [expense]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const User_data = JSON.parse(sessionStorage.getItem("user_data"));
    const accessToken = User_data ? User_data.access : null;
    const handleSubmit = async () => {
        try {
            await axios.put(`${domain}/exp/expense/expenses/${formData.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            });

            onSave(formData); // Update UI after successful save
            handleClose(); // Close modal
        } catch (error) {
            console.error("Error updating expense:", error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: 400, bgcolor: "white", boxShadow: 24, p: 3, borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom>Edit Expense</Typography>

                <TextField
                    fullWidth margin="normal" label="Amount" name="amount" type="number"
                    value={formData.amount} onChange={handleChange}
                />

                <TextField
                    fullWidth margin="normal" label="Category" name="category"
                    value={formData.category} onChange={handleChange}
                />

                <TextField
                    fullWidth margin="normal" label="Description" name="description"
                    value={formData.description} onChange={handleChange}
                />

                {/* <TextField
                    fullWidth margin="normal" select label="Status" name="status"
                    value={formData.status} onChange={handleChange}
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                </TextField> */}

                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
                    <Button variant="outlined" color="primary" onClick={handleClose} sx={{ width: "6rem" }}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ width: "6rem" }}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditExpenseModal;
