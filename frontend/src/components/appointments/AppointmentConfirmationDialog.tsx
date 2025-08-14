import { CheckCircle } from "lucide-react";

export default function AppointmentConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedTimeSlot,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedTimeSlot: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            You've selected
          </h2>
          <div className="text-xl font-bold text-gray-900 mb-3">
            {selectedTimeSlot}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Please confirm to finalize your appointment.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Confirm appointment
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}