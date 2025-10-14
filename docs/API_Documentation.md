# Livestream App API Documentation

## Overview
This API provides endpoints for managing overlay settings and application configuration for the Livestream App. The API is built with Flask and uses MongoDB for data storage.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required for API endpoints.

## Content Type
All requests should use `Content-Type: application/json` for POST and PUT requests.

---

## Endpoints

### 1. Health Check

#### GET /
Check if the API is running.

**Response:**
```json
{
  "message": "Livestream App API",
  "status": "running"
}
```

---

### 2. Overlay Management

#### GET /api/overlays
Retrieve all overlay settings.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Logo Overlay",
      "type": "logo",
      "content": "https://example.com/logo.png",
      "position": {
        "x": 50,
        "y": 50
      },
      "size": {
        "width": 200,
        "height": 100
      },
      "style": {},
      "visible": true,
      "created_at": "2023-09-01T12:00:00.000Z",
      "updated_at": "2023-09-01T12:00:00.000Z"
    }
  ]
}
```

#### POST /api/overlays
Create a new overlay setting.

**Request Body:**
```json
{
  "name": "My Text Overlay",
  "type": "text",
  "content": "Hello World!",
  "position": {
    "x": 100,
    "y": 150
  },
  "size": {
    "width": 300,
    "height": 50
  },
  "style": {
    "color": "#ffffff",
    "fontSize": "18px",
    "backgroundColor": "rgba(0, 0, 0, 0.7)",
    "textAlign": "center"
  },
  "visible": true
}
```

**Required Fields:**
- `name` (string): Display name for the overlay
- `type` (string): Either "text" or "logo"
- `content` (string): Text content or image URL
- `position` (object): x and y coordinates
- `size` (object): width and height dimensions

**Optional Fields:**
- `style` (object): Styling options for text overlays
- `visible` (boolean): Whether overlay is visible (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "My Text Overlay",
    "type": "text",
    "content": "Hello World!",
    "position": {
      "x": 100,
      "y": 150
    },
    "size": {
      "width": 300,
      "height": 50
    },
    "style": {
      "color": "#ffffff",
      "fontSize": "18px",
      "backgroundColor": "rgba(0, 0, 0, 0.7)",
      "textAlign": "center"
    },
    "visible": true,
    "created_at": "2023-09-01T12:30:00.000Z",
    "updated_at": "2023-09-01T12:30:00.000Z"
  }
}
```

#### GET /api/overlays/{overlay_id}
Retrieve a specific overlay by ID.

**Parameters:**
- `overlay_id` (string): MongoDB ObjectId of the overlay

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Logo Overlay",
    "type": "logo",
    "content": "https://example.com/logo.png",
    "position": {
      "x": 50,
      "y": 50
    },
    "size": {
      "width": 200,
      "height": 100
    },
    "style": {},
    "visible": true,
    "created_at": "2023-09-01T12:00:00.000Z",
    "updated_at": "2023-09-01T12:00:00.000Z"
  }
}
```

#### PUT /api/overlays/{overlay_id}
Update an existing overlay.

**Parameters:**
- `overlay_id` (string): MongoDB ObjectId of the overlay

**Request Body:**
```json
{
  "name": "Updated Overlay Name",
  "position": {
    "x": 200,
    "y": 100
  },
  "visible": false
}
```

**Note:** Only include fields you want to update. All fields are optional.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Updated Overlay Name",
    "type": "logo",
    "content": "https://example.com/logo.png",
    "position": {
      "x": 200,
      "y": 100
    },
    "size": {
      "width": 200,
      "height": 100
    },
    "style": {},
    "visible": false,
    "created_at": "2023-09-01T12:00:00.000Z",
    "updated_at": "2023-09-01T12:35:00.000Z"
  }
}
```

#### DELETE /api/overlays/{overlay_id}
Delete an overlay.

**Parameters:**
- `overlay_id` (string): MongoDB ObjectId of the overlay

**Response:**
```json
{
  "success": true,
  "message": "Overlay deleted successfully"
}
```

---

### 3. Settings Management

#### GET /api/settings
Retrieve application settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "rtsp_url": "rtsp://example.com/stream",
    "updated_at": "2023-09-01T12:00:00.000Z"
  }
}
```

#### POST /api/settings
Update application settings.

**Request Body:**
```json
{
  "rtsp_url": "rtsp://newstream.example.com/live"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rtsp_url": "rtsp://newstream.example.com/live",
    "updated_at": "2023-09-01T12:40:00.000Z"
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (missing required fields, invalid data)
- `404` - Not Found (overlay not found)
- `500` - Internal Server Error

---

## Data Types

### Overlay Types
- `text`: Text-based overlay with customizable styling
- `logo`: Image-based overlay from URL

### Position Object
```json
{
  "x": 100,  // X coordinate in pixels
  "y": 50    // Y coordinate in pixels
}
```

### Size Object
```json
{
  "width": 200,   // Width in pixels
  "height": 100   // Height in pixels
}
```

### Style Object (for text overlays)
```json
{
  "color": "#ffffff",                    // Text color (hex or named)
  "fontSize": "16px",                    // Font size
  "fontWeight": "normal",                // Font weight
  "backgroundColor": "rgba(0,0,0,0.7)",  // Background color
  "textAlign": "left"                    // Text alignment (left, center, right)
}
```

---

## Example Usage

### Creating a Text Overlay
```bash
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Message",
    "type": "text",
    "content": "Welcome to our stream!",
    "position": {"x": 50, "y": 50},
    "size": {"width": 300, "height": 60},
    "style": {
      "color": "#ffffff",
      "fontSize": "20px",
      "backgroundColor": "rgba(0, 0, 0, 0.8)",
      "textAlign": "center"
    }
  }'
```

### Creating a Logo Overlay
```bash
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Company Logo",
    "type": "logo",
    "content": "https://example.com/logo.png",
    "position": {"x": 20, "y": 20},
    "size": {"width": 150, "height": 75}
  }'
```

### Updating Overlay Position
```bash
curl -X PUT http://localhost:5000/api/overlays/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -d '{
    "position": {"x": 200, "y": 100}
  }'
```
