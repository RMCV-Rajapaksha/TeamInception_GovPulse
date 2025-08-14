# Automated Email Notification System

This document explains the automated email notification system implemented for GovPulse appointments.

## Overview

The system provides three main types of automated email notifications:

1. **Appointment Confirmation** - Sent immediately when an appointment is booked
2. **24-Hour Reminder** - Sent automatically 24 hours before the appointment with document checklist
3. **Status Updates** - Sent when officials provide updates, comments, or reschedule appointments

## Features

### 1. Appointment Confirmation Email
- **Trigger**: Automatically sent when a citizen books an appointment
- **Content**: 
  - Appointment details (date, time, authority, appointment ID)
  - Professional HTML formatting
  - Note about upcoming reminder email

### 2. 24-Hour Reminder Email
- **Trigger**: Automatically sent 24 hours before the appointment
- **Content**:
  - Appointment details with highlighted date/time
  - **Dynamic document checklist** based on authority category:
    - **Education**: School certificates, birth certificate, photos
    - **Health**: Medical reports, prescriptions, insurance documents
    - **Transport**: Driving license, vehicle registration, insurance
    - **Housing**: Property documents, utility bills, income certificate
    - **Agriculture**: Land documents, farming certificates, subsidy documents
    - **Social Welfare**: Income certificate, family composition, bank details
    - **General**: Basic documents for other categories
  - Additional tips (arrive early, bring copies, etc.)

### 3. Status Update Emails
Officials can send various types of updates:

#### Comment Updates
- General comments or updates about the appointment
- Updates the `official_comment` field in the database

#### Document Requests
- Specific requests for additional documents
- Highlighted as "Action Required"

#### Appointment Rescheduling
- New date and time information
- Automatically handles time slot management
- Shows both old and new appointment details

#### Appointment Cancellation
- Cancellation reason and next steps
- Sent by both officials and users

#### Appointment Completion
- Completion notes and feedback
- Marks the end of the appointment process

## Technical Implementation

### Setup Requirements

1. **Environment Variables** (in `.env` file):
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

2. **Dependencies** (automatically included):
```bash
npm install node-cron nodemailer
```

### Automatic Services

#### Notification Service
- **File**: `utils/NotificationService.js`
- **Purpose**: Handles all email scheduling and sending
- **Cron Job**: Runs every hour to check for appointments needing reminders

#### Email Functions
- **File**: `utils/EmailFunctions.js`
- **Purpose**: Contains email templates and sending logic
- **Features**: HTML templates, error handling, professional formatting

## API Endpoints

### For Citizens

#### Book Appointment (Automatic Confirmation)
```
POST /api/appointments/book-appointment
```
- Automatically sends confirmation email after successful booking

#### Cancel Appointment (Automatic Notification)
```
POST /api/appointments/cancel-appointment-by-user
```
- Automatically sends cancellation email to user and officials

### For Officials

#### Send Official Update
```
POST /api/appointments/send-official-update
Authorization: Bearer <official-token>

Body:
{
  "appointment_id": 123,
  "message": "Please bring your original NIC and proof of address",
  "update_type": "request" // or "comment", "completion"
}
```

#### Reschedule Appointment
```
POST /api/appointments/reschedule-appointment
Authorization: Bearer <official-token>

Body:
{
  "appointment_id": 123,
  "new_date": "2025-08-16",
  "new_time_slot": "10:00 AM - 11:00 AM",
  "reason": "Officer unavailable due to emergency meeting"
}
```

#### Cancel Appointment
```
POST /api/appointments/cancel-appointment-by-official
Authorization: Bearer <official-token>

Body:
{
  "appointment_id": 123,
  "reason": "Office closure due to public holiday"
}
```

## Email Templates

### Features of Email Templates:
- **Responsive Design**: Works on desktop and mobile
- **Professional Styling**: Government-appropriate formatting
- **Clear Information Hierarchy**: Easy to scan and understand
- **Action-Oriented**: Clear next steps for recipients
- **Branded**: Consistent GovPulse branding

### Template Types:
1. **Confirmation**: Green success theme
2. **Reminder**: Red urgency theme with yellow document checklist
3. **Updates**: Color-coded by update type
4. **Cancellation**: Red warning theme
5. **Reschedule**: Purple change theme

## Automated Scheduling

### Reminder System:
- **Frequency**: Checked every hour
- **Timezone**: Asia/Colombo (Sri Lankan time)
- **Logic**: Finds appointments 24 hours away and sends reminders
- **Prevents Duplicates**: Ensures only one reminder per appointment

### Error Handling:
- Email failures don't affect core appointment functionality
- Comprehensive logging for debugging
- Graceful fallbacks for missing data

## Configuration

### Email Service Configuration:
Currently configured for Gmail, but can be adapted for other providers:

```javascript
const transporter = nodemailer.createTransport({
  service: "gmail", // Change this for other providers
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use app-specific password for Gmail
  },
});
```

### Cron Job Configuration:
```javascript
// Run every hour
cron.schedule('0 * * * *', async () => {
  await this.checkAndSendReminders();
});
```

## Security Considerations

1. **Email Credentials**: Stored in environment variables
2. **Authentication**: All official endpoints require valid tokens
3. **Authorization**: Officials can only update their authority's appointments
4. **Data Validation**: All inputs are validated before processing

## Monitoring and Logging

The system includes comprehensive logging:
- ✅ Successful email deliveries
- ❌ Email failures with error details
- 🔍 Reminder checking activities
- 📧 Email sending attempts

## Troubleshooting

### Common Issues:

1. **Emails not sending**:
   - Check EMAIL_USER and EMAIL_PASS environment variables
   - Verify Gmail app-specific password
   - Check console logs for specific errors

2. **Reminders not being sent**:
   - Verify cron job is running
   - Check appointment dates are in the future
   - Review timezone settings

3. **HTML formatting issues**:
   - Test emails in different email clients
   - Verify HTML template syntax

### Testing:

You can test the system by:
1. Booking test appointments
2. Checking console logs for email confirmations
3. Verifying email delivery in recipient inboxes
4. Testing different update types from official panel

## Future Enhancements

Possible improvements:
1. SMS notifications integration
2. Email delivery tracking
3. User email preferences
4. Template customization per authority
5. Multi-language support
6. Push notifications for mobile app
