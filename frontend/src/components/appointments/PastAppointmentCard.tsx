import { FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { PiWarningCircleLight } from "react-icons/pi";

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
  onSchedule,} : {
    appointment: Appointment;
    onSchedule?: (post: Appointment) => void;
}) {
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3 border-gray-200"
    >
      {/* Top title + badge */}
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-gray-900 leading-snug">
          {appointment.title}
        </h3>
      </div>

      {/* Person */}
      <div className="flex items-center gap-2">
        <img
          src="appointment/img1.png"
          alt={appointment.person}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{appointment.person}</span>
          <span className="text-xs text-gray-500">{appointment.position}</span>
        </div>
      </div>

      {/* Contact info */}
      <div className="flex items-center gap-2 text-blue-600 text-sm">
        <FiPhone className="w-4 h-4" />
        <a href={`tel:${appointment.phone}`} className="underline">
          {appointment.phone}
        </a>
      </div>
      <div className="flex items-center gap-2 text-blue-600 text-sm">
        <FiMapPin className="w-4 h-4" />
        <a href="#" className="underline">
          {appointment.location}
        </a>
      </div>

      {/* Date & time */}
      <div className="bg-gray-100 rounded-md p-3 flex items-center gap-2 text-sm">
        <FiCalendar className="w-4 h-4 text-gray-600" />
          <span>{appointment.date}</span>
      </div>

      {/* Button */}
      <button 
      onClick={() => onSchedule?.(appointment)}
      className="flex justify-center items-center border border-gray-300 rounded-md py-2 px-4 font-medium hover:bg-gray-50">
        <PiWarningCircleLight className="h-5 w-5 mr-2" />View Details
      </button>
    </div>
  );
}
