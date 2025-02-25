import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import { domain } from "../Constants/Constants";

export default function CreateGroupModal({ setGroups, onGroupCreated }) {
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const temp = JSON.parse(sessionStorage.getItem("user_data"));

    // Fetch user ID from email
    const fetchUserId = async (email) => {
        try {
            const token = temp?.access;
            if (!token) {
                setError("User not authenticated.");
                return;
            }
            const response = await axios.get(`${domain}/users/get-user-by-email/`, {
                params: { email },
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data?.user_id) {
                setUsers((prev) =>
                    prev.some(user => user.user_id === response.data.user_id) ? prev : [...prev, response.data]
                );
                setUserEmail("");
                setError("");
            } else {
                setError("User not found.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch user.");
        }
    };

    // Reset form
    const resetForm = () => {
        setGroupName("");
        setUsers([]);
        setUserEmail("");
        setError("");
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!groupName || users.length === 0) {
            setError("Please provide a group name and add at least one user.");
            return;
        }

        const payload = {
            name: groupName,
            created_by: temp?.user?.id,
            groupmemberName: users.map(user => ({ userId: user.user_id })),
        };

        try {
            const response = await axios.post(`${domain}/group/groups/`, payload, {
                headers: { "Content-Type": "application/json" }
            });

            setGroups((prevGroups) => [...prevGroups, response.data]);
            if (onGroupCreated) onGroupCreated();

            alert("Group created successfully!");
            resetForm();
            setOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create group.");
        }
    };

    return (
        <div style={{ margin: "2rem auto 2rem 5rem" }}>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Create New Group
            </Button>

            <Modal 
                open={open} 
                onClose={() => {
                    setOpen(false);
                    resetForm();
                }}
            >
                <Box sx={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    width: 400, bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 3
                }}>
                    <Typography variant="h6">Create New Group</Typography>
                    
                    <TextField
                        fullWidth
                        label="Group Name"
                        variant="outlined"
                        margin="normal"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    
                    <TextField
                        fullWidth
                        label="Enter User Email"
                        variant="outlined"
                        margin="normal"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && fetchUserId(userEmail)}
                    />
                    <Button onClick={() => fetchUserId(userEmail)} variant="contained" sx={{ mt: 1 }}>
                        Add User
                    </Button>

                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    
                    <List sx={{ mt: 2 }}>
                        {users.map((user) => (
                            <ListItem key={user.user_id} secondaryAction={
                                <IconButton edge="end" onClick={() => setUsers(users.filter(u => u.user_id !== user.user_id))}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={user.username}/>
                            </ListItem>
                        ))}
                    </List>
                    
                    <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
                        Create Group
                    </Button>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        sx={{ mt: 1 }} 
                        onClick={() => {
                            setOpen(false);
                            resetForm();
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
