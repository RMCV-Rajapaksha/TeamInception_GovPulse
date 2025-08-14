import { useLocation } from 'react-router-dom';
import { AppointmentConfirmation } from '../../components/services';

export default function AppointmentConfirmationPage() {
  const location = useLocation();
  const state = (location.state || {}) as {
    appointmentId?: string;
    userName?: string;
    serviceLabel?: string;
    selectedLocation?: string;
    dateTimeLabel?: string;
    qrCodeData?: string;
  };

  // Generate unique appointment ID if not provided
  const appointmentId = state.appointmentId || `#SL-GOV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
  const userName = state.userName || 'John Doe'; // Will come from auth context
  const serviceLabel = state.serviceLabel || 'Applying for Light Vehicles (B/B1) driving license';
  const locationLabel = state.selectedLocation || 'City Planning Office, Suite 5.';
  const dateTimeLabel = state.dateTimeLabel || '';

  const handleAddToCalendar = () => {
    // Generate calendar event
    const startDate = new Date(); // Parse from dateTimeLabel in real implementation
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(serviceLabel)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(`Appointment ID: ${appointmentId}\nLocation: ${locationLabel}\nBring: Original documents + QR code confirmation`)}&location=${encodeURIComponent(locationLabel)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleDownloadReceipt = () => {
    // TODO: Generate and download PDF receipt
    console.log('Generating receipt for appointment:', appointmentId);
    alert('Receipt download will be implemented with backend integration');
  };

  return (
    <div className="relative w-full min-h-full overflow-x-hidden">
      <div className="w-full pb-24 md:ml-[14rem] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col min-h-full">
        <div className="w-full max-w-none md:max-w-[calc(100vw-14rem-4rem)] lg:max-w-[1200px] flex flex-col gap-2 pb-2 pt-0 relative z-10">
          <AppointmentConfirmation
            appointmentId={appointmentId}
            userName={userName}
            serviceLabel={serviceLabel}
            locationLabel={locationLabel}
            dateTimeLabel={dateTimeLabel}
            qrCodeData={state.qrCodeData}
            onAddToCalendar={handleAddToCalendar}
            onDownloadReceipt={handleDownloadReceipt}
          />
        </div>
      </div>
    </div>
  );
}
