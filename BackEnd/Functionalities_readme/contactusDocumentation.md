# Documentation for Contact Us Feature

## Overview
This documentation explains the implementation of the **Contact Us** feature using a React frontend (`ContactUs.jsx`) and a Node.js backend (`ContactUsBackend.js`). The purpose of this feature is to allow users to fill out a form and send their inquiries, which are then delivered via email to a specified recipient.
---

## Prerequisites
1. **Tools Needed**:
   - Node.js (for running the backend).
   - A text editor (e.g., VS Code).
   - A browser to view the React frontend.
2. **Accounts**:
   - A Gmail account (or another email provider) for sending emails.

---

## Backend Setup (`ContactUsBackend.js`)

### Step 1: File Overview
The backend file is a Node.js server that:
- Accepts form data from the frontend.
- Sends an email using Nodemailer.

### Step 2: Environment Variables (`.env` file)
Create a `.env` file in the same directory as `ContactUsBackend.js` and add the following:
```
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
RECIPIENT_EMAIL=recipient-email@gmail.com
PORT=5000
```
- Replace `your-email@gmail.com` with your Gmail address. 
- Replace `your-app-password` with an **App Password** (not your regular Gmail password).
- Replace `recipient-email@gmail.com` with the email address where messages will be sent.

> **Note**: For Gmail, you need to enable "Allow less secure apps" or use an App Password (preferred for security).

### Step 3: Install Dependencies
Run the following commands to set up the backend:
```bash
# Initialize a Node.js project (if not already done)
npm init -y

# Install required packages
npm install express cors nodemailer dotenv
```

### Step 4: Code Explanation
#### Key Functionalities:
1. **Express Server**:
   - Listens for POST requests on the `/send-message` endpoint.
   - Processes the data received from the frontend.
2. **Nodemailer**:
   - Sends an email with the received data to the recipient.

#### Code Walkthrough:
```javascript
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail as the email provider
  auth: {
    user: process.env.EMAIL_USER, // Sender's email
    pass: process.env.EMAIL_APP_PASSWORD // App password
  }
});

// Handle POST requests to /send-message
app.post('/send-message', async (req, res) => {
  try {
    const { name, surname, email, message } = req.body;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Message from ${name} ${surname}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name} ${surname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 5: Run the Backend
1. Save the file as `ContactUsBackend.js`.
2. Run the server:
   ```bash
   node ContactUsBackend.js
   ```
3. The backend will start on `http://localhost:5000`.

---

## Frontend Setup (`ContactUs.jsx`)

### Step 1: File Overview
The React component provides a user interface for:
- Collecting user inputs (name, surname, email, message).
- Sending the data to the backend via an API call.
- Displaying success or error messages using a modal.

### Step 2: Key Functionalities
1. **Form Handling**:
   - Uses `useState` to manage form data.
2. **API Call**:
   - Sends a `POST` request to the backend with the form data using `fetch`.
3. **Modal**:
   - Displays feedback (success or error) based on the response from the backend.

### Step 3: Code Walkthrough
#### Key Functions:
1. **`handleChange`**:
   - Updates the form fields as the user types.
   ```javascript
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prevData) => ({
       ...prevData,
       [name]: value,
     }));
   };
   ```

2. **`handleSubmit`**:
   - Sends the form data to the backend using the `fetch` API.
   ```javascript
   const handleSubmit = (e) => {
     e.preventDefault();
     setIsSubmitting(true);

     fetch("http://localhost:5000/send-message", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(formData),
     })
       .then((response) => response.json())
       .then(() => {
         setModalInfo({
           show: true,
           message: "Message sent successfully!",
           type: "success",
         });
         resetForm();
       })
       .catch(() => {
         setModalInfo({
           show: true,
           message: "Failed to send message. Please try again.",
           type: "error",
         });
       })
       .finally(() => {
         setIsSubmitting(false);
       });
   };
   ```

3. **Modal Component**:
   - Displays messages based on success or error.
   ```javascript
   function Modal({ message, type, onClose }) {
     return (
       <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex justify-content-center align-items-center">
         <div className={`bg-white rounded-3 p-4 text-center shadow ${type === 'success' ? 'border border-primary' : 'border border-danger'}`}>
           <p>{message}</p>
           <button onClick={onClose}>Close</button>
         </div>
       </div>
     );
   }
   ```

### Step 4: Run the Frontend
1. Save the file as `ContactUs.jsx` in your React project.
2. Import it into your application and render it.
3. Run the React app:
   ```bash
   npm start
   ```

---

## API Integration

### Backend Endpoint
- **URL**: `http://localhost:5000/send-message`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "message": "Hello, I have an inquiry."
  }
  ```
- **Response**:
  - Success: `{ "message": "Email sent successfully" }`
  - Error: `{ "error": "Failed to send email" }`

---

## Testing the Feature
1. Start the backend server (`ContactUsBackend.js`).
2. Run the frontend React app.
3. Open the app in your browser.
4. Fill out the form and click "Submit."
5. Check the modal for a success or error message.

---


