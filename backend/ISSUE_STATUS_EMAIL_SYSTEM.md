# Issue Status Update Email Notification System

## Overview
This document describes the email notification system that automatically sends emails to users when the status of their submitted issues is updated by government authorities.

## 🚀 Features

### Automatic Email Notifications
- Triggered automatically when an authority updates an issue status via the API
- Professional, branded email templates with GovPulse styling
- Comprehensive issue information and status change details
- User-friendly explanations of what each status means
- Next steps guidance for users

### Email Content Includes
- **Issue Information**: Title, ID, description, category, authority
- **Status Change**: Previous status → New status with color coding
- **User Details**: Personalized greeting using user's name
- **Urgency Level**: Visual urgency indicators with color coding
- **Timestamps**: Issue creation and last update dates
- **Action Items**: Clear next steps based on the new status
- **Contact Information**: Authority contact for follow-up questions

### Status-Specific Messaging
- **Completed/Resolved**: Congratulatory message with satisfaction follow-up
- **In Progress/Assigned**: Progress update with expectations
- **Pending/Review**: Patience request with review timeline
- **Rejected/Cancelled**: Clear explanation with appeal options

## 📧 Email Templates

### Visual Design
- Clean, professional layout with GovPulse branding
- Color-coded status indicators
- Responsive design for mobile and desktop
- Clear typography and spacing
- Government-appropriate styling

### Content Structure
1. **Header**: Status update announcement
2. **Issue Details Table**: Comprehensive issue information
3. **Status Change Highlight**: Visual before/after comparison
4. **Description Section**: Full issue description display
5. **Explanation Box**: What the status change means
6. **Next Steps**: Actionable guidance for the user
7. **Footer**: Contact information and branding

## 🔧 Technical Implementation

### API Integration
The email system is integrated into the issue status update endpoint:
```
PUT /api/v1/issues/update-status/{issue_id}
```

When this endpoint is called, the system:
1. Validates the status update request
2. Updates the database record
3. Retrieves complete issue and user information
4. Sends an email notification to the user
5. Returns success response with email confirmation

### Email Function
```javascript
const emailData = {
  userEmail: "user@example.com",
  userName: "John Doe",
  userFirstName: "John",
  userLastName: "Doe",
  issueId: 123,
  issueTitle: "Street Lighting Problem",
  issueDescription: "Detailed description...",
  previousStatus: "Pending Review",
  newStatus: "Assigned to Team",
  authorityName: "Municipal Corporation",
  categoryName: "Infrastructure",
  urgencyScore: 7.5,
  updatedAt: new Date(),
  issueCreatedAt: new Date(),
};

await sendIssueStatusUpdateEmail(emailData);
```

### Database Requirements
The system fetches data from these tables:
- `Issue`: Issue details, description, timestamps
- `User`: User email, name information
- `Issue_Status`: Current and new status information
- `Authority`: Authority name and details
- `Category`: Issue category information

## 🛠️ Configuration

### Environment Variables
Required environment variables in `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Email Service Setup
1. **Gmail Setup** (recommended):
   - Enable 2-factor authentication
   - Generate App Password
   - Use App Password in EMAIL_PASS

2. **Other Email Services**:
   - Update transporter configuration in `EmailFunctions.js`
   - Adjust SMTP settings as needed

## 📋 Testing

### Test Script
Use the provided test script to verify email functionality:
```bash
node test-issue-status-email.js
```

### Test Features
- Single email test with sample data
- Multiple status scenario testing
- Error handling validation
- Email formatting verification

### Manual Testing
1. Update an issue status via the API
2. Check user's email inbox
3. Verify email content and formatting
4. Test with different status types
5. Validate responsive design

## 🔄 API Usage Example

### Update Issue Status with Email
```bash
curl -X 'PUT' \
  'http://localhost:4000/api/v1/issues/update-status/1' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_OFFICIAL_TOKEN' \
  -d '{
    "status_id": 2
  }'
```

### Response
```json
{
  "message": "Issue status updated successfully",
  "issue": {
    "issue_id": 1,
    "title": "Street Lighting Problem",
    "status_id": 2,
    // ... other issue details
  },
  "email_sent": true
}
```

## 🎨 Email Status Colors

### Status Color Coding
- **Completed/Resolved**: Green (#16a34a)
- **In Progress/Assigned**: Blue (#2563eb)
- **Pending/Review**: Orange (#ea580c)
- **Rejected/Cancelled**: Red (#dc2626)
- **Other**: Gray (#64748b)

### Urgency Level Colors
- **Critical (8-10)**: Red (#dc2626)
- **High (6-7.9)**: Orange (#ea580c)
- **Medium (4-5.9)**: Yellow (#ca8a04)
- **Low (0-3.9)**: Green (#65a30d)

## 🔍 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check EMAIL_USER and EMAIL_PASS environment variables
   - Verify Gmail App Password setup
   - Check internet connectivity

2. **Email in Spam**
   - Add sender to whitelist
   - Check email content for spam triggers
   - Verify SPF/DKIM records (for production)

3. **Missing User Data**
   - Ensure user exists in database
   - Verify user email is valid
   - Check database relationships

4. **Status Not Found**
   - Verify status_id exists in Issue_Status table
   - Check authority permissions
   - Validate request parameters

### Debugging
Enable detailed logging:
```javascript
console.log("Email data:", emailData);
console.log("Email sent successfully:", result);
```

## 🚧 Future Enhancements

### Planned Features
- SMS notifications for urgent issues
- Email preferences management
- Notification history tracking
- Bulk status update notifications
- Email template customization

### Integration Opportunities
- Mobile app push notifications
- WhatsApp integration for developing regions
- Multilingual email templates
- Advanced email analytics

## 📄 Related Files

### Core Files
- `backend/utils/EmailFunctions.js` - Email template and sending logic
- `backend/controllers/v1/IssueController.js` - API controller with email integration
- `backend/routes/v1/IssueRouter.js` - Route definitions
- `backend/test-issue-status-email.js` - Testing utilities

### Database Schema
- `backend/prisma/schema.prisma` - Database models and relationships

### Configuration
- `backend/.env` - Environment variables
- `backend/package.json` - Dependencies (nodemailer)

## 📞 Support

For technical support or questions about the email notification system:
1. Check this documentation first
2. Review the test script output
3. Examine server logs for error details
4. Contact the development team with specific error messages

---

**Last Updated**: Current Date
**Version**: 1.0.0
**Maintained By**: GovPulse Development Team
