const { PrismaClient } = require("../generated/prisma");
const QRCode = require('qrcode');
const crypto = require('crypto');
const { generateReceiptHTML } = require('../utils/pdfGenerator');

const prisma = new PrismaClient();

// Generate unique appointment ID
function generateAppointmentId(serviceType) {
  const prefix = serviceType === 'driving_license_b1' ? 'SL-GOV' : 'GOV';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}-${year}-${randomNum}`;
}

// Generate verification hash
function generateVerificationHash(data, secretKey) {
  const dataString = JSON.stringify({
    appointmentId: data.appointmentId,
    userId: data.userId,
    serviceType: data.serviceType,
    location: data.location,
    dateTime: data.dateTime
  });
  
  return crypto
    .createHash('sha256')
    .update(dataString + secretKey)
    .digest('hex');
}

// Create appointment and generate QR code
async function confirmAppointment(req, res) {
  try {
    const { userId, serviceType, locationId, dateTime, timeSlotId, userName, locationLabel } = req.body;
    
    // Generate appointment ID
    const appointmentId = generateAppointmentId(serviceType);
    
    // Parse the custom date format: "Friday, 15 Aug 2025 · 10:00 AM"
    const parseDateTimeString = (dateTimeStr) => {
      try {
        // Handle the custom format "Day, DD MMM YYYY · HH:MM AM/PM"
        const cleanedDateTime = dateTimeStr.replace(' · ', ' ');
        const parts = cleanedDateTime.split(', ');
        if (parts.length >= 2) {
          const dateTimePart = parts[1]; // "15 Aug 2025 10:00 AM"
          return new Date(dateTimePart);
        }
        // Fallback to direct parsing
        return new Date(dateTimeStr);
      } catch (error) {
        console.error('Error parsing date:', error);
        // Return current date + 1 hour as fallback
        return new Date(Date.now() + 60 * 60 * 1000);
      }
    };

    const appointmentDate = parseDateTimeString(dateTime);
    
    // Create QR code data
    const qrData = {
      appointmentId,
      userId,
      serviceType,
      location: locationLabel,
      dateTime,
      verificationHash: generateVerificationHash({
        appointmentId,
        userId,
        serviceType,
        location: locationLabel,
        dateTime
      }, process.env.QR_SECRET_KEY || 'default_secret_key'),
      generatedAt: new Date().toISOString(),
      expiryDateTime: new Date(appointmentDate.getTime() + 60 * 60 * 1000).toISOString() // 1 hour after appointment
    };

    // Generate QR code as SVG
    const qrCodeSvg = await QRCode.toString(JSON.stringify(qrData), {
      type: 'svg',
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Generate PDF receipt HTML
    const receiptHTML = generateReceiptHTML({
      appointmentId,
      userName,
      serviceType,
      location: locationLabel,
      dateTime,
      qrCodeSvg: qrCodeSvg,
      generatedAt: new Date().toISOString()
    });

    // In a real application, you would save this to database
    // For now, we'll just return the data
    
    const response = {
      success: true,
      appointmentId,
      qrCodeSvg: Buffer.from(qrCodeSvg).toString('base64'),
      qrCodeData: JSON.stringify(qrData),
      receiptHTML: Buffer.from(receiptHTML).toString('base64'),
      confirmationDetails: {
        appointmentId,
        userName,
        serviceType,
        location: locationLabel,
        dateTime,
        status: 'confirmed'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error confirming appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to confirm appointment',
      details: error.message 
    });
  }
}

// Verify QR code
async function verifyAppointment(req, res) {
  try {
    const { qrCodeData } = req.body;
    
    const data = JSON.parse(qrCodeData);
    
    // Check expiry
    if (new Date() > new Date(data.expiryDateTime)) {
      return res.json({ 
        valid: false, 
        reason: 'Appointment expired' 
      });
    }
    
    // Verify hash
    const expectedHash = generateVerificationHash({
      appointmentId: data.appointmentId,
      userId: data.userId,
      serviceType: data.serviceType,
      location: data.location,
      dateTime: data.dateTime
    }, process.env.QR_SECRET_KEY || 'default_secret_key');
    
    if (data.verificationHash !== expectedHash) {
      return res.json({ 
        valid: false, 
        reason: 'Invalid QR code - verification failed' 
      });
    }
    
    // In a real application, you would check the database
    // For now, we'll assume it's valid if hash matches
    
    res.json({ 
      valid: true, 
      appointment: {
        appointmentId: data.appointmentId,
        serviceType: data.serviceType,
        location: data.location,
        dateTime: data.dateTime,
        status: 'verified'
      }
    });
  } catch (error) {
    console.error('Error verifying appointment:', error);
    res.status(500).json({ 
      valid: false, 
      reason: 'Verification error',
      details: error.message 
    });
  }
}

// Generate and download PDF receipt
async function downloadReceipt(req, res) {
  try {
    const { appointmentId } = req.params;
    
    // In a real application, you would fetch appointment data from database
    // For now, we'll use sample data
    const appointmentData = {
      appointmentId: appointmentId,
      userName: 'John Doe',
      serviceType: 'driving_license_b1',
      location: 'Colombo DMV Office 1',
      dateTime: new Date().toISOString(),
      qrCodeSvg: null, // Could regenerate QR code here
      generatedAt: new Date().toISOString()
    };

    const receiptHTML = generateReceiptHTML(appointmentData);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="appointment-receipt-${appointmentId}.html"`);
    res.send(receiptHTML);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate receipt',
      details: error.message 
    });
  }
}

module.exports = {
  confirmAppointment,
  verifyAppointment,
  downloadReceipt
};