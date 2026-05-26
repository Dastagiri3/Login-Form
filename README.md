# Login Form with Database

A secure login system with SQLite database storage for user credentials.

Live Demo URL: https://dastagiri3.github.io/Login-Form/

## Features

- User registration (sign up)
- User login authentication
- Password hashing using bcrypt
- SQLite database for data persistence
- RESTful API endpoints
- Modern, responsive UI

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## Database

The application uses SQLite database (`users.db`) which will be created automatically when you start the server. The database stores:

- User ID (auto-increment)
- Email (unique)
- Hashed password
- Creation timestamp

## API Endpoints

### POST `/api/register`
Register a new user
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Success Response**: `{ "success": true, "message": "User registered successfully", "userId": 1 }`
- **Error Response**: `{ "success": false, "message": "Error message" }`

### POST `/api/login`
Login with existing credentials
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Success Response**: `{ "success": true, "message": "Login successful", "user": {...} }`
- **Error Response**: `{ "success": false, "message": "Invalid email or password" }`

### GET `/api/users`
Get all users (for testing purposes - remove in production)

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- Email validation
- Password length validation (minimum 6 characters)
- SQL injection protection using parameterized queries
- CORS enabled for cross-origin requests

## Files Structure

- `index.html` - Frontend login form
- `server.js` - Express server with API endpoints
- `package.json` - Dependencies and scripts
- `users.db` - SQLite database (created automatically)

