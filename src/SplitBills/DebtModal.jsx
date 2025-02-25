import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";
import { domain, APIauth } from "../Constants/Constants.js";

export default function DebtModal({ open, handleClose, selectedGroup }) {
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDebts = async () => {
            if (open && selectedGroup) {
                setLoading(true);
                setError("");
                try {
                    const response = await axios.get(`${domain}/exp/simplify-debts/${selectedGroup.group_id}/`, APIauth());
                    setDebts(response.data.simplified_debts || []);
                } catch (err) {
                    console.error("Error fetching simplified debts:", err);
                    setError(err.response?.data?.message || "Failed to fetch debts. Please try again.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDebts();
    }, [open, selectedGroup]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ padding: 3, height: "50vh", backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", overflowY: "scroll", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Simplified Debts</Typography>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
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
