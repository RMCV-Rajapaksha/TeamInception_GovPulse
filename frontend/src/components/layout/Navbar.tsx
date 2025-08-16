import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import React, { useId } from "react";
import {
  Search,
  Bell,
  Plus,
  Settings,
  X,
  User,
  CreditCard,
  ScanQrCode,
} from "lucide-react";
import CreateIssue from "../create_issue/CreateIssue";
import QRScanner from "../qr/QRScanner";
import { useAuthShim } from "../../app/providers";
import { useNotifications } from "../../contexts/NotificationContext";

export default function Navbar() {
  const { hasClerk } = useAuthShim();
  const { unreadCount } = useNotifications();
  const searchId = useId();
  const mobileSearchId = useId();
  const [isReportedClicked, setIsReportedClicked] = React.useState(false);
  const [isQrScanOpen, setIsQrScanOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const { user } = useUser();

  const handleQRScan = (result: string) => {
    console.log("QR Scanned:", result);
    // Handle the scanned QR code result here
    // You can navigate to a URL, process the data, etc.
    alert(`QR Code Scanned: ${result}`);
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white/80 border-b border-gray-200 backdrop-blur-sm flex justify-center py-3">
        <div className="w-full px-4 md:px-8 py-2 flex items-center gap-4 md:gap-16 min-w-0">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center"
            aria-label="Home"
          >
            <img
              src="/Logo.svg"
              alt="GovPulse"
              className="h-8 w-40 object-contain"
            />
          </Link>

          {/* Search Bar and QR Scanner Container */}
          <div className="flex-1 max-w-3xl hidden sm:flex items-center gap-2 min-w-0">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <label htmlFor={searchId} className="sr-only">
                Search
              </label>
              <div className="flex-1 h-10 px-3 md:px-4 rounded-2xl border border-gray-300 bg-white/70 flex items-center gap-2 min-w-0">
                <input
                  id={searchId}
                  placeholder="Search"
                  className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-base focus:outline-none"
                />
                <Search className="w-5 h-5 text-gray-500" aria-hidden />
              </div>
            </div>

            {/* QR Scan Button - Desktop */}
            <button
              type="button"
              onClick={() => setIsQrScanOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 bg-transparent flex-shrink-0 transition-colors duration-200"
              aria-label="Scan QR Code"
            >
              <ScanQrCode className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search and QR Container */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 bg-transparent transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* QR Scan Button - Mobile */}
            <button
              type="button"
              onClick={() => setIsQrScanOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 bg-transparent transition-colors duration-200"
              aria-label="Scan QR Code"
            >
              <ScanQrCode className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 md:gap-4 flex-shrink-0">
            {hasClerk && user != null ? (
              <button
                type="button"
                onClick={() => setIsReportedClicked(true)}
                className="px-3 py-2 bg-yellow-200 rounded-lg inline-flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium justify-center hover:bg-yellow-300 transition-colors duration-200 ease-in-out"
              >
                <Plus className="h-5 w-5" aria-hidden />
                <span className="hidden sm:inline">Report</span>
              </button>
            ) : (
              <Link
                to="/sign-in"
                className="px-3 py-2 bg-yellow-200 rounded-lg inline-flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium justify-center cursor-pointer hover:bg-yellow-300 transition-colors duration-200 ease-in-out"
              >
                <Plus className="h-5 w-5" aria-hidden />
                <span className="hidden sm:inline">Report</span>
              </Link>
            )}

            <div className="relative">
              <Link
                to="/notifications"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 bg-transparent transition-colors duration-200 flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Auth/Profile - hidden on mobile, visible from sm and up */}
            <div className="pl-2  hidden sm:block">
              {hasClerk ? (
                <>
                  <SignedOut>
                    <Link to="/sign-in">Sign In</Link>
                  </SignedOut>
                  <SignedIn>
                    <UserButton>
                      <UserButton.UserProfilePage
                        label="User Details"
                        labelIcon={<Settings />}
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
                                    <User className="w-5 h-5" />
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
                                    <User className="w-5 h-5" />
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
                                <CreditCard className="w-5 h-5" />
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
                </>
              ) : (
                <Link to="/sign-in">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Popup */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm sm:hidden flex items-start justify-center pt-20">
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Search</h3>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search input */}
            <div className="p-4">
              <label htmlFor={mobileSearchId} className="sr-only">
                Search
              </label>
              <div className="h-12 px-4 rounded-2xl border border-gray-300 bg-gray-50 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-500" aria-hidden />
                <input
                  id={mobileSearchId}
                  placeholder="Search for issues, locations..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-base focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Search results/content area */}
            <div className="px-4 pb-6">
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Start typing to search for issues
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Component */}
      <QRScanner
        isOpen={isQrScanOpen}
        onClose={() => setIsQrScanOpen(false)}
        onScan={handleQRScan}
      />

      {isReportedClicked && user && (
        <CreateIssue
          isReportedClicked={isReportedClicked}
          setIsReportedClicked={setIsReportedClicked}
        />
      )}
    </>
  );
}
