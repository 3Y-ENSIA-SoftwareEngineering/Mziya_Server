Table of Contents:

1.  Introduction
2.  Installation
3.  Test Structure
4.  Test Tools and Libraries
5.  Writing Tests
6.  Running Tests
7.  Test Coverage

1/ Introduction:
This document provides the necessary steps and test cases for the Mzya project,
a React-based application. It covers the testing of various components within the
project, ensuring that each part functions correctly. The components include
forms, user interactions, and dynamic elements across the application, such as
user registration, service postings, and notifications. The testing focuses on
rendering, validation, and functional behaviors, ensuring the robustness and
reliability of the application.

2/ Installation:

1.  Install Node.js and npm/yarn
2.  Install Testing Libraries
    1.React Testing Library: For rendering React components in a test
    environment.
    npm install @testing-library/react
    2.Jest: The test runner and assertion library.
    npm install jest
    3.React Router (for routing support in tests):
    npm install react-router-dom
    4.@testing-library/user-event: For simulating user interactions like clicks and text entry.
    npm install @testing-library/user-event
    5.Jest DOM: To extend Jest with DOM-specific matchers.
    npm install @testing-library/jest-dom
    6.Mock Service Worker (optional for mocking backend requests):
    npm install --save-dev jest-fetch-mock

3/ Test Structure:

The structure of the tests within the frontend code follows a clear, modular
approach. Below are the key sections:

••• Component Tests: Component tests verify that individual React components render correctly and behave as expected when interacting with them (e.g., user
input, button clicks).
What is tested:
• Rendering of elements (buttons, text, input fields, etc.).
• Event handling (clicks, text entry, etc.).
• Dynamic content based on props or state

••• Unit Tests:Unit tests target individual pieces of functionality, such as methods or small, isolated functions. Unit tests make sure that each function or
method behaves as expected in various situations.
What is tested:
• Functions or methods, like validation or transformation logic.
• Business logic in components (like input validation or calculations).

••• Integration Tests: Integration tests verify that multiple components or pieces of the application work together. They test how different parts of the system
interact, such as how a form submission sends data to an API.

••• Mocking API Requests: Mocking backend API responses during tests to simulate different scenarios

4/ Key Test Methods:
1.render():
Purpose: This function is used to render a React component into a virtual
DOM for testing.
Usage: For example, render(<SignUp />) is used to render the SignUp
component and test its behavior.

2.fireEvent:
Purpose: This is used to simulate events like clicks, form submissions, or
text input to test user interactions.
Usage: For example, fireEvent.click(button) simulates a user clicking a
button, and fireEvent.change(input, { target: { value: 'text' } }) simulates
typing into an input field.

3.screen:
Purpose: The screen object is an alternative to directly using getByTestId or
other query methods. It provides functions to find elements in the rendered
component, making tests more readable.
Usage: screen.getByText('some text') searches for an element containing
the provided text.

4.expect():
Purpose: This is the core assertion function in Jest. It is used to verify if the
actual output matches the expected output.
Usage: For example, expect(button).toBeInTheDocument() checks if the
button is rendered in the DOM.

5.jest.fn():
Purpose: This is used to mock functions so you can track if they were
called, how many times, and with what arguments.
Usage: For example, const mockPostDataToBackend = jest.fn() creates a
mock function to simulate an API call in the tests

6.toBeInTheDocument():
Purpose: A matcher provided by Jest DOM that checks if a particular
element is present in the DOM.
Usage: expect(input).toBeInTheDocument() checks if the input field is
rendered in the DOM.

5/ Test tools and libraries:

- Jest: A JavaScript testing framework for unit and integration tests.
- React Testing Library: A library for testing React components.

6/ Writing Tests:
1.Unit Tests:
describe("ContactUs Component", () => {
test("renders the form fields correctly", () => {
render(<ContactUs />);
// Check for form fields
expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDoc
expect(screen.getByPlaceholderText(/Surname/i)).toBeInThe
expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDo
expect(screen.getByPlaceholderText(/Your message/i)).toBe
expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});
});
2.Integration Tests

7/ Running Tests:
Instructions on how to run the tests using npm or yarn scripts.
//access the FrontEnd directory
cd FrontEnd
//run the command
npm test

For cypress :
npx cypress open

8/ Test Coverage:
npm test -- --coverage

# or

yarn test --coverage
