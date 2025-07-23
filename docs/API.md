# API Documentation

This document describes the API endpoints needed for the Discord Bot Showcase website with admin panel.

## Base URL
```
/api
```

## Authentication

All admin endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <discord_token>
```

## Endpoints

### Public Endpoints

#### GET /api/bots
Get all published Discord bots for the public website.

**Response:**
```json
[
  {
    "id": "bot-id",
    "name": "Bot Name",
    "description": "Bot description",
    "icon": "fas fa-robot",
    "status": "Online",
    "servers": "1,234",
    "users": "56,789",
    "tags": ["Tag1", "Tag2"],
    "features": ["Feature 1", "Feature 2"],
    "inviteUrl": "https://discord.com/api/oauth2/authorize?...",
    "supportUrl": "https://discord.gg/..."
  }
]
```

### Authentication Endpoints

#### POST /api/auth/discord
Exchange Discord OAuth code for access token.

**Request:**
```json
{
  "code": "discord_oauth_code"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "discord_user_id",
    "username": "username",
    "avatar": "avatar_hash",
    "email": "user@example.com"
  }
}
```

### Admin Endpoints

#### GET /api/admin/bots
Get all bots for the authenticated admin user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "bot-id",
    "name": "Bot Name",
    "description": "Bot description",
    "icon": "fas fa-robot",
    "status": "Online",
    "servers": "1,234",
    "users": "56,789",
    "tags": ["Tag1", "Tag2"],
    "features": ["Feature 1", "Feature 2"],
    "inviteUrl": "https://discord.com/api/oauth2/authorize?...",
    "supportUrl": "https://discord.gg/...",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### POST /api/admin/bots
Create a new bot.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Bot Name",
  "id": "bot-id",
  "description": "Bot description",
  "icon": "fas fa-robot",
  "status": "Online",
  "servers": "1,234",
  "users": "56,789",
  "tags": ["Tag1", "Tag2"],
  "features": ["Feature 1", "Feature 2"],
  "inviteUrl": "https://discord.com/api/oauth2/authorize?...",
  "supportUrl": "https://discord.gg/..."
}
```

**Response:**
```json
{
  "id": "bot-id",
  "name": "Bot Name",
  "description": "Bot description",
  "icon": "fas fa-robot",
  "status": "Online",
  "servers": "1,234",
  "users": "56,789",
  "tags": ["Tag1", "Tag2"],
  "features": ["Feature 1", "Feature 2"],
  "inviteUrl": "https://discord.com/api/oauth2/authorize?...",
  "supportUrl": "https://discord.gg/...",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### PUT /api/admin/bots/:id
Update an existing bot.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Updated Bot Name",
  "description": "Updated description",
  "icon": "fas fa-music",
  "status": "Online",
  "servers": "2,345",
  "users": "67,890",
  "tags": ["Music", "Entertainment"],
  "features": ["Updated Feature 1", "Updated Feature 2"],
  "inviteUrl": "https://discord.com/api/oauth2/authorize?...",
  "supportUrl": "https://discord.gg/..."
}
```

**Response:**
```json
{
  "id": "bot-id",
  "name": "Updated Bot Name",
  "description": "Updated description",
  "icon": "fas fa-music",
  "status": "Online",
  "servers": "2,345",
  "users": "67,890",
  "tags": ["Music", "Entertainment"],
  "features": ["Updated Feature 1", "Updated Feature 2"],
  "inviteUrl": "https://discord.com/api/oauth2/authorize?...",
  "supportUrl": "https://discord.gg/...",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T12:00:00Z"
}
```

#### DELETE /api/admin/bots/:id
Delete a bot.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Bot deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Bot not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Implementation Notes

### Discord OAuth Setup
1. Create a Discord application at https://discord.com/developers/applications
2. Add your redirect URI (e.g., `https://yourdomain.com/admin.html`)
3. Replace `YOUR_DISCORD_CLIENT_ID` in `admin.js` with your actual client ID

### Database Schema
Suggested bot schema:
```sql
CREATE TABLE bots (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(255) DEFAULT 'fas fa-robot',
  status ENUM('Online', 'Offline', 'Maintenance') DEFAULT 'Online',
  servers VARCHAR(50),
  users VARCHAR(50),
  tags JSON,
  features JSON,
  invite_url TEXT,
  support_url TEXT,
  owner_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Security Considerations
- Validate all input data
- Implement rate limiting
- Use HTTPS in production
- Validate Discord tokens with Discord API
- Implement proper CORS policies
- Sanitize user input to prevent XSS

### Deployment
- Set up your backend API with these endpoints
- Configure Discord OAuth with your domain
- Update `API_BASE_URL` in both `script.js` and `admin.js`
- Ensure proper environment variables for Discord client secret
