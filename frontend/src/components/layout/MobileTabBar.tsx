import { Link, useLocation } from "react-router-dom";
import {
  FiCompass,
  FiBell,
  FiUser,
  FiBarChart2,
  FiPlus,
  FiMessageCircle,
} from "react-icons/fi";
import React from "react";
import Chatbot from "../chatbot/Chatbot";
import CreateIssue from "../create_issue/CreateIssue";
import { useUser } from "@clerk/clerk-react";

function Tab({
  to,
  label,
  selected,
  children,
}: {
  to: string;
  label: string;
  selected?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      data-selected={selected ? "on" : "off"}
      className="w-14 p-2 inline-flex flex-col items-center gap-1 text-center"
    >
      <div className="w-6 h-6 relative overflow-hidden">{children}</div>
      <div
        className={
          selected
            ? "text-gray-900 text-[10px] font-bold"
            : "text-gray-500 text-[10px] font-medium"
        }
      >
        {label}
      </div>
    </Link>
  );
}

export default function MobileTabBar() {
  const { pathname } = useLocation();
  const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
  const [isReportedClicked, setIsReportedClicked] = React.useState(false);
  const { isSignedIn } = useUser();

  const handleReportClick = () => {
    if (isSignedIn) {
      setIsReportedClicked(true);
    } else {
      // Redirect to sign-in page or show sign-in modal
      window.location.href = "/sign-in";
    }
  };

  return (
    <>
      {/* Mobile Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 sm:hidden bg-white/80 backdrop-blur border-t border-gray-200 z-30">
        <div className="px-6 py-3 flex justify-between items-center">
          <Tab to="/" label="Explore" selected={pathname === "/"}>
            <FiCompass className="h-5 w-5" />
          </Tab>
          <Tab
            to="/stats"
            label="Statistics"
            selected={pathname.startsWith("/stats")}
          >
            <FiBarChart2 className="h-5 w-5" />
          </Tab>
          <button
            onClick={handleReportClick}
            aria-label="Report"
            className="w-14 h-14 bg-gray-900 rounded-[32px] inline-flex items-center justify-center text-white shadow-md hover:bg-gray-800 transition-colors pointer-events-auto"
          >
            <FiPlus className="h-6 w-6 text-white" />
          </button>
          {isSignedIn && (
            <Tab
              to="/notifications"
              label="Notification"
              selected={pathname.startsWith("/notifications")}
            >
              <FiBell className="h-5 w-5" />
            </Tab>
          )}
          <Tab
            to={isSignedIn ? "/profile" : "/sign-in"}
            label="Profile"
            selected={pathname.startsWith("/profile")}
          >
            <FiUser className="h-5 w-5" />
          </Tab>
        </div>
      </nav>

      {/* Floating chatbot button for both mobile and desktop */}
      <button
        type="button"
        onClick={() => setIsChatbotOpen(true)}
        aria-label="Open AI Chatbot"
        className={`fixed bottom-24 right-4 z-40 w-14 h-14 bg-yellow-200/80 hover:bg-yellow-300 rounded-full shadow-lg items-center justify-center border-2 border-yellow-400 transition-all duration-200 flex sm:bottom-8 sm:right-8 transform hover:scale-110 active:scale-95 ${
          isChatbotOpen ? "scale-95 opacity-75" : "scale-100 opacity-100"
        }`}
        style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
      >
        <FiMessageCircle className={`w-7 h-7 text-gray-900 transition-transform duration-200 ${
          isChatbotOpen ? "rotate-12" : "rotate-0"
        }`} />
      </button>

      {/* Chatbot panel (mobile: full, desktop: floating) */}
      <Chatbot open={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      {/* Create Issue Modal */}
      <CreateIssue
        isReportedClicked={isReportedClicked}
        setIsReportedClicked={setIsReportedClicked}
      />
    </>
  );
}
