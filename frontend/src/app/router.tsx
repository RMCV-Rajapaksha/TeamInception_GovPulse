import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ProtectedLayout from "./layout/ProtectedLayout";
import HomePage from "../pages/Home/HomePage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import StatisticsPage from "../pages/Statistics/StatisticsPage";
import ServicesPage from "../pages/Services/ServicesPage";
import RegistrationsPage from "../pages/Registrations/RegistrationsPage";
import DrivingLicensePage from "../pages/Services/DrivingLicensePage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/stats", element: <StatisticsPage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/services/registrations", element: <RegistrationsPage /> },
      { path: "/services/driving-license", element: <DrivingLicensePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <ProtectedLayout />,
        children: [{ path: "/dashboard", element: <DashboardPage /> }],
      },
    ],
  },
]);
