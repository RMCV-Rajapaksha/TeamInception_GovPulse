import { NavLink } from "react-router-dom";
import {
  Compass,
  TrendUp,
  SquaresFour,
  Folder,
  ThumbsUp,
  Calendar,
  StackIcon
} from "@phosphor-icons/react";

export default function DesktopSidebar() {
  // Replace this with your actual authentication logic
  const isLoggedIn = true; // This should come from your auth context/state

  return (
    <aside className="hidden md:block fixed left-0 top-[80px] h-screen px-8 py-12 z-50 pointer-events-auto">
      <div className="w-48 p-4 rounded-2xl border border-gray-200 inline-flex flex-col justify-center items-start gap-3 bg-white/80 backdrop-blur-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            [
              "self-stretch p-3 rounded-lg inline-flex justify-start items-center gap-3 transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Compass
                size={24}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "text-white" : "text-gray-600"}
              />
              <span
                className={`text-base leading-tight tracking-tight ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                Explore
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            [
              "self-stretch p-3 rounded-lg inline-flex justify-start items-center gap-3 transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <TrendUp
                size={24}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "text-white" : "text-gray-600"}
              />
              <span
                className={`text-base leading-tight tracking-tight ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                Statistics
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            [
              "self-stretch p-3 rounded-lg inline-flex justify-start items-center gap-3 transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <SquaresFour
                size={24}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "text-white" : "text-gray-600"}
              />
              <span
                className={`text-base leading-tight tracking-tight ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                Services
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/my-services"
          className={({ isActive }) =>
            [
              "self-stretch p-3 rounded-lg inline-flex justify-start items-center gap-3 transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <StackIcon
                size={24}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "text-white" : "text-gray-600"}
              />
              <span
                className={`text-base leading-tight tracking-tight ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                Service Appointments
              </span>
            </>
          )}
        </NavLink>

        {/* Show profile activity items when logged in */}
        {isLoggedIn && (
          <>
            <NavLink
              to="/myreports"
              className={({ isActive }) =>
                [
                  "self-stretch p-3 rounded-lg inline-flex justify-start items-center gap-3 transition-colors",
                  isActive
                    ? "bg-gray-900 text-gray-50"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Folder
                    size={24}
                    weight={isActive ? "fill" : "regular"}
                    className={isActive ? "text-white" : "text-gray-600"}
                  />
                  <span
                    className={`text-base leading-tight tracking-tight ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    My Reports
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                [
                  "self-stretch p-3 rounded-lg inline-flex justify-start items-center gap-3 transition-colors",
                  isActive
                    ? "bg-gray-900 text-gray-50"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Calendar
                    size={24}
                    weight={isActive ? "fill" : "regular"}
                    className={isActive ? "text-white" : "text-gray-600"}
                  />
                  <span
                    className={`text-base leading-tight tracking-tight ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Issue Appointments
                  </span>
                </>
              )}
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
}
