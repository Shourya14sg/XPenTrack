import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { domain } from "../../Constants/Constants";
import ListItemButton from "@mui/material/ListItemButton";
import { ConfirmGroupDialog } from "./ConfirmGroupDialog";
const dummyGroups = [
  {
    groupID: 1,
    groupName: "Family Expenses",
    members: ["Alice", "Bob", "Charlie", "David", "Emma"],
  },
  {
    groupID: 2,
    groupName: "Office Lunch",
    members: ["John", "Michael", "Sarah"],
  },
  {
    groupID: 3,
    groupName: "Weekend Trip",
    members: ["Emma", "Olivia", "Liam", "Noah", "Sophia", "James"],
  },
  {
    groupID: 4,
    groupName: "Gym Buddies",
    members: ["Ava", "Ethan", "Lucas"],
  },
  {
    groupID: 5,
    groupName: "Roommates",
    members: ["Jake", "Emily", "Ryan", "Sophia"],
  },
];

export const SelectGroupDialog = ({
  open,
  setOpen,
  setGroup,
  expense,
  setExpense,
}) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  /*
  useEffect(() => {
    if (selectedGroup) {
      const totalMembers = selectedGroup.members.length;
      const defaultShare = (expense.amount / totalMembers).toFixed(2);
      const initialShares = Object.fromEntries(
        selectedGroup.members.map((member) => [member, parseFloat(defaultShare)])
      );
      setMemberShares(initialShares);
      setTotalShare(expense.amount);
    }
  }, [selectedGroup, expense.amount]);*/
  useEffect(() => {
    async function fetchGroups() {
      if (open) {
        try {
          const User_data = JSON.parse(sessionStorage.getItem("user_data"));
          const userID = User_data ? User_data.user.id : null;
          const accessToken = User_data ? User_data.access : null;

          const response = await axios.get(`${domain}/group/groups`, {
            params: { userID }, // Pass userID as query param
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json", // Ensure correct content type
            },
          });

          if (Array.isArray(response.data)) {
            setGroups(response.data); // Ensure only setting array data
            console.log("Fetched Groups:", response.data);
          } else {
            console.error("Invalid data format:", response.data);
            setGroups([]); // Set empty array in case of error
          }
        } catch (error) {
          console.error("Error fetching groups:", error);
          setGroups([]); // Set empty array in case of error
        }
      }
    }

    fetchGroups();
  }, [open]);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = () => {
    setConfirmDialogOpen(false);
    setOpen(false);
    //  alert(`Total share must equal the expense amount (${expense.amount})`);
  };
  const handleCancel = () => {
    setOpen(false);
    setGroup(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select a Group</DialogTitle>
        <DialogContent>
          <List className="max-h-60 overflow-y-auto">
            {groups.map((group) => {
              const groupName = group.name; // Fix for group name
              const members = group.members.map((m) => m.user); // Extract user names
              const displayedMembers = members.slice(0, 3).join(", ");
              const moreCount = members.length - 3;

              return (
                <ListItem key={group.id} disablePadding>
                  {" "}
                  {/* Use `id` for key */}
                  <ListItemButton onClick={() => handleSelectGroup(group)}>
                    <ListItemText
                      primary={groupName}
                      secondary={
                        moreCount > 0
                          ? `${displayedMembers}, +${moreCount} more`
                          : displayedMembers
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Group Selection Dialog */}
      {selectedGroup && (
        <ConfirmGroupDialog
          open={confirmDialogOpen}
          setOpen={setConfirmDialogOpen}
          selectedGroup={selectedGroup}
          setGroup={setGroup}
          expense={expense}
          setExpense={setExpense}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};
