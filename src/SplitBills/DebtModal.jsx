import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { domain, APIauth } from "../Constants/Constants.js";

export default function DebtModal({ open, handleClose, selectedGroup }) {
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open && selectedGroup) {
            fetch(`${domain}/exp/simplify-debts/${selectedGroup.group_id}/`, APIauth({ req: "GET" }))
                .then((res) => res.json())
                .then((data) => {
                    setDebts(data.simplified_debts || []);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching simplified debts:", err);
                    setLoading(false);
                });
        }
    }, [open, selectedGroup]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ padding: 3, height: "50vh", backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", overflowY: "scroll", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Simplified Debts</Typography>
                {loading ? (
                    <CircularProgress />
                ) : debts.length > 0 ? (
                    <List>
                        {debts.map((debt, index) => (
                            <ListItem key={index} divider>
                                <ListItemText primary={`${debt.debtor} owes ₹${debt.amount} to ${debt.creditor}`} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No simplified debts available.</Typography>
                )}
            </Box>
        </Modal>
    );
}
