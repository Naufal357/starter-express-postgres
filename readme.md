# Express.js JWT Authentication Starter

## 📦 Starter Code Overview

A ready-to-use Express.js boilerplate with JWT authentication and PostgreSQL integration, following MVC architecture.

### 🛠️ Core Technologies

```javascript
// package.json dependencies
{
  "express": "^4.18.2",        // Web framework
  "pg": "^8.11.3",             // PostgreSQL client
  "bcryptjs": "^2.4.3",        // Password hashing
  "jsonwebtoken": "^9.0.2",    // JWT generation
  "dotenv": "^16.3.1"          // Environment variables
}
```

### 🚀 API Endpoints
This boilerplate provides two sets of API endpoints. The first set is for user authentication, and the second set is for managing users. All endpoints are JSON-based and use standard HTTP methods.

#### 🔑 Authentication Routes

| Method | Endpoint | Description | Request Body |
| --- | --- | --- | --- |
| POST | /api/auth/register | Register new user | { username, password, name, email } |
| POST | /api/auth/login | Login user | { username, password } |

#### 👥 User Management (Authenticated)

| Method | Endpoint | Description | Headers Required |
| --- | --- | --- | --- |
| GET | /api/users | Get all users | Authorization: Bearer {token} |
| POST | /api/users | Create new user | Authorization: Bearer {token} |
| PUT | /api/users/:id | Update user | Authorization: Bearer {token} |
| DELETE | /api/users/:id | Delete user | Authorization: Bearer {token} |

### 🐳 Docker Compose Commands

| Command | Description |
| --- | --- |
| `docker-compose up -d` | Run Docker Compose in detached mode |
| `docker-compose stop` | Stop Docker Compose |
| `docker-compose down -v` | Remove containers and volumes |
| `docker-compose rm --force` | Remove images |
| `docker-compose down -v --rmi all --remove-orphans` | Remove all images, containers, and volumes |
| `docker-compose restart backend` | Restart backend service |