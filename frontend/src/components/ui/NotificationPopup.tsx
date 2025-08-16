import React from "react";
import { FiX } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

interface Notification {
  id: string;
  type: "appointment" | "issue";
  title: string;
  description: string;
  date: string;
  onScheduleNow?: () => void;
  onNotNow?: () => void;
  onViewIssue?: () => void;
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
    <div className="w-full max-w-[420px] sm:w-[420px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-[18px] font-semibold text-gray-900">Notifications</h2>
        <button
          onClick={onClose}
          aria-label="Close notifications"
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <FiX className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-8">
        {notifications.length === 0 && (
          <p className="text-center text-gray-500 text-base">No new notifications</p>
        )}
        {notifications.map((notif) => (
          <div key={notif.id} className="flex flex-col gap-3">
            <h3 className="font-semibold text-[16px] text-gray-900 leading-tight">{notif.title}</h3>
            <p className="text-[15px] text-gray-800 leading-snug">{notif.description}</p>
            <p className="text-xs text-gray-500">{notif.date}</p>
            {/* Action Buttons */}
            {notif.type === "appointment" && (
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <button
                  onClick={notif.onScheduleNow}
                  className="flex-1 px-4 py-2 rounded-full border border-black bg-black text-white text-[15px] font-medium transition hover:bg-gray-900"
                >
                  Schedule now
                </button>
                <button
                  onClick={notif.onNotNow}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 text-[15px] font-medium transition hover:bg-gray-100"
                >
                  Not now
                </button>
              </div>
            )}
            {notif.type === "issue" && (
              <button
                onClick={notif.onViewIssue}
                className="w-full flex items-center justify-between px-4 py-2 rounded-full border border-black bg-black text-white text-[15px] font-medium transition hover:bg-gray-900 mt-1"
              >
                <span>View Issue</span>
                <FiChevronRight className="ml-2 w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-2 text-gray-600 text-[15px] hover:text-black transition"
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