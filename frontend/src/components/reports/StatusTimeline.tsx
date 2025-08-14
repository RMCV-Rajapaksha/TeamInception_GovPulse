import { CiCircleCheck } from "react-icons/ci";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdVerified, MdOutlinePending } from "react-icons/md";
import type { JSX } from "react";

const statusIcons: Record<string, JSX.Element> = {
  "Work Completed": <CiCircleCheck size={20} className="text-gray-700" />,
  "Work in Progress": <AiOutlineClockCircle size={20} className="text-gray-700" />,
  "Verified": <MdVerified size={20} className="text-gray-700" />,
  "Submitted": <MdOutlinePending size={20} className="text-gray-700" />,
};

export default function StatusTimeline({ statusHistory }: { statusHistory: any[] }) {
  // Make sure all 4 possible statuses exist, filling missing ones with "pending"
  const fullOrder = [
    "Work Completed",
    "Work in Progress",
    "Verified",
    "Submitted",
  ];

  const mergedHistory = fullOrder.map((title) => {
    return statusHistory.find((s) => s.title === title) || { title, date: null, details: null };
  });

  const lastCompletedIndex = mergedHistory.findIndex((s) => !s.date) - 1;

  return (
    <div className="flex flex-col gap-4">
      {mergedHistory.map((status, idx) => {
        const isLast = idx === mergedHistory.length - 1;
        const lineColor =
          idx <= lastCompletedIndex ? "bg-green-500" : "bg-gray-300";

        return (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className='p-2 rounded-md bg-gray-100'
              >
                {statusIcons[status.title]}
              </div>
              {!isLast && (
                <div className={`w-px flex-1 ${lineColor}`} />
              )}
            </div>
            <div>
              <div
                className="font-medium text-sm text-gray-900"
              >
                {status.title}
              </div>
              {status.date && (
                <div className="text-xs text-gray-500">{status.date}</div>
              )}
              {status.details && (
                <p className="mt-1 text-xs text-gray-600">{status.details}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
