import {
  FiClock,
  FiMapPin,
  FiMoreHorizontal,
  FiMessageCircle,
  FiArrowUp,
} from "react-icons/fi";
import { PiShareFatThin } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export type Post = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  votes: number;
  status: "Pending" | "Resolved" | "In Review";
  imageUrl: string;
};

export default function PostCard({
  post,
  onVote,
}: {
  post: Post;
  onVote?: (post: Post) => void;
}) {
  const { title, description, date, location, status, imageUrl } = post;
  const { isSignedIn } = useAuth();
  const [votes, setVotes] = useState(post.votes);

  // Update votes when post prop changes
  useEffect(() => {
    setVotes(post.votes);
  }, [post.votes]);

  const handleVoteClick = () => {
    if (!isSignedIn) {
      alert("Please sign in to vote");
      return;
    }
    // Open the modal instead of voting directly
    onVote?.(post);
  };

  return (
    <article className="w-full">
      {/* Desktop layout */}
      <div className="hidden md:block w-full py-8 lg:py-10">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-10">
          {/* Left content */}
          <div className="flex-1 flex flex-col gap-4 lg:gap-6 min-w-0">
            {/* Meta row */}
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex-1 flex items-center gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <FiClock className="h-4 w-4" /> {date}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <FiMapPin className="h-4 w-4" /> {location}
                </span>
              </div>
              <div className="px-4 lg:px-5 py-2.5 rounded-2xl border border-gray-200 inline-flex items-center gap-2 text-sm text-gray-600">
                <FiMessageCircle className="h-4 w-4" />
                <span>{votes}</span>
              </div>
              <button
                className="rounded-2xl hover:bg-gray-100 p-3 transition-colors duration-200"
                aria-label="More"
              >
                <PiShareFatThin className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-lg lg:text-xl font-bold leading-snug text-gray-900">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
              {description}
            </p>

            {/* Actions */}
            <div className="flex">
              <button
                onClick={handleVoteClick}
                className="flex items-center gap-3 h-12 lg:h-14 px-5 lg:px-6 rounded-2xl border border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100 font-bold transition-colors duration-200"
              >
                <FiArrowUp className="h-5 w-5" />
                Vote
              </button>
            </div>
          </div>

          {/* Image section */}
          <div className="flex-shrink-0 w-full xl:w-72 2xl:w-80 h-48 lg:h-56 xl:h-48 2xl:h-56 relative rounded-2xl overflow-hidden">
            <img
              src={imageUrl}
              alt="Post media"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3">
              <span className="px-4 lg:px-5 py-2 lg:py-2.5 bg-yellow-200 rounded-lg inline-flex items-center gap-2 text-sm text-gray-900">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden w-full pb-4">
        <div className="relative overflow-hidden rounded-none">
          <img
            src={imageUrl}
            alt="Post media"
            className="w-full aspect-[16/9] object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 bg-yellow-200 rounded-2xl inline-flex items-center gap-2 text-sm text-gray-900">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
              {status}
            </span>
          </div>
        </div>

        <div className="px-5 pt-4 flex flex-col gap-3">
          {/* Meta row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <FiClock className="h-4 w-4" /> {date}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="h-4 w-4" /> {location}
              </span>
            </div>
            <div className="px-3 py-2 rounded-2xl border border-gray-200 inline-flex items-center gap-2 text-sm text-gray-600">
              <FiMessageCircle className="h-4 w-4" />
              <span>{votes}</span>
            </div>
          </div>

          {/* Title + more */}
          <div className="flex items-center gap-3">
            <h3 className="flex-1 text-lg lg:text-xl font-bold leading-snug text-gray-900">
              {title}
            </h3>
            <button
              className="rounded-2xl hover:bg-gray-100 p-3 transition-colors duration-200"
              aria-label="More"
            >
              <FiMoreHorizontal className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
            {description}
          </p>

          {/* Actions */}
          <div className="py-3">
            <button
              onClick={handleVoteClick}
              className="flex items-center gap-3 h-12 lg:h-14 px-5 rounded-2xl border border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100 font-bold w-full justify-center transition-colors duration-200"
            >
              <FiArrowUp className="h-5 w-5" />
              Vote
            </button>
          </div>
        </div>

        <div className="px-5">
          <div className="h-px bg-gray-200" />
        </div>
      </div>
    </article>
  );
}
