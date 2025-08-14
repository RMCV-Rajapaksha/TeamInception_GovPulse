import { useState } from 'react';

interface VerificationResult {
  valid: boolean;
  reason?: string;
  appointment?: {
    appointmentId: string;
    serviceType: string;
    location: string;
    dateTime: string;
    status: string;
  };
}

export default function QRVerificationPage() {
  const [qrData, setQrData] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyQR = async () => {
    if (!qrData.trim()) {
      alert('Please enter QR code data');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/appointments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeData: qrData })
      });

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({ 
        valid: false, 
        reason: 'Network error or server unavailable' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">QR Code Verification System</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Verify Appointment QR Code</h2>
          <p className="text-gray-600 mb-4">
            Paste the QR code data (JSON string) below to verify an appointment.
          </p>
          
          <textarea
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            placeholder="Paste QR code JSON data here..."
            className="w-full p-3 border border-gray-300 rounded-md h-32 resize-vertical"
          />
          
          <button
            onClick={handleVerifyQR}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify QR Code'}
          </button>
        </div>

        {verificationResult && (
          <div className={`bg-white rounded-lg shadow-md p-6 ${
            verificationResult.valid ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Verification Result</h3>
            
            {verificationResult.valid ? (
              <div className="text-green-700">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Valid Appointment</span>
                </div>
                
                {verificationResult.appointment && (
                  <div className="mt-4 space-y-2">
                    <p><strong>Appointment ID:</strong> {verificationResult.appointment.appointmentId}</p>
                    <p><strong>Service:</strong> {verificationResult.appointment.serviceType}</p>
                    <p><strong>Location:</strong> {verificationResult.appointment.location}</p>
                    <p><strong>Date & Time:</strong> {verificationResult.appointment.dateTime}</p>
                    <p><strong>Status:</strong> {verificationResult.appointment.status}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-700">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Invalid QR Code</span>
                </div>
                <p><strong>Reason:</strong> {verificationResult.reason}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">How to Use</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Book an appointment through the main booking system</li>
            <li>Copy the QR code data from the browser console (for testing)</li>
            <li>Paste the JSON data in the textarea above</li>
            <li>Click "Verify QR Code" to check validity</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
