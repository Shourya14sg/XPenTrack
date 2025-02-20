import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export const ConfirmGroupDialog = ({
  open,
  setOpen,
  selectedGroup,
  setGroup,
  expense,
  setExpense,
  handleConfirm,
}) => {
  const totalAmount = Math.round(expense.amount); // Ensure total amount is an integer
  const [shares, setShares] = useState({});
  const [remainingAmount, setRemainingAmount] = useState(totalAmount);

  useEffect(() => {
    if (selectedGroup) {
      const membersCount = selectedGroup.members.length;
      const initialSplit = Math.floor(totalAmount / membersCount);
      const remainder = totalAmount % membersCount;

      let initialShares = Object.fromEntries(
        selectedGroup.members.map((member, index) => [
          member,
          index < remainder ? initialSplit + 1 : initialSplit, // Distribute remainder
        ])
      );

      setShares(initialShares);
      setRemainingAmount(0); // No remaining amount after initial split
    }
  }, [selectedGroup, totalAmount]);

  const handleShareChange = (member, value) => {
    let newValue = parseInt(value, 10) || 0; // Ensure only integer values
    let tempShares = { ...shares, [member]: newValue };

    const totalAssigned = Object.values(tempShares).reduce(
      (sum, val) => sum + val,
      0
    );
    let remaining = totalAmount - totalAssigned;

    if (remaining < 0) return; // Prevent exceeding total amount

    setShares(tempShares);
    setRemainingAmount(remaining);
  };

  const distributeRemainingAmount = () => {
    if (remainingAmount > 0) {
      let members = Object.keys(shares);
      let perMemberExtra = Math.floor(remainingAmount / members.length);
      let remainder = remainingAmount % members.length;

      let updatedShares = { ...shares };

      members.forEach((member, index) => {
        updatedShares[member] += perMemberExtra;
        if (index < remainder) updatedShares[member] += 1;
      });

      setShares(updatedShares);
      setRemainingAmount(0);
    }
  };

  const handleConfirmGroup = () => {
    if (remainingAmount === 0) {
      setGroup(selectedGroup);
      setExpense((prevExpense) => ({
        ...prevExpense,
        //group: { id: selectedGroup.groupID,name:selectedGroup.groupName },
        groupID: selectedGroup.groupID,
        split: Object.entries(shares).map(([member, value]) => ({
          member,
          value,
        })),
      }));
      setOpen(false);
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedGroup.groupName}</DialogTitle>
      <DialogContent>
        <p className="text-md text-gray-600">
          Distribute the Expense: ₹{totalAmount}
        </p>
        {selectedGroup.members.map((member) => (
          <div key={member} className="flex items-center justify-between my-2">
            <span>{member}</span>
            <TextField
              type="number"
              size="small"
              value={shares[member] || ""}
              onChange={(e) => handleShareChange(member, e.target.value)}
              inputMode="numeric"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault(); // Prevent negative numbers and scientific notation
                }
              }}
              className="w-24"
            />
          </div>
        ))}
        <p
          className={`text-sm mt-2 ${
            remainingAmount === 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          Remaining: ₹{remainingAmount}
        </p>
        {remainingAmount > 0 && (
          <Button
            variant="outlined"
            onClick={distributeRemainingAmount}
            color="primary"
          >
            Distribute Remaining ₹{remainingAmount}
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpen(false)} color="error">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmGroup}
          color="primary"
          disabled={remainingAmount !== 0}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
