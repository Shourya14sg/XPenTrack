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
import TransactionUserModal from "./UserShares.jsx";
import { domain } from "../Constants/Constants.js";

export default function SplitBills() {
    const [groups, setGroups] = useState([]);  // Store groups
    const [openGroups, setOpenGroups] = useState({}); // Track expanded groups
    const [transactions, setTransactions] = useState({}); // Store transactions
    const [selectedGroup, setSelectedGroup] = useState(null); // Store selected group
    const [selectedTransaction, setSelectedTransaction] = useState(null); // Store selected transaction
    const [openModal, setOpenModal] = useState(false); // Track modal state
    const [openUserModal, setOpenUserModal] = useState(false); // Track user modal state
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

    const thisuserid = JSON.parse(sessionStorage.getItem("user_data"));

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

    useEffect(() => {
        fetchGroups();
    }, [refreshTrigger]);

    const handleGroupCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const fetchTransactions = async (group) => {
        try {
            const res = await fetch(`${domain}/exp/expense/expenses/group-expenses/${group.group_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${thisuserid.access}`,
                },
            });
            const data = await res.json();
            setTransactions((prev) => ({
                ...prev,
                [group.group_id]: data.expenses || [],
            }));
        } catch (error) {
            console.error(`Error fetching transactions for group ${group.group_id}:`, error);
        }
    };

    const handleGroupHistoryClick = (group) => {
        fetchTransactions(group);
        setSelectedGroup(group);
        setOpenModal(true);
    };

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
        setOpenUserModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setOpenUserModal(false);
        setSelectedGroup(null);
        setSelectedTransaction(null);
    };

    const handleUserClose = () => {
        setOpenUserModal(false);
    }
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

                <Modal open={openModal} onClose={handleClose}>
                    <Box sx={{ padding: 3, height:"60vh", backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", overflowY:"scroll" }}>
                        <Typography variant="h6">{selectedGroup?.group_name} - Transaction History</Typography>

                        {selectedGroup && transactions[selectedGroup.group_id]?.length > 0 ? (
                            <List>
                                {transactions[selectedGroup.group_id].map((expense) => (
                                    <ListItem key={expense.expense_id} divider>
                                        <ListItemButton onClick={() => handleTransactionClick(expense)}>
                                            <ListItemText primary={`${expense.category} - ₹${expense.amount} - ${expense.description}`} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No transactions found.</Typography>
                        )}
                    </Box>
                </Modal>

                <TransactionUserModal open={openUserModal} handleClose={handleUserClose} selectedTransaction={selectedTransaction} refreshTransactions={() => fetchTransactions(selectedGroup)} />
            </List>
        </>
    );
}
