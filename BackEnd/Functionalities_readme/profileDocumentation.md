# **Profile Documentation**

### **Features**

1. Display user profile details (name, email, location).
2. Change password functionality.
3. Upload and update profile picture.
4. Fetch and display job deals and job offers.

---

## **Installation and Setup**

### **Step 1: Install Required Software**

1. Install [Node.js](https://nodejs.org/) (LTS version recommended).
2. Install [npm](https://www.npmjs.com/) (comes with Node.js).

---

### **Step 2: Download and Prepare the Project**

1. Save the provided code files (`profile.jsx`, `profile.controller.js`, `profile.route.js`, `.env`) in a project directory.

---

### **Step 3: Install Dependencies**

1. Open a terminal/command prompt.
2. Navigate to the project directory.
3. Run the following commands:

   ```bash
   # Initialize the project
   npm init -y

   # Install backend dependencies
   npm install express multer cors dotenv @supabase/supabase-js

   # Install frontend dependencies (if in a separate folder)
   npm install react react-dom axios bootstrap
   ```

---

### **Step 4: Configure the Environment**

1. Open the `.env` file.
2. Ensure the following variables are set correctly:
   ```plaintext
   SUPABASE_URL=https://your-supabase-url
   SUPABASE_KEY=your-supabase-key
   ```
   Replace `your-supabase-url` and `your-supabase-key` with your Supabase project details.

---

### **Step 5: Start the Server**

1. Navigate to the backend project folder.
2. Run the following command:
   ```bash
   node ProfileServer.js
   ```
3. The server will start at `http://localhost:3000`.

---

### **Step 6: Start the Client**

1. Create a React application in the client folder:
   ```bash
   npx create-react-app client
   ```
2. Replace the `App.js` file with the `profile.jsx` code.
3. Install required client libraries in the `client` directory:
   ```bash
   npm install axios bootstrap
   ```
4. Start the React application:
   ```bash
   npm start
   ```
5. Open the application in a browser at `http://localhost:3001`.

---

## **Usage**

1. Open the application in a browser.
2. Log in to access the profile and job management features.
3. Use the profile section to:
   - Update profile picture.
   - Change the password.
   - Edit email and phone number.
4. View and manage job deals and offers.

---

## **Backend Overview**

### **Routes (`profile.route.js`)**

1. **GET `/user`**: Fetches the logged-in user's profile.
2. **GET `/jobDeals`**: Retrieves job deals related to the user.
3. **GET `/jobOffers`**: Fetches job offers created by the user.
4. **POST `/changePassword`**: Updates the user's password.
5. **POST `/update`**: Updates the user's email and phone number.
6. **POST `/uploadProfilePic`**: Uploads and updates the user's profile picture.

---

### **Controllers (`profile.controller.js`)**

1. **getUserProfile**: Retrieves user details and returns them.
2. **getJobDeals**: Fetches jobs associated with the user.
3. **getJobOffers**: Retrieves job offers and their applications.
4. **changePassword**: Validates and updates the user's password.
5. **updateUserProfile**: Updates email and phone number.
6. **uploadProfilePic**: Handles profile picture upload and saves it in the database.

---

## **Frontend Overview**

### **Features (`profile.jsx`)**

1. **Profile Info**: Displays user details (name, email, phone number, profile picture).
2. **Update Profile**: Allows editing email and phone number.
3. **Change Password**: Enables password updates.
4. **Job Deals**: Lists user's active job deals.
5. **Job Offers**: Displays job offers and allows managing applications.

---

## **What the Code Does**

1. **Frontend (`profile.jsx`)**:

   - Fetches user profile, job deals, and job offers from the backend server.
   - Displays profile and job details with interactive UI elements.
   - Allows users to update their profile and manage jobs.

2. **Backend**:
   - **Routes** (`profile.route.js`): Defines the API endpoints for profile-related features.
   - **Controllers** (`profile.controller.js`): Implements the logic for profile management, job data retrieval, and user updates.

---

### **For Assistance**

1. Ensure Node.js and npm are correctly installed.
2. Verify `.env` configuration for Supabase credentials.
3. Check for network connectivity if the frontend cannot connect to the backend.
4. Ensure both server (`http://localhost:3000`) and client (`http://localhost:3001`) are running.
