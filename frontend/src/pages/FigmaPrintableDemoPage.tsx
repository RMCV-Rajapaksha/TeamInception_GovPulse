import { useState } from 'react';
import { Download, Printer, Eye } from '@phosphor-icons/react';
import PrintablePDFReceipt from '../components/services/PrintablePDFReceipt';
import { generatePDFReceipt } from '../utils/pdfGenerator';

export default function FigmaPrintableDemoPage() {
  const [appointmentData, setAppointmentData] = useState({
    appointmentId: '#SL-GOV-2025-00483',
    userName: 'Chamal Dissanayake',
    serviceLabel: 'Applying for Light Vehicles (B/B1) driving license',
    locationLabel: 'City Planning Office, Suite 5.',
    dateTimeLabel: 'Friday, 15 Aug 2025 · 10:00 AM'
  });

  const [qrCodeString, setQrCodeString] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Generate QR code data
  useState(() => {
    const qrData = {
      appointmentId: appointmentData.appointmentId,
      userName: appointmentData.userName,
      serviceType: appointmentData.serviceLabel,
      location: appointmentData.locationLabel,
      dateTime: appointmentData.dateTimeLabel,
      verificationHash: 'demo_hash_12345',
      generatedAt: new Date().toISOString()
    };
    setQrCodeString(JSON.stringify(qrData));
  });

  const handleDownloadPDF = async () => {
    try {
      await generatePDFReceipt(appointmentData);
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewBackendReceipt = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointments/${appointmentData.appointmentId.replace('#', '')}/receipt`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch receipt');
      }

      const htmlContent = await response.text();
      
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Error viewing backend receipt:', error);
      alert('Failed to view backend receipt. Make sure the backend server is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Controls Header */}
      <div className="bg-white shadow-sm border-b p-4 no-print">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Figma Printable PDF Demo</h1>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Eye size={20} />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <Download size={20} />
              Download PDF
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              <Printer size={20} />
              Print Preview
            </button>
            
            <button
              onClick={handleViewBackendReceipt}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
            >
              <Eye size={20} />
              Backend Receipt
            </button>
          </div>

          {/* Edit Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment ID
              </label>
              <input
                type="text"
                value={appointmentData.appointmentId}
                onChange={(e) => setAppointmentData({...appointmentData, appointmentId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                value={appointmentData.userName}
                onChange={(e) => setAppointmentData({...appointmentData, userName: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <input
                type="text"
                value={appointmentData.serviceLabel}
                onChange={(e) => setAppointmentData({...appointmentData, serviceLabel: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={appointmentData.locationLabel}
                onChange={(e) => setAppointmentData({...appointmentData, locationLabel: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <input
                type="text"
                value={appointmentData.dateTimeLabel}
                onChange={(e) => setAppointmentData({...appointmentData, dateTimeLabel: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <PrintablePDFReceipt
              appointmentId={appointmentData.appointmentId}
              userName={appointmentData.userName}
              serviceLabel={appointmentData.serviceLabel}
              locationLabel={appointmentData.locationLabel}
              dateTimeLabel={appointmentData.dateTimeLabel}
              qrCodeString={qrCodeString}
            />
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="max-w-4xl mx-auto p-4 no-print">
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">✨ Figma Design Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">🎨 Design Elements:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Exact Figma layout replication</li>
                <li>• GovPulse logo with wave design</li>
                <li>• Professional typography (Satoshi/Inter)</li>
                <li>• Color-coded sections and highlights</li>
                <li>• Print-optimized A4 layout</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">🔧 Technical Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• React component-based PDF generation</li>
                <li>• Real QR code integration</li>
                <li>• Responsive design for all devices</li>
                <li>• Print CSS optimization</li>
                <li>• Backend HTML receipt API</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
