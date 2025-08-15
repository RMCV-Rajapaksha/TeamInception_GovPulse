import { useState } from "react";
import { UserButton, UserProfile } from "@clerk/clerk-react";
import { FiSettings } from "react-icons/fi";
import UserDetails from "@/components/user_details/UserDetails";

const UserProfilePage = () => {
  const [userVerifiedStatus] = useState<
    "Verified" | "Pending" | "Not Verified"
  >("Not Verified");
  return (
    <div className="user-profile flex justify-center  min-h-screen">
      <UserProfile>
        <UserButton.UserProfilePage
          label="User Details"
          labelIcon={<FiSettings />}
          url="user-details"
        >
          <UserDetails userVerifiedStatus={userVerifiedStatus} />
        </UserButton.UserProfilePage>
      </UserProfile>
    </div>
  );
};

export default UserProfilePage;
