# OpenAPI Comment Endpoints Documentation

## Summary of Changes Made to openapi.yaml

The following changes were made to the OpenAPI specification to document the new comment-related endpoints:

### 1. New Tag Added
- **comment-related**: endpoints related to appointment comments

### 2. New Endpoints Added

#### POST /api/comments/add-comment
- **Purpose**: Allows government officials to add comments to appointments
- **Authentication**: Requires official bearer token
- **Authorization**: Officials can only comment on appointments for their authority
- **Request Body**: 
  - `appointment_id` (integer, required)
  - `comment` (string, required)
- **Response**: Returns success message and updated appointment data

#### GET /api/comments/appointment/{appointment_id}
- **Purpose**: Retrieves the official comment for a specific appointment
- **Authentication**: No authentication required (public endpoint)
- **Parameters**: 
  - `appointment_id` (path parameter, integer, required)
- **Response**: Returns appointment ID, comment, and authority information

#### PUT /api/comments/update-comment
- **Purpose**: Allows government officials to update existing comments
- **Authentication**: Requires official bearer token
- **Authorization**: Officials can only update comments for their authority's appointments
- **Request Body**: 
  - `appointment_id` (integer, required)
  - `comment` (string, required)
- **Response**: Returns success message and updated appointment data

#### DELETE /api/comments/delete-comment/{appointment_id}
- **Purpose**: Allows government officials to delete comments from appointments
- **Authentication**: Requires official bearer token
- **Authorization**: Officials can only delete comments for their authority's appointments
- **Parameters**: 
  - `appointment_id` (path parameter, integer, required)
- **Response**: Returns success message and updated appointment data

### 3. Security and Authorization

All comment endpoints (except GET) require:
- **Bearer Token Authentication**: Using the existing `BearerAuth` security scheme
- **Official Token Verification**: Endpoints verify that the token belongs to a government official
- **Authority-based Authorization**: Officials can only manage comments for appointments belonging to their authority

### 4. Error Handling

Comprehensive error responses for all endpoints:
- **400 Bad Request**: Invalid input data or missing required fields
- **401 Unauthorized**: Invalid token or official access required
- **403 Forbidden**: Insufficient permissions (authority mismatch)
- **404 Not Found**: Appointment not found
- **500 Internal Server Error**: Server-side errors

### 5. Schema Integration

The endpoints integrate with existing schemas:
- Uses the existing `models.appointmentData` schema which includes the `official_comment` field
- Maintains consistency with existing appointment-related endpoints
- Follows the same naming conventions and response patterns

### 6. Documentation Quality

Each endpoint includes:
- Clear summaries and descriptions
- Detailed parameter documentation
- Example request/response bodies
- Comprehensive error code documentation
- Proper tagging for organization

## Usage in API Documentation

The updated OpenAPI specification can be used to:
1. Generate interactive API documentation via Swagger UI
2. Generate client SDKs for various programming languages
3. Validate API requests and responses
4. Provide clear documentation for frontend developers
5. Enable API testing and exploration

## Consistency with Implementation

The OpenAPI specification accurately reflects the actual implementation:
- Endpoint paths match the router definitions
- Request/response schemas match the controller logic
- Authentication/authorization requirements match the middleware
- Error responses match the actual error handling in the code

This ensures that the documentation stays in sync with the actual API implementation and provides accurate information for developers using the API.
