Job Controller Test Suite Documentation

### **Tests Overview:**

This suite contains comprehensive tests for the get job controller, focusing on various routes and scenarios. Tests are divided into two main groups: normal functionality and scenarios requiring a mocked empty database or database errors.

---

### **Test 1: Fetch All Jobs (Success Case)**

- **Route**: `GET /jobs`
- **Description**: Fetches all jobs from the database.
- **Expected Outcome**:
    - Status code: `200 OK`
    - Response body contains a `status` of `success`
    - The `data` field is an array (list of jobs).

### **Test 2: Fetch Jobs by Valid Category**

- **Route**: `GET /jobs/category/:category`
- **Description**: Fetches jobs by the specified category.
- **Example Category**: `'Painting'`
- **Expected Outcome**:
    - Status code: `200 OK`
    - The `category` field in the response matches the requested category.
    - The `data` field is an array containing jobs in the specified category.

### **Test 3: Category Not Found**

- **Route**: `GET /jobs/category/:category`
- **Description**: Fetches jobs for an invalid category that doesn't exist in the database.
- **Example Category**: `'NonExistentCategory'`
- **Expected Outcome**:
    - Status code: `500 Internal Server Error`
    - The system handles the invalid category and returns an error message.

### **Test 4: Missing Category Parameter**

- **Route**: `GET /jobs/category/`
- **Description**: Attempts to access the route with a missing category parameter.
- **Expected Outcome**:
    - Status code: `404 Not Found`
    - Express default behavior should handle this.

### **Test 5: Fetch Jobs Sorted by Price (Highest to Lowest)**

- **Route**: `GET /jobs/best-price`
- **Description**: Fetches jobs sorted by price in descending order.
- **Expected Outcome**:
    - Status code: `200 OK`
    - Response body contains a description of "Jobs sorted from highest to lowest price".
    - The `data` field is an array where jobs are sorted by price, with the highest budget first.

---

### **Mocked Empty Database & Error Simulation Tests:**

### **Test 1: No Jobs Available (Mocked Empty Database)**

- **Route**: `GET /jobs`
- **Description**: Simulates an empty database scenario.
- **Expected Outcome**:
    - Status code: `500 Internal Server Error`
    - Response body should indicate a failure to fetch jobs due to no available data.

### **Test 2: Database Error Simulation**

- **Route**: `GET /jobs`
- **Description**: Simulates a database connection error.
- **Expected Outcome**:
    - Status code: `500 Internal Server Error`
    - Response body should indicate an error with the message "Internal server error".

### **Test 3: No Jobs in Database for Price Sort**

- **Route**: `GET /jobs/best-price`
- **Description**: Simulates an empty database scenario while fetching jobs sorted by price.
- **Expected Outcome**:
    - Status code: `500 Internal Server Error`
    - Response body should indicate a failure due to no available data.

### **Test 4: Invalid Route Access**

- **Route**: `GET /jobs/non-existent-route`
- **Description**: Tests an invalid route access.
- **Expected Outcome**:
    - Status code: `404 Not Found`
    - Express default behavior should handle this.

---

### **Test Execution Steps:**

1. **Setting Up Express App**:
    - The `express` server is set up with the necessary middleware (`json` and routing) to handle job-related routes.
2. **Mocking Database**:
    - The `createClient` function from the Supabase library is mocked using `jest.mock()` for scenarios requiring empty database responses or simulating errors.
3. **Test Cases Execution**:
    - **Supertest** is used to simulate HTTP requests and check the responses. Each test sends a request to the corresponding route and verifies the expected status code, response body, and conditions (e.g., data array, category matches, price sorting).
4. **Clean-up**:
    - The `beforeEach()` hook is used to clear mocks before each test to ensure tests do not interfere with each other.