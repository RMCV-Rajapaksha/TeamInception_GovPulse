import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import React, { useId } from "react";
import { FiSearch, FiBell, FiPlus } from "react-icons/fi";

export default function Navbar() {
  const searchId = useId();
  const [isReportedClicked, setIsReportedClicked] = React.useState(false);
  const { user } = useUser();
  return (
    <>
      <div className="sticky md:py-3 top-0 z-50 w-full bg-white/80 border-b border-gray-200 backdrop-blur-sm flex justify-center ">
        <div className="w-full max-w-[1600px] px-4 md:px-8 py-2 flex items-center gap-4 md:gap-16 min-w-0">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center" aria-label="Home">
            <img
              src="/Logo.svg"
              alt="GovPulse"
              className="h-8 w-40 object-contain"
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[916px] hidden sm:flex min-w-0">
            <label htmlFor={searchId} className="sr-only">
              Search
            </label>
            <div className="flex-1 h-10 px-3 md:px-4 rounded-2xl ring-1 ring-gray-300 bg-white/70 flex items-center gap-2 min-w-0">
              <input
                id={searchId}
                placeholder="Search"
                className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-base"
              />
              <FiSearch className="w-5 h-5 text-gray-500" aria-hidden />
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 md:gap-4 shrink-0">
            <div className="px-3 py-2 bg-yellow-200/80 rounded-lg inline-flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium justify-center cursor-pointer hover:bg-yellow-300 transition-colors duration-200 ease-in-out">
              <FiPlus className="h-5 w-5" aria-hidden />
              <span onClick={() => setIsReportedClicked(true)}>Report</span>
            </div>

            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 bg-transparent"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
            </button>

            {/* Auth/Profile - hidden on mobile, visible from sm and up */}
            <div className="pl-2  hidden sm:block">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
      {isReportedClicked && user && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-2">Report an Issue</h2>
            <p className="mb-4">Please describe the issue you encountered:</p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              rows={4}
              placeholder="Type your message here..."
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-black rounded-lg"
                onClick={() => setIsReportedClicked(false)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
