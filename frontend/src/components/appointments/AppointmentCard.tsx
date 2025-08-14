import { BsCalendar2Week } from "react-icons/bs";
import { FiPhone, FiMapPin } from "react-icons/fi";

export type Appointment = {
  id: string; // unique identifier
  title: string;
  person: string;
  position: string;
  phone: string;
  location: string;
  date?: string; // optional if not yet scheduled
  highlight?: boolean; // e.g., for "New"
};

export default function AppointmentCard({
  appointment,
  onSchedule,
}: {
  appointment: Appointment;
  onSchedule?: (post: Appointment) => void;
}) {
  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 flex flex-col gap-3 ${
        appointment.highlight ? "border-yellow-200" : "border-gray-200"
      }`}
    >
      {/* Top title + badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-gray-900 leading-tight text-sm sm:text-base flex-1 min-w-0 pr-1">
          {appointment.title}
        </h3>
        {appointment.highlight && (
          <span className="text-xs bg-yellow-200 text-gray-900 font-semibold px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 mt-0.5">
            New
          </span>
        )}
      </div>
      
      {/* Person */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
          <img
            src="appointment/img1.png"
            alt={appointment.person}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm sm:text-base font-medium truncate">
            {appointment.person}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 truncate">
            {appointment.position}
          </span>
        </div>
      </div>
      
      {/* Contact info */}
      <div className="flex items-center gap-2 text-blue-600 text-sm">
        <FiPhone className="w-4 h-4 flex-shrink-0" />
        <a href={`tel:${appointment.phone}`} className="underline truncate">
          {appointment.phone}
        </a>
      </div>
      
      <div className="flex items-center gap-2 text-blue-600 text-sm">
        <FiMapPin className="w-4 h-4 flex-shrink-0" />
        <a href="#" className="underline truncate">
          {appointment.location}
        </a>
      </div>
      
      {/* Date & time */}
      <div className="bg-yellow-100 rounded-md p-3 flex items-center gap-2 text-sm">
        <BsCalendar2Week className="w-4 h-4 text-black flex-shrink-0" />
        {appointment.date ? (
          <span className="truncate">{appointment.date}</span>
        ) : (
          <span className="text-red-600 font-medium">
            Schedule this appointment today
          </span>
        )}
      </div>
      
      {/* Button */}
      <button 
        onClick={() => onSchedule?.(appointment)}
        className="border border-gray-300 rounded-md py-2.5 px-4 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        Schedule now
      </button>
    </div>
  );
}