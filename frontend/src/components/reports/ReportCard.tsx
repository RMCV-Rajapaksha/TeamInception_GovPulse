import {
  FiClock,
  FiMapPin,
  FiMoreHorizontal,
  FiMessageCircle,
} from "react-icons/fi";

import { PiShareFatThin, PiWarningCircleLight } from "react-icons/pi";

export type Issue = {
  imageUrl: string;
  date: string;
  location: string;
  views: number; // replacing votes
  title: string;
  description: string;
  sector: string;
  id: string;
  status?: string; // optional: Pending / Resolved
  statusHistory: {
    title: string;
    date: string;
    details?: string;
  }[];
};

export default function ReportCard({
  issue,
  onVote,
}: {
  issue: Issue;
  onVote?: (issue: Issue) => void;
}) {
  const {
    title,
    description,
    date,
    location,
    views,
    status,
    imageUrl,
  } = issue;

  return (
    <article className="w-full">
      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-wrap w-full py-6 lg:py-8 gap-6 lg:gap-8">
        {/* Left content */}
        <div className="flex-3 flex flex-col gap-3 lg:gap-4">
          {/* Meta row */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <FiClock className="h-3.5 w-3.5" /> {date}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <FiMapPin className="h-3.5 w-3.5" /> {location}
              </span>
            </div>
            <div className="px-3 lg:px-4 py-2 rounded-2xl ring-1 ring-gray-200 inline-flex items-center gap-1 text-xs text-gray-600">
              <FiMessageCircle className="h-4 w-4" />
              <span>{views}</span>
            </div>
            <button className="rounded-2xl hover:bg-gray-100" aria-label="Share">
              <PiShareFatThin className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-base lg:text-lg font-bold leading-snug text-gray-900">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm lg:text-base leading-tight tracking-tight">
            {description}
          </p>

          {/* Actions */}
          <div className="flex">
            <button
              onClick={() => onVote?.(issue)}
              className="flex items-center gap-2 h-10 lg:h-11 px-3 lg:px-4 rounded-2xl ring-1 ring-gray-300 bg-gray-50 text-gray-900 font-bold"
            >
              <PiWarningCircleLight className="h-5 w-5" /> View insights
            </button>
          </div>
        </div>

        {/* Right image + status */}
        <div className="flex-2 md:min-w-[200px] relative rounded-2xl overflow-hidden">
          <img
            src={imageUrl}
            alt="Issue media"
            className="w-full h-full object-cover hover:scale-125 transition-all duration-500"
          />
          {status && (
            <div className="absolute top-2 right-2">
              <span className="px-3 lg:px-4 py-1.5 lg:py-2 bg-yellow-200 rounded-lg inline-flex items-center gap-2 text-xs text-gray-900">
                <span className="h-2 w-2 rounded-full bg-gray-900" />
                {status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden w-full pb-2">
        <div className="relative overflow-hidden rounded-none">
          <img
            src={imageUrl}
            alt="Issue media"
            className="w-full aspect-[16/9] object-cover"
          />
          {status && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-yellow-200 rounded-2xl inline-flex items-center gap-2 text-xs text-gray-900">
                <span className="h-2 w-2 rounded-full bg-gray-900" />
                {status}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 pt-2 flex flex-col gap-2">
          {/* Meta row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <FiClock className="h-3.5 w-3.5" /> {date}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span className="inline-flex items-center gap-1">
                <FiMapPin className="h-3.5 w-3.5" /> {location}
              </span>
            </div>
            <div className="px-2 py-1 rounded-2xl ring-1 ring-gray-200 inline-flex items-center gap-1 text-xs text-gray-600">
              <FiMessageCircle className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>

          {/* Title + more */}
          <div className="flex items-center gap-2">
            <h3 className="flex-1 text-base lg:text-lg font-bold leading-snug text-gray-900">
              {title}
            </h3>
            <button
              className="rounded-2xl hover:bg-gray-100"
              aria-label="More options"
            >
              <FiMoreHorizontal className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm lg:text-base leading-tight tracking-tight">
            {description}
          </p>

          {/* Actions */}
          <div className="py-2">
            <button
              onClick={() => onVote?.(issue)}
              className="flex items-center gap-2 h-10 lg:h-11 px-4 rounded-2xl ring-1 ring-gray-300 bg-gray-50 text-gray-900 font-bold w-full justify-center"
            >
              <PiWarningCircleLight className="h-5 w-5" /> View insights
            </button>
          </div>
        </div>

        <div className="px-4">
          <div className="h-px bg-gray-200" />
        </div>
      </div>
    </article>
  );
}
