import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import React, { useId } from "react";
import {
  FiSearch,
  FiBell,
  FiPlus,
  FiSettings,
  FiUser,
  FiCreditCard,
} from "react-icons/fi";
import CreateIssue from "../create_issue/CreateIssue";
import NotificationPopup from "../ui/NotificationPopup";

export default function Navbar() {
  const searchId = useId();
  const [isReportedClicked, setIsReportedClicked] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const { user } = useUser();
  return (
    <>
      <div className="sticky md:py-3 top-0 z-50 w-full bg-white/80 border-b border-gray-200 backdrop-blur-sm flex justify-center ">
        <div className="w-full  px-4 md:px-8 py-2 flex items-center gap-4 md:gap-16 min-w-0">
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
            {user != null ? (
              <div
                onClick={() => setIsReportedClicked(true)}
                className="px-3 py-2 bg-yellow-200/80 rounded-lg inline-flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium justify-center cursor-pointer hover:bg-yellow-300 transition-colors duration-200 ease-in-out"
              >
                <FiPlus className="h-5 w-5" aria-hidden />
                <span>Report</span>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="px-3 py-2 bg-yellow-200/80 rounded-lg inline-flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium justify-center cursor-pointer hover:bg-yellow-300 transition-colors duration-200 ease-in-out"
              >
                <FiPlus className="h-5 w-5" aria-hidden />
                <span>Report</span>
              </Link>
            )}

            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 bg-transparent"
                aria-label="Notifications"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <FiBell className="w-5 h-5" />
              </button>
              
              {isNotificationOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-[90vw] max-w-xs sm:w-80">
                  <NotificationPopup
                    notifications={[
  {
    id: "1",
    type: "appointment",
    title: "Invite to Schedule Appointment",
    description: "...",
    date: "2 Aug 2025 — 9:45 AM",
    onScheduleNow: () => {},
    onNotNow: () => {},
  },
  {
    id: "2",
    type: "issue",
    title: "Your issue is gaining traction!",
    description: "...",
    date: "2 Aug 2025 — 9:45 AM",
    onViewIssue: () => {},
  }
]}
                    onClose={() => setIsNotificationOpen(false)}
                    onMarkAllRead={() => setIsNotificationOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Auth/Profile - hidden on mobile, visible from sm and up */}
            <div className="pl-2  hidden sm:block">
              <SignedOut>
                <Link to="/sign-in">Sign In</Link>
              </SignedOut>
              <SignedIn>
                <UserButton>
                  <UserButton.UserProfilePage
                    label="User Details"
                    labelIcon={<FiSettings />}
                    url="user-details"
                  >
                    <form>
                      <div>
                        <h4 className="font-bold mb-1">User Details</h4>
                        <hr className="my-4 border-gray-200" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="flex justify-between gap-2">
                            {/* First Name with icon */}
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FiUser className="w-5 h-5" />
                              </span>
                              <input
                                type="text"
                                placeholder="First Name"
                                className="pl-10 border-gray-300 rounded-lg p-3 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black w-full"
                              />
                            </div>
                            {/* Last Name */}
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FiUser className="w-5 h-5" />
                              </span>
                              <input
                                type="text"
                                placeholder="Last Name"
                                className="pl-10 border-gray-300 rounded-lg p-3 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black flex-1"
                              />
                            </div>
                          </div>
                          <hr className="my-4 border-gray-200" />
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <FiCreditCard className="w-5 h-5" />
                          </span>
                          <input
                            type="text"
                            placeholder="Nic"
                            className="pl-10 w-full border-gray-300 rounded-lg p-3 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <hr className="my-4 border-gray-200" />
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="w-full py-3 rounded-full bg-gradient-to-b from-gray-900 to-black text-white text-lg font-semibold shadow-md hover:from-black hover:to-gray-800 transition"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </UserButton.UserProfilePage>
                </UserButton>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
      {isReportedClicked && user && (
        <CreateIssue
          isReportedClicked={isReportedClicked}
          setIsReportedClicked={setIsReportedClicked}
        />
      )}
    </>
  );
}
