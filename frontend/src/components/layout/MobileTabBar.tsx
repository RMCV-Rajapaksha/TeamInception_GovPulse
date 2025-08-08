import { Link, useLocation } from "react-router-dom";
import { FiCompass, FiBell, FiUser, FiBarChart2, FiPlus } from "react-icons/fi";

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
  return (
    <nav className="fixed bottom-0 inset-x-0 sm:hidden bg-white/80 backdrop-blur border-t border-gray-200">
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
        <Link
          to="/report"
          aria-label="Report"
          className="w-14 h-14 bg-gray-900 rounded-[32px] inline-flex items-center justify-center text-white shadow-md"
        >
          <FiPlus className="h-6 w-6 text-white" />
        </Link>
        <Tab
          to="/notifications"
          label="Notification"
          selected={pathname.startsWith("/notifications")}
        >
          <FiBell className="h-5 w-5" />
        </Tab>
        <Tab
          to="/profile"
          label="Profile"
          selected={pathname.startsWith("/profile")}
        >
          <FiUser className="h-5 w-5" />
        </Tab>
      </div>
    </nav>
  );
}
