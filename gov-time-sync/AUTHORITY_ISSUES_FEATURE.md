# Authority Issues Feature

This feature allows officials to view and manage issues assigned to their authority.

## Backend Endpoints

### Get Authority Issues
- **Endpoint**: `GET /api/issues/authority-issues`
- **Authentication**: Requires `verifyOfficialToken` middleware
- **Description**: Retrieves all issues assigned to the authenticated official's authority
- **Response**: Returns issues with user, status, authority, and category information

### Update Issue Status
- **Endpoint**: `PUT /api/issues/update-status/{issue_id}`
- **Authentication**: Requires `verifyOfficialToken` middleware
- **Body**: `{ "status_id": number }`
- **Description**: Updates the status of an issue (only for issues assigned to the official's authority)

## Frontend Features

### Authority Issues Page (`/authority-issues`)
- **Location**: `src/pages/AuthorityIssues.tsx`
- **Route**: `/authority-issues`
- **Navigation**: Added to authenticated navigation menu

#### Features:
1. **Statistics Dashboard**
   - Total issues count
   - Critical issues count (urgency score ≥ 8)
   - Authority ID display

2. **Advanced Filtering**
   - Search by title, description, or user email
   - Filter by issue status (Pending, In Progress, Resolved, Closed)
   - Filter by urgency level (Critical, High, Medium, Low)
   - Clear all filters option

3. **Issue Management**
   - View comprehensive issue details
   - Color-coded urgency badges
   - Update issue status with modal interface
   - Real-time status updates

4. **Responsive Design**
   - Mobile-friendly layout
   - Responsive grid system
   - Touch-optimized controls

## Security
- Only authenticated officials can access the endpoints
- Officials can only view/update issues assigned to their authority
- JWT token validation with proper error handling

## Usage
1. Official logs into the system
2. Navigates to "Authority Issues" from the navigation menu
3. Views all issues assigned to their authority
4. Uses filters to find specific issues
5. Updates issue status as needed

## Error Handling
- Comprehensive error messages
- Toast notifications for success/failure
- Loading states for better UX
- Graceful handling of network errors
