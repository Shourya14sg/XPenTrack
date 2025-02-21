import React from "react";
import { Box, Typography, List, ListItem, Card, CardContent } from "@mui/material";

const NotificationTab = ({ notifications = {},onMouseLeave }) => {
  return (
    <Box
      onMouseLeave={onMouseLeave}
      sx={{
        width: 350,
        position: "fixed",
        top: "55px",
        right: "20px",
        backgroundColor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        padding: "10px",
        zIndex: 1300,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Notifications
      </Typography>

      {Object.keys(notifications).length === 0 ? (
        <Typography sx={{ textAlign: "center", padding: "10px" }}>
          No new notifications.
        </Typography>
      ) : (
        <List className="max-h-120 overflow-y-auto scroll-sm">
          {Object.entries(notifications).map(([groupName, expenses]) =>
            expenses.map((notification, index) => (
              <ListItem key={`${groupName}-${notification.split_expense_id}`} disablePadding>
                <Card sx={{ width: "100%", mb: 1, backgroundColor: "white", color: "black" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#0000ff" }}>
                      {groupName}
                    </Typography>
                    <Typography variant="body2">
                      {`You Owe ₹${notification.amount} to ${notification.owner_name}`}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))
          )}
        </List>
      )}
    </Box>
  );
};

export default NotificationTab;
