# Uber Clone - User Authentication API Documentation

## Overview

This document provides comprehensive documentation for the User Authentication APIs in the Uber Clone backend service. The authentication system supports user registration, login, logout, and profile management with JWT token-based authentication.

## Base URL

```
http://localhost:3000/api/users
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. User Registration

Creates a new user account with encrypted password storage.

**Endpoint:** `POST /register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "fullname": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Validation Rules:**

- `fullname`: Required, 3-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, 8-50 characters

**Success Response (201 Created):**

```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "socketId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "jo",
      "msg": "Fullname must be at least 3 characters long",
      "path": "fullname",
      "location": "body"
    }
  ]
}
```

**400 Bad Request - Missing Fields:**

```json
{
  "message": "All fields are required"
}
```

**400 Bad Request - User Already Exists:**

```json
{
  "message": "User already exists"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Internal server error occurred"
}
```

---

### 2. User Login

Authenticates user credentials and returns a JWT token.

**Endpoint:** `POST /login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Validation Rules:**

- `email`: Required, valid email format
- `password`: Required, 8-50 characters

**Success Response (200 OK):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "socketId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**401 Unauthorized - Invalid Credentials:**

```json
{
  "message": "Invalid email or password"
}
```

---

### 3. User Profile

Retrieves the authenticated user's profile information.

**Endpoint:** `GET /profile`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200 OK):**

```json
{
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "socketId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized - Missing Token:**

```json
{
  "message": "Unauthorized"
}
```

**401 Unauthorized - Invalid Token:**

```json
{
  "message": "Unauthorized"
}
```

**401 Unauthorized - Expired Token:**

```json
{
  "message": "Unauthorized"
}
```

**401 Unauthorized - Blacklisted Token:**

```json
{
  "message": "Unauthorized"
}
```

**404 Not Found - User Not Found:**

```json
{
  "message": "User not found"
}
```

---

### 4. User Logout

Invalidates the current JWT token by adding it to a blacklist.

**Endpoint:** `GET /logout`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200 OK):**

```json
{
  "message": "Logged out"
}
```

**Error Responses:**

**401 Unauthorized - Missing Token:**

```json
{
  "message": "Unauthorized"
}
```

**401 Unauthorized - Invalid Token:**

```json
{
  "message": "Unauthorized"
}
```

---

## Data Models

### User Schema

```javascript
{
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    maxlength: 100
  },
  socketId: {
    type: String
  }
}
```

### Blacklisted Token Schema

```javascript
{
  token: {
    type: String,
    required: true
  }
}
```

---

## Security Features

### Password Security

- Passwords are hashed using bcrypt with a salt rounds of 10
- Password field is excluded from queries by default (`select: false`)
- Password must be explicitly selected using `.select("+password")` for authentication

### JWT Token Security

- Tokens expire after 24 hours
- Blacklisted tokens are stored in database for logout functionality
- Token verification includes expiration and blacklist checks

### Input Validation

- Comprehensive validation using express-validator
- Email format validation
- Password strength requirements (8-50 characters)
- Fullname length validation (3-50 characters)

---

## Error Handling

The API implements comprehensive error handling with appropriate HTTP status codes:

- **200**: Success
- **201**: Created (User registration)
- **400**: Bad Request (Validation errors, missing fields)
- **401**: Unauthorized (Invalid credentials, missing/invalid token)
- **404**: Not Found (User not found)
- **500**: Internal Server Error

---

## Environment Variables

Required environment variables:

```env
JWT_SECRET_KEY=your_jwt_secret_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

---

## Dependencies

### Core Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT token management
- `express-validator`: Input validation

### Development Dependencies

- `nodemon`: Development server with auto-restart

---

## Getting Started

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   Create a `.env` file with required variables

3. **Start the Server:**

   ```bash
   npm start
   ```

4. **Development Mode:**
   ```bash
   npm run dev
   ```

---

## API Testing Examples

### Using cURL

**Register User:**

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

**Login User:**

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

**Get Profile (with token):**

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Logout (with token):**

```bash
curl -X GET http://localhost:3000/api/users/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Support

For technical support or questions about the API, please refer to the project documentation or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** January 2024
