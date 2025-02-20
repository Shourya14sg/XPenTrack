import React from 'react';
import { Box, Typography, List, ListItem, Card, CardContent } from '@mui/material';

const NotificationTab = ({ notifications=[] }) => {
  return (
    <Box
      sx={{
        width: 350,
        position: "absolute",
        top: "60px", 
        right: "20px", 
        backgroundColor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        padding: "10px",
        zIndex: 1300
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography sx={{ textAlign: "center", padding: "10px" }}>
          No new notifications.
        </Typography>
      ) : (
        <List>
          {notifications.map((notification, index) => (
            <ListItem key={index} sx={{ padding: "0" }}>
              <Card sx={{ width: "100%", mb: 1, backgroundColor: "#121212", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2">{notification.message}</Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationTab;
