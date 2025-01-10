# Mziya Job Platform

## Project Overview
Mziya is a comprehensive job platform designed to connect job seekers with employers, providing an intuitive and user-friendly experience.

## Project Structure
```
Mziya_Server/
│
├── backend/                # Node.js Express backend
│   ├── src/                # Source code
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route logic
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   └── app.js          # Main server file
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   └── back_end.md         # Backend readme file
├── frontend/               # React frontend
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── screens/        # Page components
│   │   ├── App.js          # Main React component
│   │   └── index.js        # Entry point
│   │──.env                 # Frontend environment variables
│   │── package.json        # Frontend dependencies
│   └── front_end.md        # Frontend readme file
├── Mziaya.md               # Mziya readme file
└── package.json            # Workspace management

```

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

## Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/3Y-ENSIA-SoftwareEngineering/Mziya_Server.git
cd mziya_server
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### Root-Level Dependencies (Optional)
```bash
cd ..
npm install
```

### 3. Environment Configuration
1. In the 'backend/' directory, create a file .env
   `backend/.env` file, add your necessary environment variables:
   you will find all details in the backend/back_end.md 
   ```

   # Supabase Configuration
    SUPABASE_URL=https://yuujovwhtqsufnwcoizj.supabase.co
    SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dWpvdndodHFzdWZud2NvaXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjYzODcsImV4cCI6MjA0ODg0MjM4N30.ClfsLBDOq-Gm_U_nDffZPMrTbVX47xBNKEOMqAlK2EY


    # Server Configuration
    PORT=3000
    NODE_ENV=development
    EMAIL_USER=''
    EMAIL_PASSWORD='' 

    GOOGLE_CLIENT_ID=''
    GOOGLE_CLIENT_SECRET=''
    GOOGLE_REDIRECT_URI=''
    APP_REDIRECT_URI=''
    GOOGLE_REFRESH_TOKEN=''

    TWILIO_SID=''
    TWILIO_API_KEY=''


    JWT_SECRET='' 


    ```

2. **Explanation of Environment Variables**:

    - `EMAIL_USER`: The email address that will be used to send emails to clients.
    - `EMAIL_PASSWORD`: The password for the email account. 

    **Google Authentication and Email Sending Setup**

    To enable Google authentication and email sending, follow these steps:

    1. **Go to Google Cloud Console**: 
        - Visit the [Google Cloud Console](https://console.cloud.google.com/) and log in with your Google account.
        - Create a new project by selecting the dropdown in the top left and clicking on “New Project.”

    2. **Enable Google+ API**:
         - Once the project is created, navigate to the **Library** section on the left sidebar.
        - Search for **Google+ API** and click on it.
        - Click **Enable** to activate the API for your project.

    3. **Set Up OAuth Consent Screen**:
        - In the left sidebar, go to **OAuth Consent Screen**.
        - Choose **External** and click **Create**.
        - Fill out the required fields on the first page of the form:
            - **App Name**: Enter the name of your application.
            - **User Support Email**: Select your email address.
            - **Email Addresses**: Add your email to the developer contact information.
        - Skip the other pages of the form; there's no need to fill them out unless required.
        - **Important**: Avoid uploading an application logo, as this may trigger Google's verification process, which can take additional time.
        - Click **Save and Continue** until the consent screen is configured.

    4. **Publish the App**:
        - After setting up the OAuth Consent Screen, you'll be in the "Test" phase by default.
        - Click **Publish App** to move your app from testing to production.

    5. **Create OAuth Client ID Credentials**:
        - Go to the **Credentials** section in the left sidebar.
        - Click **Create Credentials** and select **OAuth Client ID**.
        - Set **Application Type** to **Web Application** and provide a name for the credentials.
         - In the **Authorized JavaScript origins** section, add `http://localhost:PORT     /` (replace `PORT` with the port number your application will use).
         - In the **Authorized redirect URIs** section, add the following two URIs:
           - **GOOGLE_REDIRECT_URI**: `https://developers.google.com/oauthplayground`
           - **MY_REDIRECT_URI**: `http://localhost:PORT/api/auth/google/callback`
         - The first URI is for internal service use (email functionality), and the      second is where users will be redirected after Google authentication.
         - Click **Create**.

    6. **Add Client ID and Client Secret to .env**:
        - Once the credentials are created, you will receive the **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**.
        - Add these values to your `.env` file:
         ```bash
         GOOGLE_CLIENT_ID='your-google-client-id'
         GOOGLE_CLIENT_SECRET='your-google-client-secret'
         ```

    7. **Generate Google Refresh Token**:
        - The refresh token is necessary for email functionality (sending emails).
        - Visit the [OAuth Playground](https://developers.google.com/oauthplayground).
        - In the left section, scroll down to **Step 1** and enter the following scope: `https://mail.google.com`.
        - At the top right, click on the settings icon and check **Use your own OAuth       credentials**.
        - Enter your **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET** from the `.env`      file.
        - Click **Authorize APIs** and proceed through the account selection and        consent screens.
        - In **Step 2**, click **Exchange authorization code for tokens**.
        - In **Step 3**, click **Refresh access token** to get the refresh token.
        - Copy the refresh token and add it to your `.env` file:
         ```bash
         GOOGLE_REFRESH_TOKEN='your-refresh-token'
         ```
         - Ignore the access token since it expires after one hour; your server will generate it as needed using the refresh token.
   
   ### 

    - `TWILIO_SID` and `TWILIO_API_KEY`: Sign in to [Twilio](https://www.twilio.com/) and generate these from the API section.

    - `JWT_SECRET`: Generate a strong 256-bit character string for securing JWT tokens.

   ```

2.  In the 'frontend/' directory, create a file .env
    In the `frontend/.env` file, add frontend-specific environment variables:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

### 4. Run the Application
From the root directory, run:
```bash
npm start
```

This command will:
- Start the backend on port 3000
- Start the frontend on port 3001

### 5. Access the Application
- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:3001`

## Development Scripts

### Backend Scripts
- `cd backend`
- `npm run dev`: Run backend in development mode with nodemon
- `npm start`: Run backend in production mode

### Frontend Scripts
- `cd frontend`
- `npm start`: Start the React development server
- `npm run build`: Create a production build

## Troubleshooting
- Ensure all dependencies are installed correctly
- Check that ports 3000 and 3001 are not in use by other applications
- Verify your `.env` files are properly configured

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Common Issues
- If you encounter dependency errors, try:
  ```bash
  npm cache clean --force
  npm install
  ```
- Ensure you're using compatible Node.js and npm versions

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Amel FEDDAG - amel.feddag@ensia.edu.dz

Project Link: [https://github.com/3Y-ENSIA-SoftwareEngineering/Mziya_Server.git](https://github.com/3Y-ENSIA-SoftwareEngineering/Mziya_Server.git)