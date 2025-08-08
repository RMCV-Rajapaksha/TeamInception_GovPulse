import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import MobileTabBar from "../../components/layout/MobileTabBar";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="py-4">
        <Outlet />
      </main>
      <MobileTabBar />
    </div>
  );
}
