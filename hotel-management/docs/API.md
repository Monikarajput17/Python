# Hotel Management API Documentation

## Base URL

```
https://api.hotelmanagement.com/api/v1
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## 📋 Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Room Management APIs](#room-management-apis)
3. [Booking APIs](#booking-apis)
4. [Payment APIs](#payment-apis)
5. [Customer APIs](#customer-apis)
6. [Admin APIs](#admin-apis)
7. [AI APIs](#ai-apis)

---

## 🔐 Authentication APIs

### Register User

**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": []
}
```

---

### Login User

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Refresh Token

**POST** `/auth/refresh`

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Logout

**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🏨 Room Management APIs

### Get All Rooms

**GET** `/rooms?page=1&limit=10&category=luxury&minPrice=100&maxPrice=500`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Room category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search query

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Deluxe Room",
      "description": "Luxurious room with ocean view",
      "category": "luxury",
      "capacity": 2,
      "pricePerNight": 250,
      "amenities": ["WiFi", "AC", "TV"],
      "images": [
        {
          "url": "https://cdn.com/image.jpg",
          "type": "3d",
          "alt": "Room view"
        }
      ],
      "isAvailable": true,
      "rating": 4.5,
      "reviews": 42
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### Get Room Details

**GET** `/rooms/:roomId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Deluxe Room",
    "description": "Luxurious room with ocean view",
    "category": "luxury",
    "capacity": 2,
    "pricePerNight": 250,
    "amenities": ["WiFi", "AC", "TV", "Balcony"],
    "images": [
      {
        "url": "https://cdn.com/image-3d-1.jpg",
        "type": "3d-360",
        "alt": "3D room view"
      }
    ],
    "availabilityCalendar": {
      "2026-05-20": true,
      "2026-05-21": false,
      "2026-05-22": true
    },
    "rating": 4.5,
    "reviews": [
      {
        "id": "uuid",
        "author": "John Doe",
        "rating": 5,
        "comment": "Excellent room!",
        "date": "2026-05-10T10:30:00Z"
      }
    ]
  }
}
```

---

### Create Room (Admin Only)

**POST** `/rooms`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
name: "Deluxe Room"
description: "Luxurious room with ocean view"
category: "luxury"
capacity: 2
pricePerNight: 250
amenities: ["WiFi", "AC", "TV"]
images: [file1, file2, file3]
```

**Response (201):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": "uuid",
    "name": "Deluxe Room",
    "category": "luxury"
  }
}
```

---

### Update Room (Admin Only)

**PUT** `/rooms/:roomId`

**Response (200):**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": { ... }
}
```

---

### Delete Room (Admin Only)

**DELETE** `/rooms/:roomId`

**Response (200):**
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

## 📅 Booking APIs

### Create Booking

**POST** `/bookings`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "roomId": "uuid",
  "checkInDate": "2026-05-20",
  "checkOutDate": "2026-05-25",
  "numberOfGuests": 2,
  "specialRequests": "Late checkout needed"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "uuid",
    "bookingReference": "HM20260520001",
    "status": "pending",
    "checkInDate": "2026-05-20",
    "checkOutDate": "2026-05-25",
    "numberOfNights": 5,
    "totalPrice": 1250,
    "paymentUrl": "https://payment.gateway.com/..."
  }
}
```

---

### Get My Bookings

**GET** `/bookings/my-bookings?status=pending&page=1`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingReference": "HM20260520001",
      "room": { ... },
      "status": "confirmed",
      "checkInDate": "2026-05-20",
      "checkOutDate": "2026-05-25",
      "totalPrice": 1250,
      "createdAt": "2026-05-16T10:30:00Z"
    }
  ]
}
```

---

### Cancel Booking

**POST** `/bookings/:bookingId/cancel`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "reason": "Plans changed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "refundAmount": 1200,
    "refundStatus": "pending"
  }
}
```

---

## 💳 Payment APIs

### Initiate Payment (Razorpay)

**POST** `/payments/razorpay/create-order`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "bookingId": "uuid",
  "amount": 1250
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_xxxxx",
    "amount": 125000,
    "currency": "INR",
    "keyId": "rzp_live_xxxxx"
  }
}
```

---

### Verify Payment (Razorpay)

**POST** `/payments/razorpay/verify`

**Request Body:**
```json
{
  "orderId": "order_xxxxx",
  "paymentId": "pay_xxxxx",
  "signature": "signature_xxxxx"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "bookingId": "uuid",
    "paymentStatus": "success",
    "invoiceUrl": "https://cdn.com/invoice.pdf"
  }
}
```

---

### Get Payment History

**GET** `/payments/history?page=1`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "amount": 1250,
      "currency": "INR",
      "status": "success",
      "method": "razorpay",
      "transactionId": "pay_xxxxx",
      "date": "2026-05-16T10:30:00Z"
    }
  ]
}
```

---

## 👥 Customer APIs

### Get My Profile

**GET** `/customers/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "profileImage": "https://cdn.com/avatar.jpg",
    "joinDate": "2026-01-15T10:30:00Z",
    "totalBookings": 5,
    "totalSpent": 5000
  }
}
```

---

### Update Profile

**PUT** `/customers/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 📊 Admin APIs

### Get Dashboard Stats

**GET** `/admin/dashboard/stats`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 150000,
    "totalBookings": 125,
    "occupancyRate": 78,
    "averageBookingValue": 1200,
    "totalCustomers": 450,
    "availableRooms": 15,
    "pendingPayments": 5,
    "chartData": {
      "dailyRevenue": [...],
      "bookingTrends": [...],
      "occupancyChart": [...]
    }
  }
}
```

---

### Get All Customers (Admin)

**GET** `/admin/customers?page=1&limit=20&search=name`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

---

## 🤖 AI APIs

### Chat with AI Assistant

**POST** `/ai/chat`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "message": "I need a room for 2 people with a view",
  "conversationId": "uuid" (optional)
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "response": "I found 3 rooms that match your criteria...",
    "recommendations": [
      {
        "roomId": "uuid",
        "name": "Ocean View Deluxe",
        "confidence": 0.95
      }
    ]
  }
}
```

---

### Get Room Recommendations

**GET** `/ai/recommendations?capacity=2&budget=300`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "roomId": "uuid",
      "name": "Deluxe Room",
      "matchScore": 0.95,
      "reason": "Matches your budget and capacity requirements"
    }
  ]
}
```

---

## ❌ Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Token expired or invalid"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "requestId": "uuid"
}
```

---

## 📝 Status Codes Summary

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

**Last Updated**: 2026-05-16
