const { PrismaClient } = require("../generated/prisma");
const QRCode = require('qrcode');
const crypto = require('crypto');

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
      expiryDateTime: new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toISOString() // 1 hour after appointment
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

    // In a real application, you would save this to database
    // For now, we'll just return the data
    
    const response = {
      success: true,
      appointmentId,
      qrCodeSvg: Buffer.from(qrCodeSvg).toString('base64'),
      qrCodeData: JSON.stringify(qrData),
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

module.exports = {
  confirmAppointment,
  verifyAppointment
};