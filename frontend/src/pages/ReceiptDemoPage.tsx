import { useState } from 'react';
import { Download, Printer, Eye } from '@phosphor-icons/react';

export default function ReceiptDemoPage() {
  const [appointmentId, setAppointmentId] = useState('SL-GOV-2025-00483');
  const [receiptWindow, setReceiptWindow] = useState<Window | null>(null);

  const handleViewReceipt = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointments/${appointmentId}/receipt`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch receipt');
      }

      const htmlContent = await response.text();
      
      // Create a new window/tab to display the receipt
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        setReceiptWindow(newWindow);
      } else {
        throw new Error('Unable to open receipt window');
      }
    } catch (error) {
      console.error('Error viewing receipt:', error);
      alert('Failed to view receipt. Please try again.');
    }
  };

  const handlePrintReceipt = () => {
    if (receiptWindow && !receiptWindow.closed) {
      receiptWindow.focus();
      receiptWindow.print();
    } else {
      alert('Please view the receipt first by clicking "View Receipt"');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // For demo purposes, we'll open the receipt in print mode
      const response = await fetch(`http://localhost:4000/api/appointments/${appointmentId}/receipt`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch receipt');
      }

      const htmlContent = await response.text();
      
      // Create a new window optimized for PDF generation
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Add print styles and trigger print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            // Close window after printing
            printWindow.onafterprint = () => {
              printWindow.close();
            };
          }, 500);
        };
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">PDF Receipt Generation Demo</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generate Appointment Receipt</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment ID
            </label>
            <input
              type="text"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter appointment ID (e.g., SL-GOV-2025-00483)"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleViewReceipt}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Eye size={20} />
              View Receipt
            </button>
            
            <button
              onClick={handlePrintReceipt}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              <Printer size={20} />
              Print Receipt
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Receipt Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">✅ Included Information:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Official appointment reference ID</li>
                <li>• Citizen name and service details</li>
                <li>• Location and date/time information</li>
                <li>• QR code for verification</li>
                <li>• Important instructions and guidelines</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">🎨 Design Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Professional government branding</li>
                <li>• Print-optimized layout</li>
                <li>• Mobile-responsive design</li>
                <li>• Clear visual hierarchy</li>
                <li>• Official document styling</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Note:</strong> This is a demonstration of the PDF receipt generation system. 
                In production, receipts would be generated with real appointment data from the database.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Implementation Options</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Option 1: Server-Side Generation (Current)</h4>
              <p className="text-sm text-gray-600">HTML receipt generated on backend with appointment data, optimized for printing and PDF conversion.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Option 2: Client-Side PDF (Available)</h4>
              <p className="text-sm text-gray-600">Frontend generates PDF using jsPDF and html2canvas libraries for offline capability.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Option 3: Hybrid Approach</h4>
              <p className="text-sm text-gray-600">Server provides receipt data, client handles PDF generation and styling for maximum flexibility.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
