import React from "react";
import { Modal, Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { domain } from "../Constants/Constants";

export default function TransactionUserModal({ open, handleClose, selectedTransaction, refreshTransactions }) {
    const thisuserid = JSON.parse(sessionStorage.getItem("user_data"));

    const handleStatusUpdate = async (userId, expenseId) => {
        try {
            await fetch(`${domain}/exp/expense/update-user-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${thisuserid.access}`,
                },
                body: JSON.stringify({ user_id: userId, expense_id: expenseId, status: "completed" }),
            });
            refreshTransactions(); // Refresh transaction list after update
        } catch (error) {
            console.error("Error updating transaction status:", error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ padding: 3, height: "40vh", backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", overflowY: "scroll" }}>
                <Typography variant="h6">User Transactions</Typography>

                {selectedTransaction ? (
                    <List>
                        {selectedTransaction.splits.map((user) => (
                            <ListItem key={user.user_id} divider>
                                <ListItemText primary={`${thisuserid.user.id===user.user_id? "You": user.username} - ₹${user.amount}`} secondary={`Status: ${user.status}`} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No user data available.</Typography>
                )}
                <Button onClick={handleClose}>Close</Button>
            </Box>
        </Modal>
    );
}
