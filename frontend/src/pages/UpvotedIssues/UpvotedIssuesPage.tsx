import { useState } from "react";
import ReportCard, { type Issue } from "@/components/reports/ReportCard";
import ReportBottomSheet from "@/components/reports/ReportBottomSheet";

export default function UpvotedIssuesPage() {
    const [selected, setSelected] = useState<Issue | null>(null);
      const [open, setOpen] = useState(false);
    
      const handleInsights = (issue: Issue) => {
        setSelected(issue);
        setOpen(true);
      };
      const handleClose = () => setOpen(false);

      const issues: Issue[] = [
        {
            imageUrl: "/post/post1.jpg",
            date: "July 22, 2025",
            location: "Matugama, Kalutara",
            views: 386, // from posts.votes
            title: "Severely Damaged Road Near Matugama Town",
            description:
            "The main access road leading into Matugama town from the southern expressway has been severely damaged for over six months. Multiple large potholes, broken tarmac, and poor drainage have made the road nearly unusable during heavy rains. Local residents and daily commuters report frequent accidents and vehicle breakdowns.",
            sector: "Roads & Infrastructure",
            id: "#SL-GOV-2025-00483",
            statusHistory: [
            { title: "Work Completed", date: "2 Aug 2025 — 10:15 AM" },
            {
                title: "Work in Progress",
                date: "27 July 2025 — 3:40 PM",
                details: "Repair crew assigned. Expected completion within 5 days.",
            },
            { title: "Verified", date: "24 July 2025 — 9:05 AM" },
            { title: "Submitted", date: "22 July 2025 — 11:27 AM" },
            ],
        },
        {
            imageUrl: "/post/post2.jpg",
            date: "July 30, 2025",
            location: "Gampola, Kandy",
            views: 237,
            title: "Cracked Walls at Ranabima College",
            description:
            "Several buildings at Ranabima Royal College have fallen into a state of disrepair. Leaking roofs, exposed wiring, and visible cracks in classroom walls are affecting the safety of students.",
            sector: "Education",
            id: "#SL-GOV-2025-00484",
            statusHistory: [
            { title: "Verified", date: "31 July 2025 — 9:15 AM" },
            { title: "Submitted", date: "30 July 2025 — 8:45 AM" },
            ],
        },
        {
            imageUrl: "/post/post2.jpg",
            date: "July 30, 2025",
            location: "Gampola, Kandy",
            views: 237,
            title: "Cracked Walls at Ranabima College",
            description:
            "Several buildings at Ranabima Royal College have fallen into a state of disrepair. Leaking roofs, exposed wiring, and visible cracks in classroom walls are affecting the safety of students.",
            sector: "Education",
            id: "#SL-GOV-2025-00485",
            statusHistory: [
            { title: "Verified", date: "31 July 2025 — 9:15 AM" },
            { title: "Submitted", date: "30 July 2025 — 8:45 AM" },
            ],
        },
        ];

    
  return (
    <div className="pb-24 md:ml-[14rem] px-10 md:px-0 md:pl-[5rem] md:pr-[15rem]">
      {/* Header */}
      <div className="px-8 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Upvoted issues</h1>
        <p className="mt-1 text-gray-600 text-base leading-tight tracking-tight">
          See the issues you’ve supported to help them get noticed and prioritized.
        </p>
      </div>

    {/* Reports List */}
    <div className="mt-6 divide-y divide-gray-200">
            {issues.map((issue) => (
                <div key={issue.id} className="py-4">
                <ReportCard issue={issue} onVote={handleInsights} />
                </div>
            ))}
            </div>
    
            <ReportBottomSheet issue={selected} isOpen={open} onClose={handleClose} />
    </div>
  )
}
