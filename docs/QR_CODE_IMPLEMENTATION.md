# QR Code Implementation Strategy for Appointment System

## Overview
This document outlines the implementation strategy for generating unique QR codes for each government service appointment in the GovPulse system.

## QR Code Content Structure
Each QR code should contain a JSON string with the following information:
```json
{
  "appointmentId": "SL-GOV-2025-00483",
  "userId": "user_12345",
  "serviceType": "driving_license_b1",
  "officialLocation": "colombo_dmv_office_1",
  "appointmentDateTime": "2025-08-15T10:00:00Z",
  "verificationHash": "sha256_hash_of_above_data",
  "expiryDateTime": "2025-08-15T11:00:00Z",
  "securityToken": "encrypted_verification_token"
}
```

## Implementation Steps

### 1. Backend API Integration
```typescript
// API endpoint for booking confirmation
POST /api/appointments/confirm
{
  "userId": "string",
  "serviceType": "string", 
  "locationId": "string",
  "dateTime": "ISO_string",
  "timeSlotId": "string"
}

// Response includes QR code data
{
  "appointmentId": "string",
  "qrCodeSvg": "base64_encoded_svg",
  "qrCodeData": "json_string",
  "confirmationDetails": {...}
}
```

### 2. QR Code Generation Library
Recommended: `qrcode` npm package for server-side generation

```bash
npm install qrcode
npm install @types/qrcode --save-dev
```

Backend QR generation example:
```javascript
const QRCode = require('qrcode');
const crypto = require('crypto');

async function generateAppointmentQR(appointmentData) {
  // Create verification hash
  const dataString = JSON.stringify({
    appointmentId: appointmentData.appointmentId,
    userId: appointmentData.userId,
    serviceType: appointmentData.serviceType,
    officialLocation: appointmentData.officialLocation,
    appointmentDateTime: appointmentData.appointmentDateTime
  });
  
  const verificationHash = crypto
    .createHash('sha256')
    .update(dataString + process.env.QR_SECRET_KEY)
    .digest('hex');

  const qrData = {
    ...appointmentData,
    verificationHash,
    generatedAt: new Date().toISOString()
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

  return {
    qrCodeSvg: Buffer.from(qrCodeSvg).toString('base64'),
    qrCodeData: JSON.stringify(qrData)
  };
}
```

### 3. Frontend Integration
Update the appointment confirmation flow:

```typescript
// In ConfirmBookingPage.tsx
const handleConfirm = async () => {
  try {
    const response = await fetch('/api/appointments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        serviceType: 'driving_license_b1',
        locationId: selectedLocationId,
        dateTime: selectedDateTime,
        timeSlotId: selectedTimeSlot
      })
    });

    const result = await response.json();
    
    navigate('/services/driving-license/confirmed', {
      state: {
        appointmentId: result.appointmentId,
        userName: user.name,
        serviceLabel,
        selectedLocation: locationLabel,
        dateTimeLabel,
        qrCodeData: result.qrCodeSvg // Base64 SVG
      }
    });
  } catch (error) {
    // Handle error
  }
};
```

### 4. QR Code Verification System
For government office staff to verify appointments:

```typescript
// Verification endpoint
POST /api/appointments/verify
{
  "qrCodeData": "scanned_json_string"
}

// Verification logic
function verifyAppointmentQR(scannedData) {
  const data = JSON.parse(scannedData);
  
  // Check expiry
  if (new Date() > new Date(data.expiryDateTime)) {
    return { valid: false, reason: 'Appointment expired' };
  }
  
  // Verify hash
  const expectedHash = crypto
    .createHash('sha256')
    .update(generateHashString(data) + process.env.QR_SECRET_KEY)
    .digest('hex');
    
  if (data.verificationHash !== expectedHash) {
    return { valid: false, reason: 'Invalid QR code' };
  }
  
  // Check database
  const appointment = await db.appointments.findOne({
    appointmentId: data.appointmentId,
    status: 'confirmed'
  });
  
  if (!appointment) {
    return { valid: false, reason: 'Appointment not found' };
  }
  
  return { 
    valid: true, 
    appointment: appointment,
    citizen: await db.users.findById(data.userId)
  };
}
```

### 5. Security Features
- **Hash Verification**: Prevent QR code tampering
- **Time-based Expiry**: QR codes expire after appointment time
- **Single Use**: Mark as used after verification
- **Encrypted Tokens**: Additional security layer
- **Rate Limiting**: Prevent brute force attacks

### 6. Database Schema Updates
```sql
-- Appointments table additions
ALTER TABLE appointments ADD COLUMN qr_code_data TEXT;
ALTER TABLE appointments ADD COLUMN qr_verification_hash VARCHAR(64);
ALTER TABLE appointments ADD COLUMN qr_generated_at TIMESTAMP;
ALTER TABLE appointments ADD COLUMN is_qr_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE appointments ADD COLUMN qr_verified_at TIMESTAMP;
ALTER TABLE appointments ADD COLUMN verified_by_staff_id INTEGER;
```

### 7. Mobile App Integration (Future)
- QR code scanner for staff mobile app
- Offline verification capability
- Sync verification status when online

## Implementation Priority
1. ✅ **Phase 1**: Basic QR code generation and display (Current)
2. **Phase 2**: Backend API integration with hash verification
3. **Phase 3**: Staff verification system (web portal)
4. **Phase 4**: Mobile app for staff QR scanning
5. **Phase 5**: Advanced security features and audit logs

## Testing Strategy
- Unit tests for QR generation and verification
- Integration tests for appointment flow
- Security testing for hash verification
- Load testing for high-volume QR generation
- Manual testing with real QR scanners

## Deployment Considerations
- Environment variables for secret keys
- Database migrations for new columns
- CDN for QR code image serving
- Monitoring for QR generation failures
- Backup strategy for appointment data

This implementation ensures secure, unique QR codes for each appointment while maintaining user privacy and system integrity.
