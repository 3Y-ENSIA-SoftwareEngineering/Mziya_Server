# Mziya Backend Service

## Project Overview
A comprehensive backend service for the Mziya job platform, built with Express.js and designed to provide robust API endpoints for job posting, job applications, authentication, and user management.

## Technology Stack
- Node.js
- Express.js
- ES Modules
- Cors
- Dotenv
- Supabase

## Project Structure
```
backend/
├── functionalities_readme/  # Documentation for each feature
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route logic handlers
│   │   ├── auth.controller.js
│   │   ├── contact.controller.js
│   │   ├── getJob.controller.js
│   │   ├── postJob.controller.js
│   │   ├── profile.controller.js
│   │   └── applyJob.controller.js
│   ├── emails/        # Email templates
│   ├── middleware/    # Custom middleware
│   ├── models/        # Data models
│   ├── routes/        # API route definitions
│   │   ├── index.js
│   │   ├── auth.route.js
│   │   ├── contact.route.js
│   │   ├── getJob.route.js
│   │   ├── postJob.route.js
│   │   ├── profile.route.js
│   │   └── applyJob.route.js
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── app.js         # Main server configuration
├── tests/             # Test files
├── .env              # Environment configuration
├── .gitignore        
├── package.json      
└── README.md         
```

## API Endpoints

### Base URL
http://localhost:3000/api

### Authentication Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | User login | No |
| GET | /auth/profile | Get user profile | Yes |

### Job Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | /jobs/addjob | Create a new job posting | Yes |
| GET | /getJob | Retrieve job listings | No |
| GET | /getJob/best-price | Get jobs by price ordering | No |
| GET | /getJob/category/:category | Get jobs by category | No |

### Application Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | /apply/:jobId | Apply for a job | Yes |
| GET | /apply/applications | Get user's applications | Yes |

### Profile Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| GET | /profile | Get user profile | Yes |
| PUT | /profile | Update user profile | Yes |

### Contact Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | /contact | Submit contact form | No |

## Environment Configuration
Required environment variables:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CORS_ORIGIN=http://localhost:3001
```

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
- Job posting and retrieval
- Job application system
- User authentication
- Profile management
- Contact form functionality
- Email notifications
- File uploads for resumes

## Error Handling
Consistent error response format:
```json
{
  "message": "Error description",
  "error": {} // Detailed error in non-production environments
}
```

## Security Features
- Cors restricted to http://localhost:3001
- Environment-based error masking
- JWT authentication

## Middleware
- Authentication middleware
- CORS configuration
- JSON body parsing
- Error handling middleware

## License
MIT license

## Contact
- Project Maintainer: amel.feddag@ensia.edu.dz