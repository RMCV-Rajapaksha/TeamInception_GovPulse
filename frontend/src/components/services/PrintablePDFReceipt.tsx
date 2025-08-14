import QRCode from 'react-qr-code';
import { MapPin, Calendar, Info } from '@phosphor-icons/react';

interface PrintablePDFReceiptProps {
  appointmentId: string;
  userName: string;
  serviceLabel: string;
  locationLabel: string;
  dateTimeLabel: string;
  qrCodeString: string;
}

// Logo component matching Figma design
function GovPulseLogo() {
  return (
    <div className="relative w-[250px] h-[49px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-2xl font-bold">
          <span className="text-red-500">~</span>
          <span className="text-blue-500">~</span>
          <span className="text-green-500">~</span>
          <span className="text-black ml-1">GovPulse</span>
        </div>
      </div>
    </div>
  );
}

export default function PrintablePDFReceipt({
  appointmentId,
  userName,
  serviceLabel,
  locationLabel,
  dateTimeLabel,
  qrCodeString,
}: PrintablePDFReceiptProps) {
  
  return (
    <div 
      className="bg-white box-border flex flex-col gap-8 items-center justify-start px-16 py-8 w-full min-h-screen"
      id="printable-receipt"
      style={{ 
        fontFamily: 'Satoshi, sans-serif',
        maxWidth: '210mm', // A4 width
        margin: '0 auto'
      }}
    >
      {/* Header Container */}
      <div className="flex flex-col gap-4 items-center justify-start w-full">
        <GovPulseLogo />
      </div>

      {/* QR Code Container */}
      <div className="flex flex-col gap-4 items-center justify-start w-full">
        {/* User Name */}
        <div className="font-bold text-lg text-black text-center leading-[22px]">
          {userName}
        </div>

        {/* QR Code */}
        <div className="w-[216px] h-[216px] p-2 bg-white border border-gray-300">
          <QRCode
            value={qrCodeString}
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox="0 0 256 256"
          />
        </div>

        {/* Appointment ID */}
        <div className="flex flex-row gap-2 items-center justify-center px-0 py-1 w-full">
          <div className="text-xs font-medium text-[#4b4b4b] text-nowrap">
            Appointment ID:
          </div>
          <div className="flex items-center justify-start px-2 py-1 rounded-2xl border border-[#d7d7d7]">
            <div className="text-xs font-medium text-black text-nowrap">
              {appointmentId}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Card */}
      <div className="bg-white flex flex-col gap-4 items-start justify-start px-4 py-0 rounded-2xl w-full">
        
        {/* Service Info */}
        <div className="flex flex-row gap-2 items-start justify-start w-full">
          <div className="font-bold text-base text-[#4b4b4b] text-nowrap">
            Service:
          </div>
          <div className="flex-1 font-medium text-base text-black tracking-[0.16px] leading-[20px]">
            {serviceLabel}
          </div>
        </div>

        {/* Location Info */}
        <div className="flex flex-row gap-1 items-center justify-start w-full">
          <div className="font-bold text-base text-[#4b4b4b] text-nowrap">
            Location:
          </div>
          <div className="flex-1 flex flex-row gap-2 items-center justify-start p-1">
            <MapPin size={16} className="text-[#007aff]" />
            <div className="font-medium text-base text-[#007aff] text-center text-nowrap tracking-[0.16px] leading-[20px]">
              {locationLabel}
            </div>
          </div>
        </div>

        {/* Date & Time Container */}
        <div className="bg-[#ffffa5] flex flex-row gap-4 items-start justify-start p-2 rounded-lg w-full">
          <div className="bg-gradient-to-b from-[#ffff7f] to-[#ffff00] flex items-center justify-center p-2 rounded-3xl border-2 border-[#ffffa5] shadow-[0px_4px_4px_0px_rgba(255,255,0,0.1),0px_4px_12px_0px_rgba(255,255,0,0.25)]">
            <Calendar size={24} className="text-black" />
          </div>
          <div className="flex flex-col gap-2 items-start justify-start font-medium">
            <div className="text-xs text-[#4b4b4b]">
              DATE & TIME
            </div>
            <div className="text-base text-black tracking-[0.16px] leading-[20px]">
              {dateTimeLabel}
            </div>
          </div>
        </div>

        {/* Instructions Container */}
        <div className="bg-neutral-100 flex flex-row gap-2 items-start justify-start px-4 py-2 rounded-lg border border-[#d7d7d7] w-full">
          <Info size={24} className="text-gray-600 mt-1" />
          <div className="flex-1 font-medium text-base text-black tracking-[0.16px]">
            <ul className="list-disc ml-4 space-y-1">
              <li className="leading-[20px]">Important Instructions</li>
              <li className="leading-[20px]">Arrive 15 minutes early for your appointment</li>
              <li className="leading-[20px]">Bring this receipt and your QR code for verification</li>
              <li className="leading-[20px]">Required documents: Valid ID, relevant application forms</li>
              <li className="leading-[20px]">Contact support if you need to reschedule: support@govpulse.lk</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          #printable-receipt {
            padding: 20mm;
            margin: 0;
            box-shadow: none;
            border: none;
            page-break-inside: avoid;
          }
          
          /* Hide elements that shouldn't be printed */
          .no-print {
            display: none !important;
          }
          
          /* Ensure proper spacing for print */
          .print-spacing {
            margin-bottom: 10mm;
          }
        }
        
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
