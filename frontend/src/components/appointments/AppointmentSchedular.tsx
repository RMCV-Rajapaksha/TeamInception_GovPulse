import { useState, useEffect } from "react";
import { ArrowLeft, Phone, MapPin, Calendar, Clock, AlertTriangle, X } from "lucide-react";
import AppointmentConfirmationDialog from "./AppointmentConfirmationDialog";
import AppointmentDetailsBottomSheet from "./AppointmentDetailsBottomSheet";

export default function AppointmentScheduler({
  appointment,
  isOpen,
  onClose,
}: {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);

  const handleConfirmAppointment = () => {
    setShowConfirmDialog(true);
  };

  const handleFinalConfirm = () => {
    // Handle final appointment confirmation
    setShowConfirmDialog(false);
    setShowDetailsSheet(true);
    // Add your appointment confirmation logic here
  };

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleReschedule = () => {
    setShowDetailsSheet(false);
    // Reset to scheduler view or handle reschedule logic
  };

  const handleCancelAppointment = () => {
    setShowDetailsSheet(false);
    onClose();
    // Add cancellation logic here
  };

  const availableSlots = [
    { time: "08:00-08:30", available: true },
    { time: "08:30-09:00", available: true, selected: false },
    { time: "09:30-10:00", available: true },
    { time: "11:00-11:30", available: true },
    { time: "13:00-13:30", available: false },
    { time: "13:30-14:00", available: false }
  ];

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000]">
      <div className="fixed inset-0 w-screen h-screen bg-white rounded-none shadow-xl outline-none flex flex-col md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 md:inset-auto md:w-[min(92vw,36rem)] md:h-auto md:max-h-[90vh] md:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-start px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <div className="font-semibold text-gray-900">Schedule an appointment</div>
        </div>
        
        <div className="flex-1 overflow-auto">{/* Scrollable content wrapper */}

      <div className="p-4">
        {/* Status */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Status:</div>
          <div className="text-sm font-medium text-gray-900">Need to scheduled</div>
        </div>

        {/* Appointment ID */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Appointment ID:</div>
          <div className="text-sm font-medium text-gray-900">{appointment.id}</div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
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
        <div className="flex items-center text-blue-600 mb-3">
          <Phone className="h-4 w-4 mr-2" />
          <a href={`tel:${appointment.phone}`} className="text-sm underline">{appointment.phone}</a>
        </div>

        {/* Location */}
        <div className="flex items-center text-blue-600 mb-6">
          <MapPin className="h-4 w-4 mr-2" />
          <a href="#" className="text-sm underline">{appointment.location}</a>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Calendar className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-base font-medium text-gray-900">Tuesday, 6 Aug 2025</span>
          </div>
          
          {/* Date Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <span className="text-yellow-800">Not available on 6 Aug 2025?</span>
                <button 
                  className="text-blue-600 underline ml-1"
                  onClick={() => setShowDatePicker(true)}
                >
                  Request a different date
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Available Slots:</h3>
          <div className="grid grid-cols-2 gap-3">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.time)}
                className={`
                  px-4 py-3 rounded-lg text-sm font-medium border transition-colors
                  ${!slot.available 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : selectedSlot === slot.time
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            className="w-full bg-black text-white py-4 rounded-lg font-medium flex items-center justify-center"
            disabled={!selectedSlot}
            onClick={handleConfirmAppointment}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Confirm Appointment
          </button>
          
          <button 
          className="w-full border border-red-500 text-red-500 py-4 rounded-lg font-medium flex items-center justify-center hover:bg-red-50">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Cancel Appointment
          </button>
        </div>

      </div>
    </div>
    </div>
        <AppointmentConfirmationDialog isOpen={showConfirmDialog} onClose={handleCloseConfirmDialog} onConfirm={handleFinalConfirm} selectedTimeSlot={selectedSlot} />
        <AppointmentDetailsBottomSheet appointment={appointment} isOpen={showDetailsSheet} onClose={() => setShowDetailsSheet(false)} onReschedule={handleReschedule} onCancel={handleCancelAppointment} scheduledDateTime={`${appointment.date} · ${selectedSlot}`} />
    </div>
  );
}