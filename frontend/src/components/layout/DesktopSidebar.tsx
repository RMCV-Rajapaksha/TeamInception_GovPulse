import { NavLink } from "react-router-dom";
import { FiCompass, FiBarChart2 } from "react-icons/fi";

export default function DesktopSidebar() {
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
      </div>
    </aside>
  );
}
