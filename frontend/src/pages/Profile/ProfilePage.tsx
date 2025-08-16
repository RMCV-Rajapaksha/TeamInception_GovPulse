import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { FiFolder, FiCalendar } from "react-icons/fi";
import { BiUpvote } from "react-icons/bi";
import { GoPulse } from "react-icons/go";
import { BsSliders } from "react-icons/bs";
import { SquaresFour, StackIcon } from "@phosphor-icons/react"; // Add these imports
import ProfileListButton from "./ProfileListButton";
import { SignedIn, SignOutButton, UserButton } from "@clerk/clerk-react";

export default function ProfilePage() {
  return (
    <div className="pb-24 md:ml-[14rem] px-10 md:px-0 md:pl-[5rem] md:pr-[15rem]">
      {/* Header */}
      <div className="px-8 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Main tabs */}
      <div className="flex px-6 mb-8 justify-center">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="bg-gray-100 rounded-lg p-1 flex justify-center h-12">
            <TabsTrigger
              value="activity"
              className="flex items-center gap-2 px-6 py-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow h-10"
            >
              <GoPulse /> My activity
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 px-6 py-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow h-10"
            >
              <BsSliders /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6 space-y-3">
            <ProfileListButton
              icon={FiFolder}
              title="My reports"
              description="View and track all your reported issues"
              route="/myreports"
            />

            <ProfileListButton
              icon={FiCalendar}
              title="Appointments"
              description="Manage your appointments"
              route="/appointments"
            />

            <ProfileListButton
              icon={SquaresFour}
              title="Services"
              description="Browse and access government services"
              route="/services"
            />

            <ProfileListButton
              icon={StackIcon}
              title="Service Appointments"
              description="Manage your service appointments"
              route="/my-services"
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            {/* Add settings content here */}
            <SignedIn>
              {/* <UserDetails userVerifiedStatus={userVerifiedStatus} /> */}
              <UserButton
                showName={true}
                userProfileMode="navigation"
                userProfileUrl="/user-profile"
              />
              <SignOutButton />
            </SignedIn>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
