import { MapPin, Calendar, Info } from '@phosphor-icons/react';
import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';

// QR Code data interface
interface QRCodeData {
  appointmentId: string;
  userName: string;
  serviceType: string;
  location: string;
  dateTime: string;
  verificationHash: string;
  generatedAt: string;
}

interface AppointmentConfirmationProps {
  appointmentId: string;
  userName: string;
  serviceLabel: string;
  locationLabel: string;
  dateTimeLabel: string;
  qrCodeData?: string; // Will contain appointment verification data
  onAddToCalendar: () => void;
  onDownloadReceipt: () => void;
}

export default function AppointmentConfirmation({
  appointmentId,
  userName,
  serviceLabel,
  locationLabel,
  dateTimeLabel,
  qrCodeData,
  onAddToCalendar,
  onDownloadReceipt,
}: AppointmentConfirmationProps) {
  
  const [qrCodeString, setQrCodeString] = useState<string>('');

  useEffect(() => {
    // Generate QR code data
    const generateQRData = () => {
      const qrData: QRCodeData = {
        appointmentId,
        userName,
        serviceType: serviceLabel,
        location: locationLabel,
        dateTime: dateTimeLabel,
        verificationHash: generateSimpleHash(appointmentId + userName + dateTimeLabel),
        generatedAt: new Date().toISOString()
      };
      return JSON.stringify(qrData);
    };

    setQrCodeString(generateQRData());
  }, [appointmentId, userName, serviceLabel, locationLabel, dateTimeLabel]);

  // Simple hash function for demo purposes (use proper crypto in production)
  const generateSimpleHash = (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  };

  return (
    <div className="box-border flex flex-col gap-4 w-full pb-16">
      {/* Header */}
      <div className="flex flex-col gap-6 px-4 pt-2">
        <div className="flex flex-col gap-2">
          <h1
            className="font-bold text-[#000000] text-[32px] leading-normal"
            style={{ fontFamily: 'var(--font-family-title, "Plus Jakarta Sans")' }}
          >
            Appointment Confirmed!
          </h1>
        </div>
      </div>

      {/* Separator */}
      <div className="px-0 py-1">
        <div className="bg-[#d7d7d7] h-px w-full" />
      </div>

      {/* Main Content Card */}
      <div className="bg-[#ffffff] flex flex-row gap-6 px-4 rounded-2xl w-full">
        {/* Left Side - QR Code */}
        <div className="flex-1 flex flex-col gap-2 items-center p-0">
          <div className="flex flex-row gap-2 items-start justify-start w-full">
            <div
              className="flex-1 font-bold text-[#000000] text-[18px] text-center leading-[22px]"
              style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
            >
              {userName}
            </div>
          </div>
          
          <div className="flex flex-row gap-2 items-center justify-center py-1 w-full">
            <div
              className="font-medium text-[#4b4b4b] text-[12px] text-nowrap"
              style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
            >
              Appointment ID:
            </div>
            <div className="flex gap-1 items-center px-2 py-1 rounded-2xl border border-[#d7d7d7]">
              <div
                className="font-medium text-[#000000] text-[12px] text-nowrap"
                style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
              >
                {appointmentId}
              </div>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="w-64 h-64 relative bg-white p-4 rounded-lg border border-gray-200">
            {qrCodeString && (
              <QRCode
                value={qrCodeString}
                size={224}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            )}
          </div>
        </div>

        {/* Right Side - Appointment Details */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Service Info */}
          <div className="flex flex-row gap-2 items-start text-[16px]">
            <div className="text-[#4b4b4b] font-bold text-nowrap" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
              Service:
            </div>
            <div className="text-[#000000] tracking-[0.16px] flex-1" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
              {serviceLabel}
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 items-center p-1">
              <MapPin size={16} className="text-[#007aff]" />
              <div
                className="text-[#007aff] text-[16px] tracking-[0.16px] text-center"
                style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
              >
                {locationLabel}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-[#ffffa5] rounded-lg p-2 flex flex-row gap-4 items-center">
            <div className="rounded-3xl p-2 bg-gradient-to-b from-[#ffff7f] to-[#ffff00] relative shadow-[0_4px_4px_rgba(255,255,0,0.1),0_4px_12px_rgba(255,255,0,0.25)]">
              <div className="absolute inset-[-2px] rounded-[26px] border-2 border-[#ffffa5]" aria-hidden="true" />
              <Calendar size={24} className="text-[#000000]" />
            </div>
            <div className="flex flex-col gap-2" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
              <div className="text-[#4b4b4b] text-[12px]">DATE & TIME</div>
              <div className="text-[#000000] text-[16px] tracking-[0.16px] leading-5">{dateTimeLabel}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-neutral-100 flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-lg border border-[#d7d7d7]">
            <Info size={24} className="text-[#4b4b4b]" />
            <div
              className="flex-1 text-[#000000] text-[16px] tracking-[0.16px] leading-5"
              style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
            >
              Bring: Original documents + this confirmation QR code.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 h-[104px]">
            <button
              className="w-full h-11 rounded-lg border border-[#a7a7a2] flex items-center justify-center"
              style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
              onClick={onAddToCalendar}
            >
              <span className="text-[#000000] text-[18px] leading-[22px] font-bold">Add to calendar</span>
            </button>
            
            <button
              className="w-full h-11 rounded-lg bg-gradient-to-b from-[#1e1e1d] to-[#000000] shadow-[0px_4px_4px_rgba(0,0,0,0.1),0px_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center"
              style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
              onClick={onDownloadReceipt}
            >
              <span className="text-white text-[18px] leading-[22px] font-bold">Download receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
