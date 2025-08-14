# Appointments Management Feature

This document describes the new appointments management feature added to the GovTimeSync application.

## Overview

The appointments management feature allows government officials to:
- View all appointments scheduled for their authority
- Add official comments to appointments
- Edit existing comments
- Delete comments

## Frontend Implementation

### New Components Created

1. **Appointments Page** (`src/pages/Appointments.tsx`)
   - Displays all appointments for the logged-in official's authority
   - Provides interface for comment management
   - Responsive design with card-based layout

### Features

- **View Appointments**: Display all appointments with user details, date, time, and related issues
- **Add Comments**: Officials can add comments to appointments using a modal dialog
- **Edit Comments**: Existing comments can be modified
- **Delete Comments**: Comments can be removed entirely
- **Real-time Updates**: The appointment list refreshes after comment operations

### API Integration

The frontend connects to the following backend endpoints:

- `GET /api/appointments/authority-appointments` - Fetch all appointments for the authority
- `POST /api/comments/add-comment` - Add a new comment to an appointment
- `PUT /api/comments/update-comment` - Update an existing comment
- `DELETE /api/comments/delete-comment/:appointment_id` - Delete a comment

## Backend Implementation

### Controllers

**CommentController.js** includes the following methods:
- `addCommentToAppointment`: Add official comments to appointments
- `getAppointmentComment`: Retrieve comments for specific appointments
- `updateAppointmentComment`: Modify existing comments
- `deleteAppointmentComment`: Remove comments

### Routes

**CommentRouter.js** provides RESTful endpoints:
- `POST /api/comments/add-comment`
- `GET /api/comments/appointment/:appointment_id`
- `PUT /api/comments/update-comment`
- `DELETE /api/comments/delete-comment/:appointment_id`

### Security

- All comment operations require official authentication (`verifyOfficialToken`)
- Officials can only comment on appointments belonging to their authority
- Proper authorization checks prevent unauthorized access

## Database Schema

The feature uses the existing `official_comment` field in the `Appointment` table:

```sql
model Appointment {
  appointment_id   Int      @id @default(autoincrement())
  user_id          Int
  authority_id     Int
  issue_id         Int?
  date             DateTime @db.Date
  time_slot        String?
  official_comment String?  -- Used for storing comments
  
  -- Relations...
}
```

## Usage

### For Government Officials

1. **Access Appointments**: Navigate to `/appointments` after logging in
2. **Add Comment**: Click "Add Comment" button on any appointment card
3. **Edit Comment**: Click "Edit" button next to existing comments
4. **Delete Comment**: Click "Delete" button to remove comments

### Navigation

The appointments page is accessible through:
- Desktop navigation: "Appointments" button in the top navigation bar
- Mobile navigation: "Appointments" option in the mobile menu
- Direct URL: `/appointments`

## Error Handling

The application includes comprehensive error handling:
- Network error notifications using toast messages
- Loading states during API calls
- Validation for required fields
- Authorization error handling

## Responsive Design

The appointments page is fully responsive:
- Card-based layout that adapts to different screen sizes
- Mobile-optimized navigation
- Touch-friendly buttons and interactive elements

## Dependencies

### Frontend
- React Router for navigation
- Sonner for toast notifications
- Radix UI components for dialog and form elements
- Lucide React for icons

### Backend
- Express.js for routing
- Prisma for database operations
- JWT for authentication
- CORS for cross-origin requests

## Future Enhancements

Potential improvements could include:
- Comment history and versioning
- Notification system for comment updates
- Bulk comment operations
- Comment templates for common responses
- File attachments in comments
