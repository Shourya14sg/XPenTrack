import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { domain, APIauth } from "../Constants/Constants.js";

export default function AddMemberModal({ open, handleClose, selectedGroup, refreshGroups }) {
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [error, setError] = useState("");

    const fetchUserId = async () => {
        try {
            const res = await fetch(`${domain}/users/get-user-by-email/?email=${email}`, APIauth({ req: "GET" }));
            const data = await res.json();
            if (res.ok && data?.user_id) {
                setUserId(data.user_id);
                setUserName(data.username)
                setError("");
            } else {
                setError("User not found");
            }
        } catch (err) {
            setError("Error fetching user");
        }
    };

    const handleAddMember = async () => {
        if (!userId) {
            setError("No user selected");
            return;
        }
        try {
            const res = await fetch(`${domain}/group/group-members/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("user_data")).access}`,
                },
                body: JSON.stringify({ group: selectedGroup.group_id, user: userId }),
            });
            if (res.ok) {
                setEmail("");
                setUserId(null);
                refreshGroups();
                handleClose();
            } else {
                setError("Failed to add member");
            }
        } catch (err) {
            setError("Error adding user");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ padding: 3, backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", borderRadius: 2 }}>
                <Typography variant="h6">Add Member to {selectedGroup?.group_name}</Typography>
                <TextField 
                    fullWidth 
                    label="Enter Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    sx={{ marginTop: 2 }}
                />
                {userId && <Typography>UserName: {userName}</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                <Button onClick={fetchUserId} sx={{ margin: 2, width:"10rem" }} variant="outlined">Search User</Button>
                <Button onClick={handleAddMember} sx={{ margin: 2, width:"10rem" }} variant="contained">Add User</Button>
            </Box>
        </Modal>
    );
}
