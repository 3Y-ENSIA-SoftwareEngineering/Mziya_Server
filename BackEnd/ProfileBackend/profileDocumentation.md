# **Profile Documentation**

### **Features:**
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
1. Save the provided code files (`profile.jsx`, `ProfileServer.js`, `.env`) in a project directory.

---

### **Step 3: Install Dependencies**
1. Open a terminal/command prompt.
2. Navigate to the project directory.
3. Run the following commands:
   ```bash
   # Initialize the project
   npm init -y

   # Install required libraries for the client
   npm install react react-dom axios bootstrap

   # Install required libraries for the server
   npm install express cors dotenv @supabase/supabase-js
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
1. Run the following command in the terminal:
   ```bash
   node ProfileServer.js
   ```
2. The server will start at `http://localhost:5000`.

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
5. Open the application in a browser at `http://localhost:3000`.

---

## **Usage**
1. Open the application in a browser.
2. Log in to access the profile and job management features.
3. Use the profile section to update the profile picture and change the password.
4. View and manage job deals and offers.

---

## **What the Code Does**
1. **Frontend (`profile.jsx`)**:
   - Fetches user profile, job deals, and job offers from the backend server.
   - Displays profile and job details with interactive UI elements.

2. **Backend (`ProfileServer.js`)**:
   - Connects to Supabase for data storage and management.
   - Handles API endpoints for fetching user data, job data, and profile updates.

---

### **For Assistance**
- Ensure Node.js and npm are correctly installed.
- Check for network issues if the frontend cannot connect to the backend.
- Ensure the `.env` file has the correct Supabase credentials.

