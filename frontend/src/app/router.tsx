import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ProtectedLayout from "./layout/ProtectedLayout";
import HomePage from "../pages/Home/HomePage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <ProtectedLayout />,
        children: [{ path: "/dashboard", element: <DashboardPage /> }],
      },
    ],
  },
]);
