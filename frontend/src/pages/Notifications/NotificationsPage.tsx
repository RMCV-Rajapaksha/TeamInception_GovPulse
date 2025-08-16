import React, { useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, Calendar, CheckCircle, AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import type { Notification } from '../../services/WebSocketService';

const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();

  // Mark notifications as read when viewing the page
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      // Mark as read after a short delay to show the user what's new
      const timer = setTimeout(() => {
        unreadNotifications.forEach(notification => {
          markAsRead(notification.id);
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, markAsRead]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approved_for_appointment_scheduling':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'issue_update':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'appointment_reminder':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const renderNotification = (notification: Notification) => (
    <div
      key={notification.id}
      className={`p-4 border rounded-lg transition-colors duration-200 ${
        !notification.read 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.notification_type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 capitalize">
              {notification.notification_type.replace(/_/g, ' ')}
            </span>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
          
          <p className="text-gray-700 text-sm mb-2">
            {notification.notification_content}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatTimestamp(notification.timestamp)}
            </span>
            
            {notification.notification_type === 'approved_for_appointment_scheduling' && (
              <button
                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                onClick={() => {
                  // TODO: Implement appointment booking navigation
                  console.log('Navigate to appointment booking');
                }}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <div className="flex items-center gap-4 p-3 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex gap-3 mb-6">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                <CheckCircle className="w-4 h-4" />
                Mark All as Read
              </button>
            )}
            
            <button
              onClick={clearNotifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map(renderNotification)
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500">
                You'll see notifications about your issues and appointments here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
