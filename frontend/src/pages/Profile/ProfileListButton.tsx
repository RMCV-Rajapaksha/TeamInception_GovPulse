import { IoIosArrowForward } from "react-icons/io"

type ProfileListButtonProps = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  onClick?: () => void;
};

export default function ProfileListButton({ icon: Icon, title, description, onClick }: ProfileListButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-100 text-gray-700">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Right: Arrow */}
      <IoIosArrowForward size={18} className="text-gray-400" />
    </button>
  )
}
