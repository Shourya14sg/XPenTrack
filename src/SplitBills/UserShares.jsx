import React from "react";
import { Alert } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { domain } from "../Constants/Constants";


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
