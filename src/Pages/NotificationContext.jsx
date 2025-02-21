import { createContext, useContext } from "react";
import useNotifications from "./useNotification.jsx";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notificationState = useNotifications();

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};
