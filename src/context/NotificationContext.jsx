import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();
const EarningsContext = createContext();

export const useNotification = () => useContext(NotificationContext);
export const useEarnings = () => useContext(EarningsContext);

export const EarningsProvider = ({ children }) => {
  const [todayEarnings, setTodayEarnings] = useState(0);

  return (
    <EarningsContext.Provider value={{ todayEarnings, setTodayEarnings }}>
      {children}
    </EarningsContext.Provider>
  );
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [sound] = useState(new Audio('/notification.mp3'));

  const addNotification = (message) => {
    setNotifications(prev => [message, ...prev]);
    setUnreadCount(prev => prev + 1);
    sound.play().catch(error => console.log('Audio playback failed:', error));
  };

  const clearNotifications = () => {
    setUnreadCount(0);
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      unreadCount, 
      notifications, 
      addNotification, 
      clearNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};