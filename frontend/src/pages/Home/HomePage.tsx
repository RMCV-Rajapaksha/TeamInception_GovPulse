import Trending from "../../components/sections/Trending";
import PostCard from "../../components/posts/PostCard";
import type { Post } from "../../components/posts/PostCard";
import { useState, useEffect } from "react";
import PostDetailsModal from "../../components/posts/PostDetailsModal";
import { apiService, transformIssueToPost } from "../../utils/api";

export default function HomePage() {
  const [selected, setSelected] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleVote = (post: Post) => {
    setSelected(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  // Handle vote updates from the modal
  const handleVoteUpdate = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setSelected(updatedPost);
  };

  // ...existing code...
  // Fetch issues from the backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch issues from the backend
        const issues = await apiService.getIssues();

        // Get issue IDs for fetching upvote counts
        const issueIds = issues.map((issue) => issue.issue_id);

        // Fetch upvote counts for all issues
        const upvoteCounts = await apiService.getUpvoteCounts(issueIds);

        // Transform issues to posts format with upvote counts
        const transformedPosts = issues.map((issue) =>
          transformIssueToPost(issue, upvoteCounts[issue.issue_id] || 0)
        );

        setPosts(transformedPosts);
      } catch (err) {
        console.error("Error fetching issues:", err);
        setError("Failed to load issues. Please try again later.");
        // Fallback to empty array
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ...existing trending items and loading/error states...

  const trendingItems = [
    {
      id: "1",
      title: "Trains delayed on several lines",
      imageUrl: "/trending/img1.png",
    },
    {
      id: "2",
      title: "A drinking water crisis in Welikanda",
      imageUrl: "/trending/img2.png",
    },
    {
      id: "3",
      title:
        "Madampitiya landfill a 'serious threat' to the environment and health.",
      imageUrl: "/trending/img3.png",
    },
    {
      id: "4",
      title: "A drinking water crisis in Welikanda",
      imageUrl: "/trending/img4.png",
    },
    {
      id: "5",
      title: "A drinking water crisis in Welikanda",
      imageUrl: "/trending/img1.png",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="pb-24 md:ml-72 px-10 md:px-0 md:pl-20 md:pr-60">
        <Trending items={trendingItems} />
        <div className="w-full mt-10 h-px">
          <div className="border-t border-gray-200" />
        </div>
        <div className="mt-6 flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading issues...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pb-24 md:ml-72 px-10 md:px-0 md:pl-20 md:pr-60">
        <Trending items={trendingItems} />
        <div className="w-full mt-10 h-px">
          <div className="border-t border-gray-200" />
        </div>
        <div className="mt-6 flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:ml-72 px-10 md:px-0 md:pl-20 md:pr-60">
      <Trending items={trendingItems} />
      <div className="w-full mt-10 h-px">
        <div className="border-t border-gray-200" />
      </div>

      {posts.length === 0 ? (
        <div className="mt-6 flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0v6a1 1 0 001 1h10a1 1 0 001-1v-6m-12 0V9a1 1 0 011-1h10a1 1 0 011-1v4"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">No issues found</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to report an issue in your community!
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="py-4">
              <PostCard post={post} onVote={handleVote} />
            </div>
          ))}
        </div>
      )}

      <PostDetailsModal
        post={selected}
        isOpen={open}
        onClose={handleClose}
        onVoteUpdate={handleVoteUpdate}
      />
    </div>
  );
}
