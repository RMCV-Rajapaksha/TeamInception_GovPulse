import { useNavigate, useLocation } from 'react-router-dom';
import { ConfirmBookingView } from '../../components/services';

export default function ConfirmBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as {
    serviceLabel?: string;
    selectedLocation?: string;
    dateTimeLabel?: string;
  };

  const serviceLabel = state.serviceLabel || 'Applying for Light Vehicles (B/B1) driving license';
  const locationLabel = state.selectedLocation || 'Select a location';
  const dateTimeLabel = state.dateTimeLabel || '';

  const handleConfirm = async () => {
    try {
      // Call backend API to confirm appointment and generate QR code
      const response = await fetch('http://localhost:4000/api/appointments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_12345', // Will come from auth context
          serviceType: 'driving_license_b1',
          locationId: 'colombo_dmv_office_1',
          dateTime: dateTimeLabel,
          timeSlotId: 'slot_001',
          userName: 'John Doe', // Will come from auth context
          locationLabel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to confirm appointment');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to confirm appointment');
      }

      console.log('Booking confirmed:', result);
      
      // Navigate to confirmation page with appointment details and QR code
      navigate('/services/driving-license/confirmed', {
        state: {
          appointmentId: result.appointmentId,
          userName: 'John Doe', // Will come from auth context
          serviceLabel,
          selectedLocation: locationLabel,
          dateTimeLabel,
          qrCodeData: result.qrCodeSvg, // Base64 encoded SVG from backend
          receiptHTML: result.receiptHTML // Base64 encoded HTML receipt
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to confirm booking. Please try again.');
    }
  };

  const handleTimeExpired = () => {
    alert('Your booking session has expired. The time slot has been released. Please select a new time slot.');
    navigate(-1); // Go back to booking page
  };

  return (
    <div className="relative w-full min-h-full overflow-x-hidden">
      <div className="w-full pb-24 md:ml-[14rem] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col min-h-full">
        <div className="w-full max-w-none md:max-w-[calc(100vw-14rem-4rem)] lg:max-w-[1000px] flex flex-col gap-2 pb-2 pt-0 relative z-10">
          <ConfirmBookingView
            onChangeDateTime={() => navigate(-1)}
            onConfirm={handleConfirm}
            onTimeExpired={handleTimeExpired}
            serviceLabel={serviceLabel}
            locationLabel={locationLabel}
            dateTimeLabel={dateTimeLabel}
          />
        </div>
      </div>
    </div>
  );
}
