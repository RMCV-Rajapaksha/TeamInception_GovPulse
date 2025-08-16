import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useAuth } from "@clerk/clerk-react";
import type { Post } from "./PostCard";
import { FiClock, FiMapPin, FiArrowUp, FiX, FiShare2 } from "react-icons/fi";
import { upvoteService } from "@/utils/api";
import toast from "react-hot-toast";

export default function PostDetailsModal({
  post,
  isOpen,
  onClose,
  onVoteUpdate,
}: {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteUpdate?: (updatedPost: Post) => void;
}) {
  const { getToken, isSignedIn } = useAuth();
  const [comment, setComment] = useState("");
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState(post?.votes || 0);

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  // Update votes when post changes
  useEffect(() => {
    if (post) {
      setVotes(post.votes);
    }
  }, [post?.votes]);

  // Check if user has already upvoted when modal opens
  useEffect(() => {
    const checkUpvoteStatus = async () => {
      if (!post || !isSignedIn) {
        setHasUpvoted(false);
        return;
      }

      try {
        const token = await getToken();
        if (token) {
          const result = await upvoteService.hasUserUpvoted(post.id, token);
          setHasUpvoted(result.has_upvoted);
        }
      } catch (error) {
        console.error("Error checking upvote status:", error);
        setHasUpvoted(false);
      }
    };

    if (isOpen) {
      checkUpvoteStatus();
    }
  }, [post?.id, isSignedIn, getToken, isOpen]);

  // Reset comment when modal closes or post changes
  useEffect(() => {
    if (!isOpen || !post) {
      setComment("");
    }
  }, [isOpen, post?.id]);

  const handleVote = async () => {
    if (!post || !isSignedIn) {
      toast.error("Please sign in to vote");
      return;
    }

    // Prevent voting if user has already voted
    if (hasUpvoted) {
      toast.error("You have already voted on this issue");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Add upvote with optional comment
      await upvoteService.addUpvote(
        {
          issue_id: post.id,
          comment: comment.trim() || undefined,
        },
        token
      );
      const newVoteCount = votes + 1;
      setVotes(newVoteCount);
      setHasUpvoted(true);
      setComment(""); // Clear comment after successful vote

      // Update the post object and notify parent
      const updatedPost = { ...post, votes: newVoteCount };
      onVoteUpdate?.(updatedPost);

      toast.success("Vote added successfully! 🎉");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error(error instanceof Error ? error.message : "Failed to vote");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/60 z-50"
      className="fixed inset-0 w-screen h-screen bg-white rounded-none shadow-xl outline-none flex flex-col md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 md:inset-auto md:w-full md:max-w-4xl md:h-auto md:max-h-screen md:rounded-2xl"
      bodyOpenClassName="overflow-hidden"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
        <div className="text-sm text-gray-600">Issue details</div>
        <button
          aria-label="Close"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <FiX className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {post && (
        <div className="flex-1 overflow-auto">
          {/* Hero image */}
          <div className="relative">
            <img
              src={post.imageUrl}
              alt="Post media"
              className="w-full aspect-video object-cover"
            />
            {/* Status pill */}
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1.5 bg-yellow-200 rounded-lg inline-flex items-center gap-2 text-xs text-gray-900 shadow">
                <span className="h-2 w-2 rounded-full bg-gray-900" />
                {post.status}
              </span>
            </div>
          </div>

          <div className="px-4 py-4">
            {/* Meta row */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <FiClock className="h-3.5 w-3.5" /> {post.date}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span className="inline-flex items-center gap-1">
                <FiMapPin className="h-3.5 w-3.5" /> {post.location}
              </span>
              <span className="ml-auto px-3 py-1.5 rounded-2xl border border-gray-200 inline-flex items-center gap-1 text-xs text-gray-600">
                <span className="h-4 w-4 rounded-sm bg-gray-400" /> {votes}
              </span>
            </div>

            {/* Sector */}
            <div className="mt-3 flex items-center gap-3">
              <div className="text-xs font-semibold text-gray-900">Sector:</div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 text-xs text-gray-600">
                <span className="h-4 w-4 bg-gray-400 rounded-sm" /> Roads &
                Infrastructure
              </div>
            </div>

            {/* Title row */}
            <div className="mt-4 flex items-center gap-2">
              <h3 className="flex-1 text-lg font-bold text-gray-900 leading-snug">
                {post.title}
              </h3>
              <button
                aria-label="Share"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiShare2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Description */}
            <p className="mt-2 text-gray-600 text-sm md:text-base leading-tight tracking-tight">
              {post.description}
            </p>

            {/* Reported Impact */}
            <div className="mt-5">
              <div className="text-gray-900 text-sm font-semibold">
                Reported Impact:
              </div>
              <ul className="mt-1 list-disc pl-5 text-gray-600 text-sm md:text-base leading-tight">
                <li>School vans and buses face delays daily</li>
                <li>Public transport frequently skips this route</li>
                <li>Risk to pedestrians due to lack of sidewalks</li>
              </ul>
            </div>

            {/* Community Notes */}
            <div className="mt-5">
              <div className="text-gray-900 text-sm font-semibold">
                Community Notes:
              </div>
              <p className="mt-1 text-gray-600 text-sm md:text-base leading-tight">
                This road is the only direct route to the Matugama Divisional
                Hospital. The delay in repairs is affecting emergency services.
              </p>
            </div>

            {/* Comment box - only show if user hasn't voted yet */}
            {!hasUpvoted && (
              <div className="mt-6">
                <div className="text-xs text-gray-600 mb-1">
                  Add a comment (optional)
                </div>
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full resize-y min-h-[7rem] p-3 rounded-lg ring-1 ring-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400"
                  placeholder="Provide as much detail as possible (what's wrong, how long it's been happening, who is affected, etc.)"
                />
              </div>
            )}

            {/* Already voted message */}
            {hasUpvoted && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Thank you for voting on this issue! Your voice has been
                  heard.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 z-10 px-4 pb-4 pt-3 bg-white border-t border-gray-200 rounded-b-2xl md:rounded-b-2xl">
        <button
          onClick={handleVote}
          disabled={isLoading || hasUpvoted}
          className={`w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl font-bold transition-colors duration-200 ${
            hasUpvoted
              ? "bg-gray-600/80 text-white cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <FiArrowUp className="h-5 w-5" />
          {isLoading ? "Loading..." : hasUpvoted ? "Voted ✓" : "Vote"}
        </button>
      </div>
    </ReactModal>
  );
}
