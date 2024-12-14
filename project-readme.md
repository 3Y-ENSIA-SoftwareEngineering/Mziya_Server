# Mziya Job Platform

## Project Overview
Mziya is a job platform that connects job seekers with employers, providing an intuitive and user-friendly experience.

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mziya-server.git
cd mziya-server
```

### 2. Install Dependencies
```bash
npm run install:all
```
This command will install dependencies for both backend and frontend.

### 3. Environment Configuration
1. In the `backend/.env` file, add your necessary environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

2. In the `frontend/.env` file, add frontend-specific environment variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### 4. Run the Application
```bash
npm start
```
This will start both backend and frontend simultaneously.

### 5. Access the Application
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## Development Scripts
- `npm run backend`: Run backend in development mode
- `npm run frontend`: Run frontend in development mode
- `npm run install:backend`: Install backend dependencies
- `npm run install:frontend`: Install frontend dependencies

## Folder Structure
- `backend/`: Node.js Express backend
- `frontend/`: React frontend
- `package.json`: Workspace management

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/mziya-server](https://github.com/yourusername/mziya-server)
