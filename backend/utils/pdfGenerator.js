const fs = require('fs');
const path = require('path');

// Generate HTML template for appointment receipt (Figma Design)
function generateReceiptHTML(appointmentData) {
  const {
    appointmentId,
    userName,
    serviceType,
    location,
    dateTime,
    qrCodeSvg,
    generatedAt
  } = appointmentData;

  const formattedDate = new Date(dateTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = new Date(dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedDateTime = `${formattedDate} · ${formattedTime}`;

  const receiptDate = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Receipt - ${appointmentId}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', 'Satoshi', sans-serif;
            background-color: #ffffff;
            color: #000000;
            line-height: 1.5;
        }
        
        .receipt-container {
            max-width: 794px; /* A4 width in pixels */
            margin: 0 auto;
            background: white;
            padding: 64px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            gap: 32px;
            align-items: center;
        }
        
        /* Header */
        .header-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
            width: 100%;
        }
        
        .logo {
            width: 250px;
            height: 49px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
        }
        
        .logo-text {
            color: #000000;
        }
        
        .logo-waves {
            margin-right: 8px;
            color: #007aff;
        }
        
        /* QR Code Section */
        .qr-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
            width: 100%;
        }
        
        .user-name {
            font-size: 18px;
            font-weight: 700;
            color: #000000;
            text-align: center;
            line-height: 22px;
        }
        
        .qr-code {
            width: 216px;
            height: 216px;
            padding: 8px;
            background: white;
            border: 1px solid #d7d7d7;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .qr-code img {
            width: 200px;
            height: 200px;
        }
        
        .appointment-id-container {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
        }
        
        .appointment-id-label {
            font-size: 12px;
            font-weight: 500;
            color: #4b4b4b;
        }
        
        .appointment-id-badge {
            display: flex;
            align-items: center;
            padding: 4px 8px;
            border: 1px solid #d7d7d7;
            border-radius: 16px;
        }
        
        .appointment-id-value {
            font-size: 12px;
            font-weight: 500;
            color: #000000;
        }
        
        /* Appointment Card */
        .appointment-card {
            background: #ffffff;
            width: 100%;
            padding: 16px;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        /* Service Info */
        .service-info {
            display: flex;
            gap: 8px;
            align-items: flex-start;
            font-size: 16px;
        }
        
        .service-label {
            font-weight: 700;
            color: #4b4b4b;
            white-space: nowrap;
        }
        
        .service-value {
            font-weight: 500;
            color: #000000;
            flex: 1;
            line-height: 20px;
            letter-spacing: 0.16px;
        }
        
        /* Location Info */
        .location-info {
            display: flex;
            gap: 4px;
            align-items: center;
            font-size: 16px;
        }
        
        .location-label {
            font-weight: 700;
            color: #4b4b4b;
            white-space: nowrap;
        }
        
        .location-content {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px;
            flex: 1;
        }
        
        .location-icon {
            width: 16px;
            height: 16px;
            color: #007aff;
        }
        
        .location-value {
            font-weight: 500;
            color: #007aff;
            letter-spacing: 0.16px;
            line-height: 20px;
        }
        
        /* Date Time Container */
        .datetime-container {
            background: #ffffa5;
            display: flex;
            gap: 16px;
            align-items: flex-start;
            padding: 8px;
            border-radius: 8px;
        }
        
        .datetime-icon-container {
            background: linear-gradient(to bottom, #ffff7f, #ffff00);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-radius: 24px;
            border: 2px solid #ffffa5;
            box-shadow: 0px 4px 4px 0px rgba(255,255,0,0.1), 0px 4px 12px 0px rgba(255,255,0,0.25);
            width: 40px;
            height: 40px;
        }
        
        .datetime-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-weight: 500;
        }
        
        .datetime-label {
            font-size: 12px;
            color: #4b4b4b;
        }
        
        .datetime-value {
            font-size: 16px;
            color: #000000;
            letter-spacing: 0.16px;
            line-height: 20px;
        }
        
        /* Instructions */
        .instructions-container {
            background: #f5f5f5;
            display: flex;
            gap: 8px;
            align-items: flex-start;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #d7d7d7;
        }
        
        .instructions-icon {
            width: 24px;
            height: 24px;
            color: #666666;
            margin-top: 2px;
        }
        
        .instructions-content {
            flex: 1;
            font-weight: 500;
            font-size: 16px;
            color: #000000;
            letter-spacing: 0.16px;
        }
        
        .instructions-list {
            list-style: disc;
            margin-left: 16px;
        }
        
        .instructions-list li {
            margin-bottom: 4px;
            line-height: 20px;
        }
        
        .instructions-list li:last-child {
            margin-bottom: 0;
        }
        
        /* Print Styles */
        @media print {
            body {
                margin: 0;
                padding: 0;
                background: white !important;
            }
            
            .receipt-container {
                padding: 20mm;
                margin: 0;
                box-shadow: none;
                border: none;
                page-break-inside: avoid;
                min-height: auto;
            }
            
            .no-print {
                display: none !important;
            }
        }
        
        @page {
            size: A4;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <!-- Header Container -->
        <div class="header-container">
            <div class="logo">
                <span class="logo-waves">~~~</span>
                <span class="logo-text">GovPulse</span>
            </div>
        </div>

        <!-- QR Code Container -->
        <div class="qr-container">
            <!-- User Name -->
            <div class="user-name">${userName}</div>

            <!-- QR Code -->
            <div class="qr-code">
                ${qrCodeSvg ? `<img src="data:image/svg+xml;base64,${qrCodeSvg}" alt="Appointment QR Code">` : '<div style="width: 200px; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd;">QR Code</div>'}
            </div>

            <!-- Appointment ID -->
            <div class="appointment-id-container">
                <div class="appointment-id-label">Appointment ID:</div>
                <div class="appointment-id-badge">
                    <div class="appointment-id-value">${appointmentId}</div>
                </div>
            </div>
        </div>

        <!-- Appointment Card -->
        <div class="appointment-card">
            <!-- Service Info -->
            <div class="service-info">
                <div class="service-label">Service:</div>
                <div class="service-value">${serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            </div>

            <!-- Location Info -->
            <div class="location-info">
                <div class="location-label">Location:</div>
                <div class="location-content">
                    <svg class="location-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C5.2 0 3 2.2 3 5c0 2.8 5 11 5 11s5-8.2 5-11c0-2.8-2.2-5-5-5zM8 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                    <div class="location-value">${location}</div>
                </div>
            </div>

            <!-- Date & Time Container -->
            <div class="datetime-container">
                <div class="datetime-icon-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                </div>
                <div class="datetime-content">
                    <div class="datetime-label">DATE & TIME</div>
                    <div class="datetime-value">${formattedDateTime}</div>
                </div>
            </div>

            <!-- Instructions Container -->
            <div class="instructions-container">
                <svg class="instructions-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                <div class="instructions-content">
                    <ul class="instructions-list">
                        <li>Important Instructions</li>
                        <li>Arrive 15 minutes early for your appointment</li>
                        <li>Bring this receipt and your QR code for verification</li>
                        <li>Required documents: Valid ID, relevant application forms</li>
                        <li>Contact support if you need to reschedule: support@govpulse.lk</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Generate PDF buffer from HTML (for server-side generation)
async function generatePDFFromHTML(htmlContent) {
  // For now, return the HTML content
  // In production, you'd use a proper PDF library like puppeteer
  return htmlContent;
}

module.exports = {
  generateReceiptHTML,
  generatePDFFromHTML
};
