interface SimplePDFReceiptProps {
  appointmentId: string;
  userName: string;
  serviceLabel: string;
  locationLabel: string;
  dateTimeLabel: string;
  qrCodeString: string;
}

export default function SimplePDFReceipt({
  appointmentId,
  userName,
  serviceLabel,
  locationLabel,
  dateTimeLabel,
  qrCodeString
}: SimplePDFReceiptProps) {
  return (
    <div className="w-[794px] h-[1123px] bg-white p-8 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">GovPulse</h1>
        <p className="text-lg text-gray-600">Appointment Confirmation</p>
      </div>
      
      <div className="border border-gray-300 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-black mb-4">{userName}</h2>
            
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-600">Appointment ID: </span>
                <span className="text-black">{appointmentId}</span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-600">Service: </span>
                <span className="text-black">{serviceLabel}</span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-600">Location: </span>
                <span className="text-black">{locationLabel}</span>
              </div>
              
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="font-semibold text-gray-600">Date & Time: </span>
                <span className="text-black font-bold">{dateTimeLabel}</span>
              </div>
            </div>
          </div>
          
          <div className="ml-8 flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-2">QR Code</div>
                <div className="text-xs text-gray-400 break-all max-w-[180px]">
                  {qrCodeString.substring(0, 50)}...
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Instructions:</strong> Bring original documents and this confirmation receipt to your appointment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
