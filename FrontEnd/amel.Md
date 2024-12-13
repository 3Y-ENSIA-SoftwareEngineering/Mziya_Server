This documentation provides a guide to setting up, running, and understanding the structure of the React application. It covers the main features, component architecture and description.

1/Application Features:

1. Routing:
   The application uses react-router-dom to define routes for different pages. The main routes are:
   /: The landing page with sections like MainContent, Service, WhyChooseUs, and more.
   /login: The login page for user authentication.
   /signup: The signup page for creating new user accounts.
   /findjob: A job search page where users can browse available job listings.
   /makepost: A page for posting job opportunities.
   /profile: Displays user profiles.
   /contact: A contact form for user inquiries.

2. Components:
   The application is structured with reusable components for modularity and scalability. Key components include:
   Common Components:
   Header: Provides navigation across the application.
   FooterUp & FooterDown: Display footer information in two parts.
   Navbar: Used for additional navigation in specific pages.

Landing Page Components:

MainContent: Highlights the primary purpose of the application.
Service: Lists available services.
WhyChooseUs: Outlines the unique features of the platform.
HowItWorks: Explains the workflow for users.
ContactUs: A form for user inquiries.

Specialized Components:
Login: Handles user authentication with validation and API integration.
SignUp: Provides a form for account creation.
FindJob: Displays job listings fetched from a backend API.
PostingPage: Allows users to post job opportunities.
Profile: Displays user-specific details and activities.
JobCard: Represents individual job postings in the FindJob page.

2/ Folder Structure:
├── src
│ ├── Components
│ │ ├── Header.jsx
│ │ ├── FooterUp.jsx
│ │ ├── FooterDown.jsx
│ │ ├── Service.jsx
│ │ ├── WhyChooseUs.jsx
│ │ ├── HowItWorks.jsx
│ │ ├── ContactUs.jsx
│ │ ├── JobCard.jsx
│ │ ├── NavBar.jsx
│ │ └── PostingPage.jsx
│ ├── screens
│ │ ├── Login.jsx
│ │ ├── SignUp.jsx
│ │ └── FindJob.jsx
│ ├── App.css
│ ├── App.js
│ └── index.js
├── package.json
└── README.md
3/ Installation and Setup
Prerequisites:
Ensure you have the following installed:
Node.js (v16 or higher) and npm.
Git (optional, if cloning from a repository).

Steps to Run:
1/ Clone the Repository:
git clone <https://github.com/3Y-ENSIA-SoftwareEngineering/Mziya_Server>
cd <repository-folder>
2/ Install Dependencies:
npm install
Dependencies:
Core: npm install react react-dom react-router-dom
Styling:
npm install bootstrap react-bootstrap
npm install react-icons
npm install react-datepicker
API Requests: npm install axios
Dependency Errors: Clean cache and reinstall:
npm cache clean --force
rm -rf node_modules
npm install

3/ Run the Development Server
cd FrontEnd
npm start

4/ Component Descriptions

1. App.js
   Entry point of the application.
   Defines the router and routes for different pages.
   Includes common components like Header and Footer.
2. Login.jsx
   Implements user login functionality.
   Features form validation and backend API integration.
   Handles authentication errors and redirects on successful login.

Functions:

1. validate()
   validates the formData object to ensure that both the email and password fields are correctly filled out.
   Checks if the email field is empty or invalid using a regular expression (\S+@\S+\.\S+).
   Ensures the password field is not empty and has at least 6 characters.
   Updates the errors state with error messages for any validation issues.
   Returns:
   true if the validation passes (no errors).
   false if there are errors.
   State Updated:
   errors: An object with error messages for invalid fields.
2. handleChange(e)
   Handles updates to form inputs and dynamically updates the formData state.
   Parameters:
   e: The event object representing the input change.
   Logic:
   Extracts the name and value of the changed input field.
   Updates the corresponding field in formData using the spread operator.
   State Updated:
   formData: An object containing updated form input values.

3. handleSubmit(e)
   Manages the form submission process, including validation, API requests, and error handling.
   Parameters:
   e: The event object representing the form submission.
   Logic:
   Prevents the default form submission behavior.
   Calls validate() to check form inputs. If validation fails, it exits early.
   Sends an asynchronous POST request to the backend with formData.
   Handles successful login by:
   Storing the authentication token in localStorage.
   Redirecting the user to the /dashboard page using useNavigate.
   Updates serverError with an error message if the API request fails.
   State Updated:
   isLoading: Indicates whether the form submission is in progress.
   serverError: Contains error messages from the server, if any.
   Asynchronous Process:
   Uses the fetch API to send a POST request to the backend.

4. React State Variables
   formData:
   Stores the email and password values entered by the user.
   Initial Value: { email: "", password: "" }
   errors:
   Stores error messages for invalid inputs.
   Initial Value: {}
   isLoading:
   Tracks whether the form is being submitted.
   Initial Value: false
   serverError:
   Stores server-side error messages.
   Initial Value: null

5. FindJob.jsx
   Fetches and displays job listings from a backend API.
   Includes filtering options (e.g., category, proximity, price, rating).
   Responsive layout with a sidebar for filters and a content area for job listings.
   Functions:
6. useEffect()
   Fetches job data from the backend API when the component is mounted.
   Logic:
   Makes an asynchronous request to the backend (https://your-backend-api.com/jobs) to fetch a list of jobs.
   If the request is successful, updates the jobs state with the fetched data.
   If the request fails, logs an error message in the console.
   State Updated:
   jobs: Contains the list of jobs fetched from the backend.
7. handleSelect(option)
   Purpose: Updates the selectedOption state when a sorting option is selected.
   Parameters:
   option: A string representing the selected sorting option (e.g., "Category", "Closest Jobs").
   Logic:
   Sets the selectedOption state to the selected option.
   Logs the selected option to the console.
   State Updated:
   selectedOption: Contains the current sorting option selected by the user.
   React State Variables:
8. jobs
   Purpose: Stores the list of job data fetched from the backend.
   Initial Value: [] (Empty array).
   Usage: This variable is used to render the job cards on the page.
9. setJobs
   Purpose: A function used to update the jobs state with the fetched job data.
10. selectedOption
    Purpose: Tracks the selected sorting option.
    Initial Value: null (No option selected initially).
    Usage: This state is used to keep track of the sorting option that the user selects (e.g., "Category", "Closest Jobs").
11. setSelectedOption
    Purpose: A function used to update the selectedOption state whenever a sorting option is selected.

12. SignUp.jsx
    Provides a form for user registration.
    Includes input validation and backend integration for account creation.
13. Profile.jsx
    Displays user-specific details and activities.
    Includes sections for profile information and job-related actions.
14. PostingPage.jsx
    Allows users to post job opportunities by submitting a form.
15. ContactUs.jsx
    A contact form for user inquiries.
    Includes form validation.
16. Reusable Components
    Header & Footer: Navigation and informational sections shared across all pages.
    Navbar: Provides contextual navigation on certain pages.
    JobCard: Represents individual job listings in a standardized format.
