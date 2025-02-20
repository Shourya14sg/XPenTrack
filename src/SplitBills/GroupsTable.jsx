import React, { useEffect, useState } from "react";
import CreateGroupModal from "./CreateGroup.jsx";
import {
    List, ListItem, ListItemIcon, ListItemText, Button, Collapse, Modal,
    Box, Typography, ListSubheader, ListItemButton
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { domain } from "../Constants/Constants";

export default function GroupList() {
    const [groups, setGroups] = useState([]);  // Store groups
    const [openGroups, setOpenGroups] = useState({}); // Track expanded groups
    const [transactions, setTransactions] = useState({}); // Store transactions
    const [selectedGroup, setSelectedGroup] = useState(null); // Store selected group
    const [openModal, setOpenModal] = useState(false); // Track modal state
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

    // Get user data
    const thisuserid = JSON.parse(sessionStorage.getItem('user_data'));

    // Function to refresh groups list
    const fetchGroups = () => {
        fetch(`${domain}/group/groups/user/${thisuserid.user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${thisuserid.access}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setGroups(data))
            .catch((err) => console.error("Error fetching groups:", err));
    };

    // Initial fetch and refresh when trigger changes
    useEffect(() => {
        fetchGroups();
    }, [refreshTrigger]);

    // Handler for when a new group is created
    const handleGroupCreated = () => {
        // Trigger a refresh of the groups list
        setRefreshTrigger(prev => prev + 1);
    };

    const handleGroupHistoryClick = async (group) => {
        if (!transactions[group.group_id]) {
            try {
                const res = await fetch(`${domain}exp/expense/expenses/group-expenses/${group.group_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${thisuserid.access}`,
                    },
                });
                const data = await res.json();

                const expenses = Array.isArray(data.expenses) ? data.expenses : [];

                setTransactions((prev) => ({
                    ...prev,
                    [group.group_id]: expenses,
                }));
            } catch (error) {
                console.error(`Error fetching transactions for group ${group.group_id}:`, error);
                setTransactions((prev) => ({
                    ...prev,
                    [group.group_id]: [],
                }));
            }
        }

        setSelectedGroup(group);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedGroup(null);
    };

    return (
        <>
        <CreateGroupModal setGroups={setGroups} onGroupCreated={handleGroupCreated} />
        <List
            sx={{ width: "100%", maxWidth: 800, bgcolor: "background.paper"}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="h2" id="nested-list-subheader">
                    Groups & Members
                </ListSubheader>
            }
        >
            {groups?.length > 0 ? (groups.map((group) => (
                <React.Fragment key={group.group_id}>
                    <ListItem>
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary={group.group_name} />
                        <Button onClick={() => handleGroupHistoryClick(group)}>History</Button>
                        <Button onClick={() => setOpenGroups((prev) => ({ ...prev, [group.group_id]: !prev[group.group_id] }))}>
                            {openGroups[group.group_id] ? <ExpandLess /> : <ExpandMore />}
                        </Button>
                    </ListItem>

                    {/* Show members when expanded */}
                    <Collapse in={openGroups[group.group_id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {group.members && group.members.length > 0 ? (
                                group.members.map((member) => (
                                    <ListItemButton key={member.user_id} sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={member.username} />
                                    </ListItemButton>
                                ))
                            ) : (
                                <ListItemText sx={{ pl: 4, fontStyle: "italic" }} primary="No members available" />
                            )}
                        </List>
                    </Collapse>
                </React.Fragment>
            ))) : (
                <Typography sx={{ textAlign: "center", marginTop: 2 }}>No groups available</Typography>
            )}

            {/* Transaction History Modal */}
            <Modal open={openModal} onClose={handleClose}>
                <Box sx={{ padding: 3, height:"40vh", backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", overflowY:"scroll" }}>
                    <Typography variant="h6">{selectedGroup?.group_name} - Transaction History</Typography>

                    {selectedGroup && transactions[selectedGroup.group_id]?.length > 0 ? (
                        <List>
                            {transactions[selectedGroup.group_id].map((expense) => (
                                <ListItem key={expense.expense_id} divider>
                                    <ListItemText
                                        primary={`${expense.category} - ₹${expense.amount}`}
                                        secondary={expense.description}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No transactions found.</Typography>
                    )}
                </Box>
            </Modal>
        </List>
        </>
    );
}