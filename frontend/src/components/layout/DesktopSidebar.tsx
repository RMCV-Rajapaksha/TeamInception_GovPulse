import { NavLink } from "react-router-dom";
import { Compass, TrendUp, SquaresFour } from "@phosphor-icons/react";

export default function DesktopSidebar() {
  return (
    <aside className="hidden md:block fixed left-0 top-[80px] h-screen px-8 py-12 z-50 pointer-events-auto">
      <div className="w-[10rem] p-2 rounded-2xl ring-1 ring-gray-200 inline-flex flex-col justify-center items-start gap-2 bg-white/80 backdrop-blur-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            [
              "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Compass
                size={20}
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
              "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <TrendUp
                size={20}
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
              "self-stretch p-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <SquaresFour
                size={20}
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
      </div>
    </aside>
  );
}
