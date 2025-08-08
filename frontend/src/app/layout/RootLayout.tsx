import { Link, Outlet } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export default function RootLayout() {
  return (
    <div className="min-h-screen">
      <header className="p-4 border-b flex items-center justify-between">
        <Link to="/" className="font-semibold">
          GovPulse
        </Link>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
