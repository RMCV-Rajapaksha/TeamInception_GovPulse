import { X, Phone, MapPin, AlertTriangle } from "lucide-react";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { BsCalendar2Week } from "react-icons/bs";

export default function AppointmentDetailsBottomSheet({
  appointment,
  isOpen,
  onClose,
  onReschedule,
  onCancel,
  scheduledDateTime,
}: {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  scheduledDateTime: string;
}) {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000]">
      <div className="fixed inset-0 w-screen h-screen bg-white rounded-none shadow-xl outline-none flex flex-col md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 md:inset-auto md:w-[min(92vw,36rem)] md:h-auto md:max-h-[90vh] md:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-end px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {/* Status */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-900">
                Status:
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl ring-1 ring-gray-200 text-xs text-gray-600">
                {/* {appointment.status} */}
                Confirmed
              </div>
            </div>

          {/* Appointment ID */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-900">
                Appointment ID:
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl ring-1 ring-gray-200 text-xs text-gray-600">
                {appointment.id} 
              </div>
            </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight pt-2">
            {appointment.title}
          </h2>

          {/* Contact Info */}
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">with {appointment.person}</div>
              <div className="text-xs text-gray-600">{appointment.position}</div>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center text-blue-600 mb-3 pt-5">
            <Phone className="h-4 w-4 mr-2" />
            <a href={`tel:${appointment.phone}`} className="text-sm underline">{appointment.phone}</a>
          </div>

          {/* Location */}
          <div className="flex items-center text-blue-600 mb-6">
            <MapPin className="h-4 w-4 mr-2" />
            <a href="#" className="text-sm underline">{appointment.location}</a>
          </div>

          {/* Date & Time */}
          <div className="mb-8 pt-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <BsCalendar2Week className="h-5 w-5 text-black mr-3" />
                <div>
                  <div className="text-xs text-gray-600 mb-1">DATE & TIME</div>
                  <div className="text-base font-semibold text-gray-900">
                    {scheduledDateTime}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={onReschedule}
              className="w-full bg-white text-black border-black border py-4 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <IoCalendarNumberOutline className="h-5 w-5 mr-2" />
              Reschedule
            </button>
            
            <button 
              onClick={onCancel}
              className="w-full border border-red-500 text-red-500 py-4 rounded-lg font-medium flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Cancel Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}