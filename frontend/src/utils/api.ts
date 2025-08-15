import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Issue {
  issue_id: number;
  user_id: number;
  title: string;
  description: string | null;
  district: string | null;
  gs_division: string | null;
  ds_division: string | null;
  urgency_score: number | null;
  created_at: string;
  status_id: number | null;
  authority_id: number | null;
  category_id: number | null;
  image_urls: string | null;
  approved_for_appointment_placing: boolean | null;
  User?: {
    user_id: number;
    name: string;
    email: string;
  };
  Issue_Status?: {
    status_id: number;
    status_name: string;
  };
  Authority?: {
    authority_id: number;
    authority_name: string;
  };
  Category?: {
    category_id: number;
    category_name: string;
  };
}

export interface UpvoteCountResponse {
  issue_id: string;
  upvote_count: number;
}

// API functions
export const apiService = {
  // Fetch all issues
  async getIssues(): Promise<Issue[]> {
    try {
      const response = await axios.get(`${BACKEND_URL}/issues`);
      return response.data;
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error;
    }
  },

  // Get upvote count for a specific issue
  async getUpvoteCount(issueId: number): Promise<number> {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/upvotes/count/${issueId}`
      );
      return response.data.upvote_count;
    } catch (error) {
      // If authentication is required for upvotes, return 0 for now
      // This allows the app to work without user authentication for viewing
      console.error(`Error fetching upvote count for issue ${issueId}:`, error);
      return 0; // Return 0 if there's an error (e.g., authentication required)
    }
  },

  // Get upvote counts for multiple issues
  async getUpvoteCounts(issueIds: number[]): Promise<Record<number, number>> {
    const upvoteCounts: Record<number, number> = {};

    // Fetch upvote counts for all issues in parallel
    const promises = issueIds.map(async (issueId) => {
      try {
        const count = await this.getUpvoteCount(issueId);
        upvoteCounts[issueId] = count;
      } catch (error) {
        console.error(
          `Failed to get upvote count for issue ${issueId}:`,
          error
        );
        upvoteCounts[issueId] = 0;
      }
    });

    await Promise.all(promises);
    return upvoteCounts;
  },

  // Fetch issues for the logged-in user
  async getUserIssues(): Promise<Issue[]> {
    try {
      const response = await axios.get(`${BACKEND_URL}/user-issues`, {
        withCredentials: true, // in case cookies/session are used
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user issues:", error);
      throw error;
    }
  },
};

// Helper function to transform backend issue to frontend post format
export const transformIssueToPost = (issue: Issue, upvoteCount: number = 0) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLocation = (issue: Issue) => {
    const parts = [];
    if (issue.gs_division) parts.push(issue.gs_division);
    if (issue.ds_division) parts.push(issue.ds_division);
    if (issue.district) parts.push(issue.district);
    return parts.join(", ") || "Unknown Location";
  };

  const getStatusLabel = (
    statusName?: string
  ): "Pending" | "Resolved" | "In Review" => {
    if (!statusName) return "Pending";

    const lowerStatus = statusName.toLowerCase();
    if (
      lowerStatus.includes("resolved") ||
      lowerStatus.includes("completed") ||
      lowerStatus.includes("closed")
    ) {
      return "Resolved";
    } else if (
      lowerStatus.includes("review") ||
      lowerStatus.includes("progress") ||
      lowerStatus.includes("assigned")
    ) {
      return "In Review";
    }
    return "Pending";
  };

  // Get the first image URL if available
  const getImageUrl = (imageUrls?: string | null) => {
    if (!imageUrls) return "/post/post1.jpg"; // fallback to existing image

    try {
      const urls = imageUrls.split(",").map((url) => url.trim());
      return urls[0] || "/post/post1.jpg";
    } catch {
      return "/post/post1.jpg";
    }
  };

  return {
    id: issue.issue_id.toString(),
    title: issue.title,
    description: issue.description || "",
    date: formatDate(issue.created_at),
    location: getLocation(issue),
    votes: upvoteCount,
    status: getStatusLabel(issue.Issue_Status?.status_name),
    imageUrl: getImageUrl(issue.image_urls),
  };
};
