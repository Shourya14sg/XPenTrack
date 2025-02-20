import React, { useState } from "react";
import {
    TextField, Button, Box, Typography, List, ListItem,
    ListItemText, IconButton, Modal
} from "@mui/material";
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
            const token = temp.access;
            if (!token) {
                setError("User not authenticated.");
                return;
            }
            const res = await fetch(`${domain}/users/get-user-by-email/?email=${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (res.status === 401) {
                setError("Unauthorized access. Please log in again.");
                return;
            }
            if (!res.ok) {
                throw new Error("Failed to fetch user");
            }
            const data = await res.json();
            if (data?.user_id) {
                setUsers((prev) =>
                    prev.some(user => user.user_id === data.user_id) ? prev : [...prev, data]
                );
                setUserEmail("");
                setError("");
            } else {
                setError("User not found.");
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("Failed to fetch user.");
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
            created_by: temp.user.id,
            groupmemberName: users.map(user => ({ userId: user.user_id })),
        };

        try {
            const res = await fetch(`${domain}/group/groups/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const newGroup = await res.json();
                
                // Update the groups state directly
                setGroups((prevGroups) => [...prevGroups, newGroup]);
                
                // Notify parent component that a group was created
                if (onGroupCreated) {
                    onGroupCreated();
                }
                
                alert("Group created successfully!");
                resetForm();
                setOpen(false);
            } else {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || "Failed to create group.");
            }
        } catch (err) {
            console.error("Error creating group:", err);
            setError("Something went wrong.");
        }
    };

    return (
        <div style={{ margin: "5rem auto 2rem 5rem" }}>
            {/* Button to Open Modal */}
            <Button variant="contained" onClick={() => setOpen(true)}>
                Create New Group
            </Button>

            {/* Modal for Group Creation */}
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

                    {/* Group Name Input */}
                    <TextField
                        fullWidth
                        label="Group Name"
                        variant="outlined"
                        margin="normal"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />

                    {/* User Email Input */}
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

                    {/* Error Message */}
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}

                    {/* List of Added Users */}
                    <List sx={{ mt: 2 }}>
                        {users.map((user) => (
                            <ListItem key={user.user_id} secondaryAction={
                                <IconButton edge="end" onClick={() => setUsers(users.filter(u => u.user_id !== user.user_id))}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={user.username} secondary={user.user_id} />
                            </ListItem>
                        ))}
                    </List>

                    {/* Submit & Close Buttons */}
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