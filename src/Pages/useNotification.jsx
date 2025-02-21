import { useState, useEffect } from "react";
import axios from "axios";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const User_data = JSON.parse(sessionStorage.getItem("user_data"));
  const userID = User_data ? User_data.user.id : null;
  const accessToken = User_data ? User_data.access : null;

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications`, {
        params: { userID }, // Pass userID as query param
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const newNotifications = Array.isArray(response.data) ? response.data : [];

      if (newNotifications.length > notifications.length) {
        setHasNewNotifications(true);
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(() => {
      fetchNotifications();
    }, 120000); // 2 minutes interval

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    hasNewNotifications,
    setHasNewNotifications,
  };
};

export default useNotifications;
