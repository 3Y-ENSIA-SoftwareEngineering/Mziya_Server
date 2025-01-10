# Overview

This documentation covers the Job Posting feature for our platform, detailing the frontend and backend implementation for creating and managing job postings.

# Architecture

The job posting feature is implemented using a multi-layered architecture:

- **Frontend**: React component (`PostingPage`)
- **Backend**: Express.js routes, controllers, services, and models
- **Database**: Supabase (PostgreSQL)

# Project Setup and Installation

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Supabase account

## Backend Installation

1. Clone the repository
2. Navigate to backend directory
3. Install dependencies:

```bash
cd backend
npm install

```

1. Create `.env` file with the following configuration:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development

```

## Frontend Installation

1. Navigate to frontend directory
2. Install dependencies:

```bash
cd frontend
npm install

```

1. Create `.env` file:

```
ACT_APP_API_URL=http://localhost:3000/api

```

## Running the Application

### Backend Development Server

```bash
cd backend
npm run dev# Uses nodemon for auto-reloading

```

### Frontend Development Server

```bash
cd frontend
npm start

```

# Frontend Component: PostingPage

## Key Features

- Dynamic, responsive form with comprehensive input handling
- Client-side validation with detailed error messages
- State management using React class component
- Bootstrap and react-datepicker for enhanced UI/UX
- Flexible job posting options with multiple configuration choices

## Form Fields

1. **Job Information**
    - Location: Free-text input with validation
    - Duration: Open or Closed availability type
    - Start and End Dates: Configurable with react-datepicker
    - Job Category: Predefined list of 8 categories
    - Budget: Numeric input with currency icon
    - Job Type/Difficulty: Four levels (small_task, large_task, part_time, full_time)
    - Description: Additional details text input
2. **Worker Requirements**
    - Age Preference: Optional, with minimum age configuration
    - Gender Preference: Female, Male, or Any
    - Additional worker-specific requirements text input

### Validation Strategy

- Comprehensive client-side validation before form submission
- Real-time validation feedback
- Prevents submission of incomplete or incorrect data
- Validation rules:
    - Location: Required, prevents empty submission
    - Job Category: Must select from predefined list
    - Budget: Positive numbers only
    - Dates: Logical date range validation
    - Age: Minimum 18 if age matters

### State Management

- Uses React class component's state
- Tracks form inputs, validation status, and submission state
- Manages complex form interactions
- Handles different job posting scenarios

### UI/UX Considerations

- Responsive design using React Bootstrap
- Dynamic form sections
- Loading state during submission
- Clear error and success messaging
- Intuitive radio button and dropdown interactions

### Performance Optimizations

- Minimal re-renders through careful state management
- Async form submission
- Client-side validation before network request
- Error boundary implementation

### Validation Process

The `validateForm()` method performs comprehensive checks:

- Checks description length (10-500 characters)
- Validates location presence
- Ensures valid job types
- Confirms budget is a positive number
- Validates date ranges
- Enforces age requirements when specified

### Submission Workflow

1. User fills out job posting form
2. `handleSubmit()` method triggered
3. Client-side validation executed
4. Data prepared for submission
5. Fetch API call to backend endpoint
6. Handles success and error scenarios
7. Provides user feedback via alerts

### Technology Stack Details

- React for component-based architecture
- React Bootstrap for responsive design
- react-datepicker for date selection
- react-icons for visual enhancements
- Fetch API for asynchronous communication

## Security Considerations

- Prevents client-side data manipulation
- Validates and sanitizes all inputs
- Uses controlled form inputs
- Implements server-side validation as backup

# Backend Implementation

## Routes (`postjob.route.js`)

- **Endpoint**: `/api/jobs/addjob`
- **HTTP Method**: POST
- **Purpose**: Create a new job posting

### Middleware Pipeline

1. **Input Validation Middleware**: `validateJobInput`
    - Performs comprehensive server-side validation
    - Sanitizes and validates all incoming job data
    - Prevents invalid or malformed job submissions
2. **Request Logging Middleware**
    - Logs timestamp of each job creation request
    - Captures full request body for debugging and audit purposes
    - Provides traceability for each job submission
3. **Controller Method**: `postjob.controller.addJob`
    - Processes validated job data
    - Interacts with database service
    - Handles job creation logic

### Key Implementation Details

- Uses Express Router for modular route handling
- Implements middleware chaining for request processing
- Separates concerns between validation, logging, and job creation
- Provides comprehensive error handling and logging

### Request Flow

1. Client sends POST request to `/api/jobs/addjob`
2. `validateJobInput` middleware validates request
3. Logging middleware captures request details
4. `postjob.controller.addJob` processes the request
5. Database service creates job entry
6. Response sent back to client

### Error Handling Strategies

- Middleware-level validation
- Controller-level error catching
- Detailed error response generation
- Logging of all problematic requests

### Performance and Security Notes

- Lightweight middleware chain
- Minimal overhead in request processing
- Strong input validation
- Prevents unauthorized or malicious job submissions

---

## Controller (`postjob.controller.js`)

The `postjob.controller` is responsible for handling job creation requests in the application. It provides a robust mechanism for validating, processing, and creating job entries with comprehensive error checking and data preparation.

### Method: `addJob`

### Purpose

The `addJob` static method processes incoming job creation requests, performing thorough validation and interfacing with the `JobService` to persist new job entries.

### Request Payload Structure

The method expects a request body with the following key fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `home_owner_id` | String/Number | Yes | Unique identifier of the job creator |
| `description` | String | Yes | Detailed description of the job |
| `location` | String | Yes | Geographic location of the job |
| `job_type` | String | Yes | Classification of the job type |
| `job_category` | Array/String | Yes | Categories associated with the job |
| `budget` | Number | Yes | Monetary budget for the job |
| `status` | String | Yes | Current status of the job |
| `availability_type` | String | Yes | Type of job availability |
| `start_date` | Date | Optional | Proposed start date for the job |
| `end_date` | Date | Optional | Proposed end date for the job |
| `age_matters` | Boolean | Optional | Indicates if age restrictions apply |
| `age_min` | Number | Conditional | Minimum age requirement (if `age_matters` is true) |
| `age_max` | Number | Conditional | Maximum age requirement (if `age_matters` is true) |
| `required_gender` | String | Optional | Gender preference for job applicants |
| `additional_details` | String | Optional | Extra information about the job |

### Validation Process

The controller performs extensive input validation:

- Mandatory Field Checks
    - Checks the presence of critical fields:
        - `home_owner_id`
        - `description`
        - `location`
        - `job_type`
        - `job_category`
        - `budget`
        - `status`
        - `availability_type`
- Type and Format Validations
    - Validates `age_matters` as a boolean
    - Ensures `job_category` is not an empty array/list

### Error Handling

- Comprehensive error collection mechanism
- Returns detailed validation errors if input is invalid
- Provides a 400 Bad Request response with specific error messages

### Success Flow

1. Validates incoming request payload
2. Prepares job data object
3. Automatically sets `created_at` and `updated_at` timestamps
4. Calls `JobService.create()` to persist the job
5. Returns a 201 Created response with the new job details

### Error Handling

- Catches and logs comprehensive error information
- In production, returns generic error message
- In non-production environments, returns detailed error message
- Logs full error stack trace for debugging

### Logging

- Logs incoming job creation request payload
- Logs complete error details for troubleshooting

### Environment Considerations

- Provides different error reporting based on `NODE_ENV`
    - Development: Detailed error messages
    - Production: Generic error response

### Dependencies

- Requires `JobService` from `'../services/jobService.js'`
- Uses Node.js `Date` for timestamp generation

---

## Service Layer (`jobService.js`)

The `JobService` class serves as an abstraction layer for job-related database operations, providing a clean interface between the controller and the database model. It encapsulates the logic for creating and managing job entries.

### Dependencies

- Requires `Job` model from `'../models/Job.js'`

### Method: `create`

### Purpose

The `create` static method handles the creation of a new job entry in the database, providing a standardized approach to job insertion with error handling.

### Functionality

- Attempts to create a new job record in the database
- Uses Sequelize/ORM `create` method for database insertion
- Handles potential database insertion errors

### Error Handling

- Catches and logs any errors during job creation
- Throws a generic error to prevent exposure of sensitive database details
- Logs the specific error message for internal debugging

### Logging

- Logs detailed error information using `console.error`
- Provides a standardized error message for external consumption

---

## Model (`Job.js`)

The `Job` model interacts directly with the Supabase database to manage job-related operations. It provides a streamlined interface for creating job records while handling data mapping and error tracking comprehensively.

### Key Responsibilities:

1. **Database Interaction**:
    - Utilizes Supabase client to perform database operations.
    - Inserts job records into the `job` table, ensuring consistency with the database schema.
2. **Data Mapping**:
    - Maps incoming data to ensure it aligns with the schema requirements of the `job` table.
    - Automatically populates `created_at` and `updated_at` fields with timestamps.
3. **Error Handling**:
    - Tracks and logs detailed error messages for debugging, including error codes, hints, and full JSON error objects.
    - Throws meaningful exceptions when insertion fails or when no data is returned.
4. **Logging**:
    - Logs the exact data being inserted for traceability and debugging purposes.
    - Captures comprehensive error logs, including stack traces and full error details.

### Method Summary:

### `Job.create(jobData)`

- **Purpose**: Inserts a new job record into the `job` table in the Supabase database.
- **Parameters**:
    - `jobData` (Object): The job details to insert, including all required fields according to the database schema.
- **Returns**:
    - The inserted job record as an object, if successful.
- **Error Handling**:
    - Logs and throws detailed errors when:
        - Supabase returns an error.
        - No data is returned after insertion.

**Implementation Highlights**:

- Ensures data consistency with the Supabase schema by spreading `jobData` and adding timestamps.
- Uses `JSON.stringify` for detailed error logging to aid debugging and analysis.
- Selects and returns the inserted data for confirmation.

---

## Validation Middleware (`validateJobInput.js`)

### Validation Scope

Comprehensive input validation covering:

- Job description
- Location
- Job type and category
- Budget
- Job status
- Availability type
- Date ranges
- Age requirements
- Gender preferences
- Additional details

### Validation Constraints

1. **Description**
    - Length: 10-500 characters
    - Trims whitespace
    - Prevents overly short or excessively long descriptions
2. **Location**
    - Required field
    - Length: 2-100 characters
    - Prevents empty or extremely short locations
3. **Job Type**
    - Predefined options:
        - `small_task`
        - `large_task`
        - `part_time`
        - `full_time`
    - Strict enumeration prevents invalid job types
4. **Job Category**
    - Fixed list of categories:
        - Babysitting
        - Child Care
        - Plumbing
        - Gardening
        - Painting
        - Electrical
        - Cleaning
        - Private Tutor
5. **Budget**
    - Non-negative numbers only
    - Allows flexible pricing, including zero-cost jobs
    - Prevents negative budget entries
6. **Date Validation**
    - ISO8601 date format
    - Optional start and end dates
    - End date must be later than start date
    - Converts dates to JavaScript Date objects
7. **Age Requirements**
    - Optional age constraints
    - Minimum age: 18
    - Maximum age: 75
    - Ensures logical age range
    - Validates minimum and maximum age relationship
8. **Gender Preferences**
    - Options:
        - `any`
        - `male`
        - `female`
    - Required field
    - Prevents invalid gender specifications
9. **Additional Details**
    - Optional field
    - Maximum length: 1000 characters
    - Allows supplementary job information

### Error Handling

- Detailed validation error messages
- 400 Bad Request for validation failures
- Returns array of specific validation errors
- Prevents processing of invalid job submissions

### Performance Considerations

- Lightweight middleware
- Minimal processing overhead
- Uses express-validator for efficient validation
- Fail-fast validation approach

---

# Error Handling

- Client-side validation
- Server-side validation middleware
- Comprehensive error logging
- Informative error responses

---

# Technologies Used

- Frontend: React, React Bootstrap
- Backend: Express.js
- Validation: express-validator
- Database: Supabase
- Date Handling: react-datepicker

---

# Security Considerations

- Input sanitization
- Server-side validation
- Preventing data injection
- Protecting against malformed requests

---

# Performance Optimization

- Minimal state updates
- Efficient form validation
- Async request handling
- Error boundary implementation

---

# Troubleshooting

- Check network tab for API errors
- Verify Supabase connection
- Review validation middleware logs
- Ensure environment variables are set

---

# Sample Workflow

1. User fills out job posting form
2. Client-side validation triggers
3. Data sent to `/api/jobs/addjob`
4. Server validates input
5. Job created in Supabase
6. Success or error response returned

---

# Common Errors

- Invalid date ranges
- Budget not a number
- Missing required fields
- Network connectivity issues