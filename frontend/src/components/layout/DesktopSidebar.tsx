import { NavLink } from "react-router-dom";
import { FiCompass, FiBarChart2, FiFolder, FiCalendar } from "react-icons/fi";
import { BiUpvote } from "react-icons/bi";

export default function DesktopSidebar() {
  // Replace this with your actual authentication logic
  const isLoggedIn = true; // This should come from your auth context/state

  return (
    <aside className="hidden md:block fixed left-0 top-[80px] h-screen px-8 py-12">
      <div className="w-[10rem] p-2 rounded-2xl ring-1 ring-gray-200 inline-flex flex-col justify-center items-start gap-2 bg-white/80 backdrop-blur-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            [
              "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
              isActive
                ? "bg-gray-900 text-gray-50"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          <FiCompass className="w-5 h-5" />
          <span className="text-base leading-tight tracking-tight">
            Explore
          </span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            [
              "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
              isActive
                ? "bg-gray-900 text-gray-50"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          <FiBarChart2 className="w-5 h-5" />
          <span className="text-base leading-tight tracking-tight">
            Statistics
          </span>
        </NavLink>

        {/* Show profile activity items when logged in */}
        {isLoggedIn && (
          <>
            <NavLink
              to="/myreports"
              className={({ isActive }) =>
                [
                  "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
                  isActive
                    ? "bg-gray-900 text-gray-50"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")
              }
            >
              <FiFolder className="w-5 h-5" />
              <span className="text-base leading-tight tracking-tight">
                My Reports
              </span>
            </NavLink>

            <NavLink
              to="/upvoted-issues"
              className={({ isActive }) =>
                [
                  "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
                  isActive
                    ? "bg-gray-900 text-gray-50"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")
              }
            >
              <BiUpvote className="w-5 h-5" />
              <span className="text-base leading-tight tracking-tight">
                Upvoted
              </span>
            </NavLink>

            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                [
                  "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
                  isActive
                    ? "bg-gray-900 text-gray-50"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")
              }
            >
              <FiCalendar className="w-5 h-5" />
              <span className="text-base leading-tight tracking-tight">
                Appointments
              </span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
}
