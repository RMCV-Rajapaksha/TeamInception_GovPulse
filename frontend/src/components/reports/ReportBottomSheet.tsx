import { useEffect } from "react";
import ReactModal from "react-modal";
import { FiClock, FiMapPin, FiX } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import StatusTimeline from "./StatusTimeline";

export default function ReportBottomSheet({
  issue,
  isOpen,
  onClose,
}: {
  issue: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/60 z-[1000]"
      className="fixed inset-0 w-screen h-screen bg-white rounded-none shadow-xl outline-none flex flex-col md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 md:inset-auto md:w-[min(92vw,36rem)] md:h-auto md:max-h-[90vh] md:rounded-2xl"
      bodyOpenClassName="overflow-hidden"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
        <div className="text-sm text-gray-600">Issue details</div>
        <button
          aria-label="Close"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          <FiX className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {issue && (
        <div className="flex-1 overflow-auto">
          {/* Hero image */}
          <div className="relative">
            <img
              src={issue.imageUrl}
              alt="Issue media"
              className="w-full aspect-[16/9] object-cover"
            />
            {/* Status pill */}
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1.5 bg-green-100 rounded-lg inline-flex items-center gap-2 text-xs text-green-800 shadow">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Resolved
              </span>
            </div>
          </div>

          <div className="px-4 py-4">
            {/* Meta row */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <FiClock className="h-3.5 w-3.5" /> {issue.date}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span className="inline-flex items-center gap-1">
                <FiMapPin className="h-3.5 w-3.5" /> {issue.location}
              </span>
              <span className="ml-auto text-gray-500">{issue.views} views</span>
            </div>

            {/* Title */}
            <h3 className="mt-3 text-lg font-bold text-gray-900 leading-snug">
              {issue.title}
            </h3>

            {/* Description */}
            <p className="mt-1 text-gray-600 text-sm leading-tight">
              {issue.description}
            </p>

            {/* Sector */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-900">
                Sector:
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl ring-1 ring-gray-200 text-xs text-gray-600">
                <BsBuilding className="h-4 w-4" />
                {issue.sector}
              </div>
            </div>

            {/* Issue ID */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-900">
                Issue ID:
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl ring-1 ring-gray-200 text-xs text-gray-600">
                {issue.id}
              </div>
            </div>

            {/* Status History */}
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-gray-900">
                Status History:
              </h4>
              <div className="mt-3 flex flex-col gap-5">
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-gray-900">Status History:</h4>
                  <div className="mt-3">
                    <StatusTimeline statusHistory={issue.statusHistory} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ReactModal>
  );
}
