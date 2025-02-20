import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import { domain } from "../../Constants/Constants";
import { ConfirmGroupDialog } from "./ConfirmGroupDialog";

export const SelectGroupDialog = ({ open, setOpen, setGroup, expense, setExpense }) => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchGroups() {
      if (open) {
        setLoading(true);
        try {
          const User_data = JSON.parse(sessionStorage.getItem("user_data"));
          const userID = User_data?.user?.id;
          const accessToken = User_data?.access;

          const response = await axios.get(`${domain}/group/groups/user/${userID}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (Array.isArray(response.data)) {
            setGroups(response.data);
            console.log(groups)
          } else {
            console.error("Invalid data format:", response.data);
            setGroups([]);
          }
        } catch (error) {
          console.error("Error fetching groups:", error);
          setGroups([]);
        } finally {
          setLoading(false);
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
  };

  const handleCancel = () => {
    setOpen(false);
    setGroup(null);
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Group</DialogTitle>
        <DialogContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading groups...</p>
          ) : groups.length === 0 ? (
            <p className="text-center text-gray-500">No Groups Available</p>
          ) : (
            <List className="max-h-60 overflow-y-auto">
              {groups.map((group) => {
                const groupName = group.group_name; // Use correct field
                const members = group.members.map((m) => m.username); // Extract usernames
                const displayedMembers = members.slice(0, 3).join(", ");
                const moreCount = members.length > 3 ? `, +${members.length - 3} more` : "";

                return (
                  <ListItem key={group.group_id} disablePadding>
                    <ListItemButton onClick={() => handleSelectGroup(group)}>
                      <ListItemText primary={groupName} secondary={`${displayedMembers}${moreCount}`} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
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
