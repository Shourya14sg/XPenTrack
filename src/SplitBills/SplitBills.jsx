import React, { Fragment, useEffect, useState } from "react";
import CreateGroupModal from "./CreateGroup.jsx";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import TransactionUserModal from "./UserShares.jsx";
import { domain, APIauth } from "../Constants/Constants.js";
import { Delete } from "@mui/icons-material";
import AddMemberModal from "./AddMember.jsx";
import DebtModal from "./DebtModal.jsx";

export default function SplitBills() {
    const [groups, setGroups] = useState([]);
    const [openGroups, setOpenGroups] = useState({}); 
    const [transactions, setTransactions] = useState({}); 
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null); 
    const [openModal, setOpenModal] = useState(false); 
    const [openUserModal, setOpenUserModal] = useState(false); 
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    const [openDebtModal, setOpenDebtModal] = useState(false);


    const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
    const [selectedGroupForAdding, setSelectedGroupForAdding] = useState(null);

    const thisuserid = JSON.parse(sessionStorage.getItem("user_data"));

    const fetchGroups = () => {
        fetch(`${domain}/group/groups/user/${thisuserid.user.id}`, APIauth({ req: "GET" }))
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
            const res = await fetch(`${domain}/exp/expense/expenses/group-expenses/${group.group_id}`, APIauth({ req: "GET" }));
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

    const handleDeleteUser = async (deleteuserid, groupid) => {
        try {
            const res = await fetch(`${domain}/group/group-members/${deleteuserid}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${thisuserid.access}`,
                },
            });
            if (res.ok) {
                setGroups(prevGroups => {
                    return prevGroups
                        .map(group => {
                            if (group.group_id === groupid) {
                                const updatedMembers = group.members.filter(member => member.group_member_id !== deleteuserid);
                                // If no members left, remove the group
                                if (updatedMembers.length === 0) {
                                    return null; // Mark for removal
                                }
                                return { ...group, members: updatedMembers };
                            }
                            return group;
                        })
                        .filter(group => group !== null); // Remove empty groups
                });
            }
            else {
                console.error("Failed to delete user:", await res.json());
            }
        }
        catch (e) { console.error("Error Deleting User:", e); }
    };

    const handleOpenAddMemberModal = (group) => {
        setSelectedGroupForAdding(group);
        setOpenAddMemberModal(true);
    };

    const handleCloseAddMemberModal = () => {
        setOpenAddMemberModal(false);
        setSelectedGroupForAdding(null);
    };

    const handleOpenDebtModal = (group) => {
        setSelectedGroupForAdding(group);
        setOpenDebtModal(true);
    };
    
    const handleCloseDebtModal = () => {
        setOpenDebtModal(false);
    };
    

    const handleUserClose = () => {
        setOpenUserModal(false);
    }
    return (
        <>
            <CreateGroupModal setGroups={setGroups} onGroupCreated={handleGroupCreated} />
            <List
                sx={{ width: "100%", maxWidth: 800, bgcolor: "background.paper" }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="h2" id="nested-list-subheader">
                        Groups & Members
                    </ListSubheader>
                }
            >
                {groups?.length > 0 ? (groups.map((group) => (
                    <Fragment key={group.group_id}>
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
                                            <ListItemIcon>
                                                {group.owner === thisuserid.user.id ? <Delete onClick={() => handleDeleteUser(member.group_member_id, group.group_id)} /> : null}
                                            </ListItemIcon>
                                        </ListItemButton>
                                    ))
                                ) : (
                                    <ListItemText sx={{ pl: 4, fontStyle: "italic" }} primary="No members available" />
                                )}
                                <ListItem>
                                <ListItemButton onClick={() => handleOpenAddMemberModal(group)}>
                                    <ListItemText sx={{ color: "#0000FF" }} primary="+Add Member" />
                                </ListItemButton>
                                <ListItemButton onClick={() => handleOpenDebtModal(group)}>
                                    <ListItemText sx={{ color: "#0000FF" }} primary="Simplify Debt" />
                                </ListItemButton>
                                </ListItem>
                            </List>
                        </Collapse>
                    </Fragment>
                ))) : (
                    <Typography sx={{ textAlign: "center", marginTop: 2 }}>No groups available</Typography>
                )}

                <Modal open={openModal} onClose={handleClose}>
                    <Box sx={{ padding: 3, height: "60vh", backgroundColor: "white", maxWidth: 500, margin: "auto", marginTop: "10%", overflowY: "scroll" }}>
                        <Typography variant="h6">{selectedGroup?.group_name} - Transaction History</Typography>

                        {selectedGroup && transactions[selectedGroup.group_id]?.length > 0 ? (
                            <List>
                                {transactions[selectedGroup.group_id].map((expense) => (
                                    <ListItem key={expense.expense_id} divider>
                                        <ListItemButton onClick={() => handleTransactionClick(expense)}>
                                            <ListItemText
                                                primary={`${expense.category} - ₹${expense.amount} - ${expense.description}`}
                                                secondary={`Paid By - ${expense.owner}`}
                                            />
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
                <AddMemberModal
                    open={openAddMemberModal}
                    handleClose={handleCloseAddMemberModal}
                    selectedGroup={selectedGroupForAdding}
                    refreshGroups={() => setRefreshTrigger(prev => prev + 1)}
                />
                <DebtModal open={openDebtModal} handleClose={handleCloseDebtModal} selectedGroup={selectedGroupForAdding} />
            </List>
        </>
    );
}
