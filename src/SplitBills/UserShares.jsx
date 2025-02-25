import React, { useState } from "react";
import axios from "axios";
import { Modal, Box, Typography, List, ListItem, ListItemText, Button, Alert } from "@mui/material";

export default function TransactionUserModal({ open, handleClose, selectedTransaction, refreshTransactions }) {
    const thisuserid = JSON.parse(sessionStorage.getItem("user_data"));
    const [error, setError] = useState(null);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ padding: 3, height: "40vh", backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", overflowY: "scroll" }}>
                <Typography variant="h6">User Transactions</Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {selectedTransaction ? (
                    <List>
                        {selectedTransaction.splits.map((user) => (
                            <ListItem key={user.user_id} divider>
                                <ListItemText primary={`${thisuserid.user.id === user.user_id ? "You" : user.username} - ₹${user.amount}`} secondary={`Status: ${user.status}`} />
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
