import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import React from 'react';
import PrintablePDFReceipt from '../components/services/PrintablePDFReceipt';
import SimplePDFReceipt from '../components/services/SimplePDFReceipt';

interface AppointmentData {
  appointmentId: string;
  userName: string;
  serviceLabel: string;
  locationLabel: string;
  dateTimeLabel: string;
  qrCodeDataUrl?: string;
}

// Generate QR code data string
function generateQRCodeString(appointmentData: AppointmentData): string {
  const qrData = {
    appointmentId: appointmentData.appointmentId,
    userName: appointmentData.userName,
    serviceType: appointmentData.serviceLabel,
    location: appointmentData.locationLabel,
    dateTime: appointmentData.dateTimeLabel,
    verificationHash: generateSimpleHash(appointmentData.appointmentId + appointmentData.userName + appointmentData.dateTimeLabel),
    generatedAt: new Date().toISOString()
  };
  return JSON.stringify(qrData);
}

// Simple hash function for demo purposes
function generateSimpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Generate PDF receipt from appointment data using Figma design
export async function generatePDFReceipt(appointmentData: AppointmentData): Promise<void> {
  try {
    console.log('Starting PDF generation with data:', appointmentData);
    const qrCodeString = generateQRCodeString(appointmentData);
    console.log('Generated QR code string:', qrCodeString);
    
    // Try with the complex component first, then fallback to simple
    let component;
    
    try {
      component = React.createElement(PrintablePDFReceipt, {
        appointmentId: appointmentData.appointmentId,
        userName: appointmentData.userName,
        serviceLabel: appointmentData.serviceLabel,
        locationLabel: appointmentData.locationLabel,
        dateTimeLabel: appointmentData.dateTimeLabel,
        qrCodeString: qrCodeString
      });
      console.log('Created complex React component');
    } catch (error) {
      console.warn('Failed to create complex component, using simple fallback:', error);
      component = React.createElement(SimplePDFReceipt, {
        appointmentId: appointmentData.appointmentId,
        userName: appointmentData.userName,
        serviceLabel: appointmentData.serviceLabel,
        locationLabel: appointmentData.locationLabel,
        dateTimeLabel: appointmentData.dateTimeLabel,
        qrCodeString: qrCodeString
      });
      console.log('Created simple React component');
    }
    
    // Create a temporary container for the React component
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
    tempContainer.style.background = 'white';
    tempContainer.style.zIndex = '-1';
    document.body.appendChild(tempContainer);

    // Render the React component
    const root = createRoot(tempContainer);
    console.log('Created React root');
    
    console.log('Created React component with props:', {
      appointmentId: appointmentData.appointmentId,
      userName: appointmentData.userName,
      serviceLabel: appointmentData.serviceLabel,
      locationLabel: appointmentData.locationLabel,
      dateTimeLabel: appointmentData.dateTimeLabel
    });

    await new Promise<void>((resolve) => {
      try {
        console.log('Rendering component...');
        root.render(component);
        console.log('Component rendered, waiting for QR code...');
        // Wait for component to render and QR code to generate
        setTimeout(() => {
          console.log('Timeout completed, resolving...');
          resolve();
        }, 2000);
      } catch (error) {
        console.error('Error during component rendering:', error);
        resolve(); // Still resolve to continue with PDF generation
      }
    });

    console.log('Starting canvas generation...');
    // Generate canvas from the rendered component
    const canvas = await html2canvas(tempContainer, {
      width: 794,
      height: 1123, // A4 height in pixels
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    console.log('Canvas generated successfully:', canvas.width, 'x', canvas.height);

    // Clean up
    root.unmount();
    document.body.removeChild(tempContainer);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Download the PDF
    pdf.save(`appointment-receipt-${appointmentData.appointmentId}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Clean up if elements were created
    try {
      const container = document.querySelector('[style*="position: fixed"][style*="left: -9999px"]');
      if (container) {
        document.body.removeChild(container);
      }
    } catch (cleanupError) {
      console.warn('Cleanup error:', cleanupError);
    }
    
    throw new Error(`Failed to generate PDF receipt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Download receipt from backend API
export async function downloadReceiptFromAPI(appointmentId: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:4000/api/appointments/${appointmentId}/receipt`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch receipt');
    }

    const htmlContent = await response.text();
    
    // Create a new window/tab to display the receipt
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(htmlContent);
      receiptWindow.document.close();
      
      // Trigger print dialog after content loads
      receiptWindow.onload = () => {
        setTimeout(() => {
          receiptWindow.print();
        }, 500);
      };
    } else {
      throw new Error('Unable to open receipt window');
    }
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw new Error('Failed to download receipt');
  }
}
