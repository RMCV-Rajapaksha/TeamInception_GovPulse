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
import UpvotedIssuesPage from "@/pages/UpvotedIssues/UpvotedIssuesPage";
import AppointmentsPage from "@/pages/Appointments/AppointmentsPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/stats", element: <StatisticsPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/myreports", element: <MyReportsPage /> },
          { path: "/upvoted-issues", element: <UpvotedIssuesPage /> },
          { path: "/appointments", element: <AppointmentsPage /> }
        ],
      },
    ],
  },
]);
