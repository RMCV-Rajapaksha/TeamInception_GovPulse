import { useUser } from "@clerk/clerk-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiClock,
  FiCreditCard,
  FiUploadCloud,
  FiUser,
  FiX,
} from "react-icons/fi";

export default function UserDetails({
  userVerifiedStatus: initialStatus,
}: {
  userVerifiedStatus: "Verified" | "Pending" | "Not Verified";
}) {
  const [userVerifiedStatus, setUserVerifiedStatus] = useState<
    "Verified" | "Pending" | "Not Verified"
  >(initialStatus);

  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSignedIn, isLoaded, user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setPhotos(Array.from(e.dataTransfer.files));
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  // console.log(user);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };
    console.log("updated", updatedDetails);
    try {
      if (user) {
        await user.update({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        });
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <div>
        <h4 className="font-bold mb-1">User Details</h4>
        <hr className="my-4 border-gray-200" />
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex flex-col md:flex-row justify-between gap-2">
            {/* First Name with icon */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiUser className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
      {/* Photo Upload Section */}
      <div className="mb-6 mt-6">
        <div className="flex justify-between mb-1">
          <label className="block text-sm text-gray-600 mb-2">
            Add Photo of NIC (Optional)
          </label>
          <div>
            {userVerifiedStatus === "Verified" && (
              <div className="flex gap-1 items-center justify-center bg-green-300 p-1.5 rounded-md">
                <FiCheck className="text-green-700" />
                <div className="text-sm">{userVerifiedStatus}</div>
              </div>
            )}
            {userVerifiedStatus === "Pending" && (
              <div className="flex gap-1 items-center justify-center bg-amber-200 p-1.5 rounded-md">
                <FiClock className="text-yellow-600" />
                <div className="text-sm">{userVerifiedStatus}</div>
              </div>
            )}
            {userVerifiedStatus === "Not Verified" && (
              <div className="flex gap-1 items-center justify-center bg-red-200 p-1.5 rounded-md">
                <FiX className="text-red-500" />
                <div className="text-sm">{userVerifiedStatus}</div>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-8 cursor-pointer hover:border-black transition"
          onDrop={handlePhotoDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handlePhotoClick}
        >
          <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
          <div className="text-gray-500 mb-1">
            Drag & drop your photos here or{" "}
            <span className="text-blue-600 underline">Browse</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handlePhotoSelect}
          />
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((file, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-200 rounded px-2 py-1 text-gray-700"
                >
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Upload clear images to help authorities assess the issue faster
        </div>
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
  );
}
