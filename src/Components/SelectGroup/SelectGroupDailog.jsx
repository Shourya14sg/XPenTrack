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

export const SelectGroupDialog = ({ open, setOpen, setGroup }) => {
  const [groups, setGroups] = useState([...dummyGroups]);

  /*
  useEffect(() => {
    if (open) {
      //try{
      axios.get(`${domain}/user/groups`)
        .then((response) => setGroups([...response.data]))
        .catch((error) => console.error("Error fetching groups:", error));
    //}catch{}
  }
  }, [open]);//*/

  const handleSelectGroup = (group) => {
    setGroup(group);
    
   // setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Select a Group</DialogTitle>
      <DialogContent>
        <List className="max-h-60 overflow-y-auto">
          {groups.map((group) => {
            const members = group.members.slice(0, 3).join(", ");
            const moreCount = group.members.length - 3;
            return (
              <ListItem key={group.groupID} disablePadding>
                <ListItemButton onClick={() => handleSelectGroup(group)}>
                  <ListItemText
                    primary={group.groupName}
                    secondary={
                      moreCount > 0 ? `${members}, +${moreCount} more` : members
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
//*/

/*
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const groupOptions = ["Family", "Friends", "Work", "Roommates", "Others"];

export const SelectGroupDialog = ({ open, onClose, onConfirm }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleConfirm = () => {
    onConfirm(selectedGroup);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select a Group</DialogTitle>
      <DialogContent>
        <List>
          {groupOptions.map((group, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleSelect(group)}>
                <Checkbox checked={selectedGroup === group} />
                <ListItemText primary={group} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" disabled={!selectedGroup}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

//export default SelectGroupDialog;
//*/
