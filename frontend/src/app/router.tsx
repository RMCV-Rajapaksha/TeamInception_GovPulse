import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ProtectedLayout from "./layout/ProtectedLayout";
import HomePage from "../pages/Home/HomePage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import StatisticsPage from "../pages/Statistics/StatisticsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import MyReportsPage from "@/pages/MyReports/MyReportsPage";
import AppointmentsPage from "@/pages/Appointments/AppointmentsPage";
import ServicesPage from "../pages/Services/ServicesPage";
import RegistrationsPage from "../pages/Registrations/RegistrationsPage";
import DrivingLicensePage from "../pages/Services/DrivingLicensePage";
import AppointmentBookingPage from "../pages/Services/AppointmentBookingPage";
import ConfirmBookingPage from "../pages/Services/ConfirmBookingPage";
import AppointmentConfirmationPage from "../pages/Services/AppointmentConfirmationPage";
import QRVerificationPage from "../pages/QRVerificationPage";
import ReceiptDemoPage from "../pages/ReceiptDemoPage";
import FigmaPrintableDemoPage from "../pages/FigmaPrintableDemoPage";
import UserProfilePage from "@/pages/Profile/UserProfile";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/stats", element: <StatisticsPage /> },
      { path: "/services", element: <AppointmentBookingPage /> },
      { path: "/services/registrations", element: <RegistrationsPage /> },
      { path: "/services/driving-license", element: <DrivingLicensePage /> },
      { path: "/services/driving-license/book", element: <AppointmentBookingPage /> },
      { path: "/services/driving-license/confirm", element: <ConfirmBookingPage /> },
      { path: "/services/driving-license/confirmed", element: <AppointmentConfirmationPage /> },
      { path: "/verify-qr", element: <QRVerificationPage /> },
      { path: "/receipt-demo", element: <ReceiptDemoPage /> },
      { path: "/figma-printable", element: <FigmaPrintableDemoPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/myreports", element: <MyReportsPage /> },
          { path: "/appointments", element: <AppointmentsPage /> },
          { path: "/user-profile", element: <UserProfilePage /> },
        ],
      },
    ],
  },
]);
