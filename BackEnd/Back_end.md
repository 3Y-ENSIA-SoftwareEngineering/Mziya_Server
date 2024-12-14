# Mziya Backend Service

## Project Overview
A comprehensive backend service for the Mziya job platform, built with Express.js and designed to provide robust API endpoints for job posting, authentication, and user management.

## Technology Stack
- Node.js
- Express.js
- ES Modules
- Cors
- Dotenv

## backend Structure
```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route logic handlers
│   │   ├── auth.controller.js
│   │   ├── contact.controller.js
│   │   ├── getJob.controller.js
│   │   ├── postJob.controller.js
│   │   └── profile.controller.js
│   ├── middleware/     # Custom middleware
│   ├── models/         # Data models
│   ├── routes/         # API route definitions
│   │   ├── index.js
│   │   ├── auth.route.js
│   │   ├── contact.route.js
│   │   ├── getJob.route.js
│   │   ├── postJob.route.js
│   │   └── profile.route.js
│   └── app.js          # Main server configuration
└── .env               # Environment configuration
```

## API Endpoints

### Base URL
`http://localhost:3000/api`

### Authentication Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |

### Job Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | `/jobs/addjob` | Create a new job posting | Yes |
| GET | `/getJob` | Retrieve job listings | No |
| GET | `/getJob/best-price` | Get jobs by price ordering | No |
| GET | `/getJob/category/:category` | Get jobs in a certain | No |

### Contact Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | `/contact` | Submit contact form | No |

## Environment Configuration
Create a `.env` file with the variables as stated in Mziya.md

## Installation

### 1. Clone the Repository
```bash
git clone [your-repository-url]
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Key Features
- Modular route structure
- Cors configuration (localhost:3001)
- ES Module support

## Error Handling
Consistent error response format:
```json
{
  "message": "Error description",
  "error": {} // Detailed error in non-production environments
}
```

## Security Features
- Cors restricted to `http://localhost:3001`
- Environment-based error masking
- Supports JWT authentication (implied by routes)

## Middleware
- CORS configuration
- JSON body parsing
- Centralized error handling middleware

## Potential Improvements
- Add input validation
- Implement comprehensive logging
- Enhanced error handling
- Add rate limiting
- Implement more robust authentication middleware

## Debugging
- Check `.env` configuration
- Ensure all dependencies are installed
- Verify supabase connection
- Check network permissions for Cors

## Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
//

## Contact
- Project Maintainer: amel.feddag@ensia.edu.dz
```
