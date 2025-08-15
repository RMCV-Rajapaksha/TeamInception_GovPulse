import React from "react";
import { FiX } from "react-icons/fi";


interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  actions?: {
    label: string;
    onClick: () => void;
    primary?: boolean;
  }[];
}

interface NotificationPopupProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
}) => {
  return (
    <div className="w-96 bg-white rounded-xl shadow-lg flex flex-col max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <button
          onClick={onClose}
          aria-label="Close notifications"
          className="p-1 rounded hover:bg-gray-100"
        >
          <FiX className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {notifications.length === 0 && (
          <p className="text-center text-gray-500">No new notifications</p>
        )}
        {notifications.map((notif) => (
          <div key={notif.id} className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900">{notif.title}</h3>
            <p className="text-sm text-gray-700">{notif.description}</p>
            <p className="text-xs text-gray-500">{notif.date}</p>
            <div className="flex gap-3 mt-2">
              {notif.actions?.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`px-4 py-2 rounded-full border text-sm font-medium ${
                    action.primary
                      ? "bg-black text-white border-black hover:bg-gray-900"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"
            />
          </svg>
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
