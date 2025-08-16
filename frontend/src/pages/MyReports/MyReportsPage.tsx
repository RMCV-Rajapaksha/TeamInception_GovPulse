import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ReportCard, { type Issue as ReportCardIssue } from "@/components/reports/ReportCard";
import ReportBottomSheet from "@/components/reports/ReportBottomSheet";
import { apiService, transformIssueToPost } from "@/utils/api"; 

export default function MyReportsPage() {
  const { getToken } = useAuth();
  const [selected, setSelected] = useState<ReportCardIssue | null>(null);
  const [open, setOpen] = useState(false);
  const [issues, setIssues] = useState<ReportCardIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const handleInsights = (issue: ReportCardIssue) => {
    setSelected(issue);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchUserIssues = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          console.error("No authentication token available");
          return;
        }
        const data = await apiService.getUserIssues(token); 
        console.log("Fetched user issues:", data);
        const upvoteCounts = await apiService.getUpvoteCounts(data.map((i) => i.issue_id));

        const transformed = data.map((issue) => {
          const base = transformIssueToPost(issue, upvoteCounts[issue.issue_id] || 0);
          return {
            ...base,
            sector: issue.Category?.category_name || "General",
            views: upvoteCounts[issue.issue_id] || 0, // Map votes to views
            id: `#SL-GOV-${issue.issue_id.toString().padStart(8, "0")}`, // custom ID format
            statusHistory: [
              {
                title: issue.Issue_Status?.status_name || "Submitted",
                date: base.date,
              },
            ],
          } as ReportCardIssue;
        });

        setIssues(transformed);
      } catch (err) {
        console.error("Failed to fetch user issues", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIssues();
  }, []);

  return (
    <div className="pb-24 md:ml-[14rem] px-10 md:px-0 md:pl-[5rem] md:pr-[15rem]">
      {/* Header */}
      <div className="px-8 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
        <p className="mt-1 text-gray-600 text-base leading-tight tracking-tight">
          View and track all your reported issues
        </p>
      </div>

      {/* Reports List */}
      <div className="mt-6 divide-y divide-gray-200">
        {loading ? (
          <p className="text-gray-500">Loading your reports...</p>
        ) : issues.length === 0 ? (
          <p className="text-gray-500">No reports found.</p>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="py-4">
              <ReportCard issue={issue} onVote={handleInsights} />
            </div>
          ))
        )}
      </div>

      <ReportBottomSheet issue={selected} isOpen={open} onClose={handleClose} />
    </div>
  );
}
