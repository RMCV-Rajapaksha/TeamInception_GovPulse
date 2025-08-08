import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import MobileTabBar from "../../components/layout/MobileTabBar";
import DesktopSidebar from "../../components/layout/DesktopSidebar";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white w-screen text-gray-900">
      <Navbar />
      <div className="relative flex ">
        <DesktopSidebar />
        <main className="flex-1 py-4 md:py-8 ">
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
