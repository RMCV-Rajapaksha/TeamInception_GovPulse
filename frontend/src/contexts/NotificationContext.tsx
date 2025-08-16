import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import WebSocketService from '../services/WebSocketService';
import type { Notification } from '../services/WebSocketService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Load notifications from localStorage on init
  useEffect(() => {
    const savedNotifications = localStorage.getItem('govpulse_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('govpulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      // Check if notification already exists to avoid duplicates
      const exists = prev.find(n => n.id === notification.id);
      if (exists) return prev;
      
      return [notification, ...prev].slice(0, 50); // Keep only last 50 notifications
    });
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('govpulse_notifications');
  }, []);

  // WebSocket connection management
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const connectWebSocket = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await WebSocketService.connect(token);
            setIsConnected(true);

            // Set up notification listener
            cleanup = WebSocketService.onNotification((notification: Notification) => {
              addNotification(notification);
              
              // Show browser notification if permissions are granted
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('GovPulse Notification', {
                  body: notification.notification_content,
                  icon: '/logo.png',
                });
              }
            });
          }
        } catch (error) {
          console.error('Failed to connect WebSocket:', error);
          setIsConnected(false);
        }
      }
    };

    const disconnectWebSocket = () => {
      WebSocketService.disconnect();
      setIsConnected(false);
      if (cleanup) cleanup();
    };

    if (isSignedIn) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isSignedIn, getToken, addNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const contextValue = useMemo((): NotificationContextType => ({
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }), [notifications, unreadCount, isConnected, addNotification, markAsRead, markAllAsRead, clearNotifications]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
