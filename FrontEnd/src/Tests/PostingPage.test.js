import React from 'react';
import { PostingPage } from '../screens/PostingPage';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup,waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
//import { mockApiCall } from'/Users/afnanekaraoui/softwareProject/Mziya_Server/BackEnd/src/controllers/postJob.controller.js' ; 

import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
global.fetch = jest.fn();
beforeAll(() => {
  // Mock the sessionStorage and set a fake authToken
  global.sessionStorage.setItem("authToken", "fake_token");
});

afterAll(() => {
  // Clean up after tests
  global.sessionStorage.removeItem("authToken");
});
describe('PostingPage UI rendering tests', () => {

  afterEach(() => {
    cleanup();
  });

  test('renders the full PostingPage UI correctly', () => {
    render(
      <BrowserRouter>
        <PostingPage />
      </BrowserRouter>
    );

    // Check for static fields that should always be rendered using data-testid
    expect(screen.getByTestId("locationID")).toBeInTheDocument();
    expect(screen.getByTestId("Budget")).toBeInTheDocument();
    expect(screen.getByTestId("Difficulty")).toBeInTheDocument();
    expect(screen.getByTestId('durationRadio')).toBeInTheDocument(); // "Duration" radio buttons
    expect(screen.getByTestId('otherDetails')).toBeInTheDocument();
    // Check if the "Open" and "Closed" radio buttons are present using data-testid
    expect(screen.getByTestId('openRadio')).toBeInTheDocument();
    expect(screen.getByTestId('closedRadio')).toBeInTheDocument();

    //Initially , the start date and starting time are shown 
    expect(screen.queryByTestId("startDate")).not.toBeInTheDocument();
    expect(screen.queryByTestId("startTime")).not.toBeInTheDocument();
    
    // Initially, check that the startDate and EndDate are not rendered
    expect(screen.queryByTestId("EndTime")).not.toBeInTheDocument();
    expect(screen.queryByTestId("EndDate")).not.toBeInTheDocument();
  });
  test('renders startDate and endDate when "closed" radio button is selected', () => {
    render(
      <BrowserRouter>
        <PostingPage />
      </BrowserRouter>
    );

    // Simulate selecting the "Open" radio button
    fireEvent.click(screen.getByTestId('closedRadio'));

    // After selecting "Open", check that the startDate and endDate fields appear
    expect(screen.getByTestId("startDate")).toBeInTheDocument();
    expect(screen.queryByTestId("EndTime")).toBeInTheDocument();
    expect(screen.getByTestId("EndDate")).toBeInTheDocument();
    expect(screen.getByTestId("startTime")).toBeInTheDocument();
  });
  test('does not render endTime and endDate when "open" radio button is selected', () => {
    render(
      <BrowserRouter>
        <PostingPage />
      </BrowserRouter>
    );

    // Simulate selecting the "Closed" radio button
    fireEvent.click(screen.getByTestId('openRadio'));

    // After selecting "Closed", check that the startDate and endDate fields are not rendered
    expect(screen.queryByTestId("EndTime")).not.toBeInTheDocument();
    expect(screen.queryByTestId("EndDate")).not.toBeInTheDocument();
  });
  test('renders category select dropdown and selects a category', () => {
   
    render(
      <BrowserRouter>
        <PostingPage />
      </BrowserRouter>
    );
  
    // Check if the category select field is rendered
    expect(screen.getByText('Select Category')).toBeInTheDocument();
    expect(screen.getByTestId('categorySelect')).toBeInTheDocument();  // Assuming you added a testId="categorySelect" for the <Form.Select>
  
    // Check if the "Select a Category" option is present
    expect(screen.getByText('Select a Category')).toBeInTheDocument();
  
    // Simulate selecting a category
    fireEvent.change(screen.getByTestId('categorySelect'), { target: { value: 'Cleaning' } });

  });
  test('renders Worker Information and toggles minimum age input based on "Required" radio button', () => {
    
    render(
      <BrowserRouter>
        <PostingPage />
      </BrowserRouter>
    );
  
    // Check if the Worker Information title is rendered
    expect(screen.getByText('Worker Information')).toBeInTheDocument();
  
    // Check if both radio buttons for "Required" and "Doesn't matter" are rendered
    expect(screen.getByTestId("ageRequiredRadio")).toBeInTheDocument();
    expect(screen.getByTestId("ageDoesntMatterRadio")).toBeInTheDocument();
  
    // Check that the minimum age input is NOT rendered initially
    expect(screen.queryByTestId("ageMinInput")).not.toBeInTheDocument();
  
    // Simulate selecting the "Required" radio button
    fireEvent.click(screen.getByTestId("ageRequiredRadio"));
  
    // After selecting "Required", check if the minimum age input is rendered
    expect(screen.getByTestId("ageMinInput")).toBeInTheDocument();
  
    // Simulate selecting the "Doesn't matter" radio button
    fireEvent.click(screen.getByTestId("ageDoesntMatterRadio"));
  
    // After selecting "Doesn't matter", check that the minimum age input is NOT rendered
    expect(screen.queryByTestId("ageMinInput")).not.toBeInTheDocument();
  
  });
 it("selects the gender correctly", () => {
        render(
          <BrowserRouter>
            <PostingPage/>
          </BrowserRouter>
        );
    
        // Find the 'Female' and 'Male' radio buttons by their ID
        const femaleRadioButton = screen.getByTestId('female-radio');
        const maleRadioButton = screen.getByTestId('male-radio');
        const DMRadioButton = screen.getByTestId("genderDM");
        // Select the 'Female' radio button
        fireEvent.click(femaleRadioButton);
        expect(femaleRadioButton).toBeChecked();
        expect(maleRadioButton).not.toBeChecked();
        expect(DMRadioButton).not.toBeChecked();
        // Select the 'Male' radio button
        fireEvent.click(maleRadioButton);
        expect(maleRadioButton).toBeChecked();
        expect(femaleRadioButton).not.toBeChecked();
        expect(DMRadioButton).not.toBeChecked();

        fireEvent.click(DMRadioButton);
        expect(DMRadioButton).toBeChecked();
        expect(maleRadioButton).not.toBeChecked();
        expect(femaleRadioButton).not.toBeChecked();
    });
  test('checks all other dynamic elements are rendered correctly', () => {
    render(
      <BrowserRouter>
        <PostingPage />
      </BrowserRouter>
    );

    // Check for other dynamic fields by their data-testid
    // Example: Check for a "Submit" button (if available)
    const submitButton = screen.getByTestId('submitButton'); // Assuming the submit button has data-testid="submitButton"
    expect(submitButton).toBeInTheDocument();

    // Additional UI elements like modals, dropdowns, etc., can be checked here if needed.
  });

  // test('form submission triggers API call', async () => {
    
  //   //mocking the api 
  //   jest.mock('./../BackEnd/src/controllers/postJob.controller.js', () => ({
  //       mockApiCall: jest.fn(),
  //       }));

  //   //mocking the database 
  //   jest.mock('./../BackEnd/src/config/database.js', () => ({
  //       from: jest.fn(() => ({
  //         select: jest.fn(() => ({
  //           eq: jest.fn(() => ({
  //             single: jest.fn(() => ({
  //               data: { user_id: '123' }, // Simulate a valid response
  //               error: null,
  //             })),
  //           })),
  //         })),
  //       })),
  //     }));
  //   // Render component
  //   render(
  //     <BrowserRouter>
  //       <PostingPage />
  //     </BrowserRouter>
  //   );
    
  //   // Fill out form fields (e.g., category)
  //   fireEvent.change(screen.getByTestId('categorySelect'), { target: { value: 'Cleaning' } });
    
  //   // Submit the form
  //   fireEvent.click(screen.getByTestId('submitButton'));
    
  //   // Mock the API call and verify it's triggered
  //   await waitFor(() => expect(mockApiCall).toHaveBeenCalledTimes(1));
  // });
  test('updates input fields on user typing', () => {
    render(
      <BrowserRouter>
        <PostingPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId('ageRequiredRadio'));
    // Fill out the age input field
    fireEvent.change(screen.getByTestId('ageMinInput'), { target: { value: '25' } });
    
    // Ensure the state or value is updated correctly
    expect(screen.getByTestId('ageMinInput').value).toBe('25');
  });


  //todo: input handling 
  test('updates the state when input changes', () => {

    render(
      <BrowserRouter>
      <PostingPage/>
      </BrowserRouter>
    )
    //?:location 
        const input = screen.getByTestId("locationID"); // Replace with the appropriate label text for your input
        // Simulate user typing
        fireEvent.change(input, { target: { value: "10" } });
        // Check if the input value has been updated
        expect(input.value).toBe('10');


    //? Duration 
    //! open duration 
          fireEvent.click(screen.getByTestId('openRadio'));

          /**Starting date  */
          const datePickerInput = screen.getByPlaceholderText('Select a starting date');
           // Simulate selecting a date by setting a new value on the DatePicker input
            fireEvent.change(datePickerInput, { target: { value: '10/10/2025' } });  
           // Check if the value was updated correctly
             expect(datePickerInput).toHaveValue('10/10/2025');
           

          /**Starting time */
          const startTimeInput = screen.getByTestId('startTime');
           // Simulate changing the time value
          fireEvent.change(startTimeInput, { target: { value: '12:30' } });
           // Check if the value is updated correctly
          expect(startTimeInput.value).toBe('12:30');

    //! closed duration 
          fireEvent.click(screen.getByTestId('closedRadio'));
          /**Ending date  */
          const datePickerInputEnd = screen.getByPlaceholderText('Select an ending date');
          // Simulate selecting a date by setting a new value on the DatePicker input
          fireEvent.change(datePickerInputEnd, { target: { value: '10/10/2025' } });  
          // Check if the value was updated correctly
            expect(datePickerInputEnd).toHaveValue('10/10/2025');
          /**Starting time */
          const endTimeInput = screen.getByTestId('EndTime');
           // Simulate changing the time value
          fireEvent.change(endTimeInput, { target: { value: '12:30' } });
           // Check if the value is updated correctly
          expect(endTimeInput.value).toBe('12:30');

    //? Category :
      const categorySelect = screen.getByTestId('categorySelect');
      // Simulate selecting a category
      fireEvent.change(categorySelect, { target: { value:'Cleaning'} });
      // Check if the selected value is updated correctly
      expect(categorySelect.value).toBe('Cleaning');

    //? budget: 

      const budgetInput = screen.getByTestId('Budget');

      // Simulate typing a budget value (e.g., "100.50")
      fireEvent.change(budgetInput, { target: { value: '100.50' } });

      // Check if the value is updated correctly
      expect(budgetInput.value).toBe('100.50');
    //? Difficulty: 
    const difficultySelect = screen.getByTestId('Difficulty');
    // Simulate selecting a difficulty using userEvent
    fireEvent.change(difficultySelect, { target: { value:'large_task'} });  
    // Check if the selected value is updated correctly
     expect(difficultySelect.value).toBe('large_task');



    //? other details :
    const otherDetailsInput = screen.getByTestId('otherDetails');

    // Simulate typing a description
    fireEvent.change(otherDetailsInput, { target: { value: 'Some additional details.' } });
  
    // Check if the value is updated correctly
    expect(otherDetailsInput.value).toBe('Some additional details.');


    //? age : 

      const ageRequiredRadio = screen.getByTestId('ageRequiredRadio');
      const ageDoesntMatterRadio = screen.getByTestId('ageDoesntMatterRadio');
      const ageMinInput=screen.queryByTestId('ageMinInput');
      
    // Select the "Required" radio button
      fireEvent.click(ageRequiredRadio);
      const visibleAgeMinInput = screen.getByTestId('ageMinInput');
      // Check if the state was updated correctly (age_matters should be true)
      expect(ageRequiredRadio.checked).toBe(true);
      expect(ageDoesntMatterRadio.checked).toBe(false);
      expect(visibleAgeMinInput).toBeInTheDocument();
      // Simulate typing a value in the "age_min" input
      fireEvent.change(visibleAgeMinInput, { target: { value: '25' } });
    
      // Check if the value of the input has been updated
      expect(visibleAgeMinInput.value).toBe('25');
    // Select the "Doesn't matter" radio button
      fireEvent.click(ageDoesntMatterRadio);

      // Check if the state was updated correctly (age_matters should be false)
      expect(ageRequiredRadio.checked).toBe(false);
      expect(ageDoesntMatterRadio.checked).toBe(true);
      expect(ageMinInput).toBeNull();
    //? gender 

  const femaleRadio = screen.getByTestId('female-radio');
  const maleRadio = screen.getByTestId('male-radio');
  const genderDMRadio = screen.getByTestId('genderDM');

  // Initially, no radio button should be selected
  expect(femaleRadio.checked).toBe(false);
  expect(maleRadio.checked).toBe(false);
  expect(genderDMRadio.checked).toBe(false);

  // Select the "Female" radio button
  fireEvent.click(femaleRadio);
  expect(femaleRadio.checked).toBe(true);
  expect(maleRadio.checked).toBe(false);
  expect(genderDMRadio.checked).toBe(false);

  // Select the "Male" radio button
  fireEvent.click(maleRadio);
  expect(femaleRadio.checked).toBe(false);
  expect(maleRadio.checked).toBe(true);
  expect(genderDMRadio.checked).toBe(false);

  // Select the "Doesn't matter" radio button
  fireEvent.click(genderDMRadio);
  expect(femaleRadio.checked).toBe(false);
  expect(maleRadio.checked).toBe(false);
  expect(genderDMRadio.checked).toBe(true);
  //? details 
  const otherDetails = screen.getByPlaceholderText('Enter any additional requirements or specifications');

  // Initially, the value should be empty
  expect(otherDetails.value).toBe('');


  //////
  //
  // Simulate typing into the input field
  fireEvent.change(otherDetails, { target: { value: 'Some additional requirements' } });

  // Check if the value has been updated
  expect(otherDetails.value).toBe('Some additional requirements');
    });
  //todo: API related test 

  jest.mock('jwt-decode', () => jest.fn().mockReturnValue({ user_id: 2 }));

  beforeAll(() => {
    // Mock sessionStorage to have a fake token
    global.sessionStorage.setItem("authToken", "fake_token");
  });
  
  afterAll(() => {
    // Clean up sessionStorage after tests
    global.sessionStorage.removeItem("authToken");
  });
  
  // Mock the fetch API response
  const mockResponse = {
    data: 'success', // Mock success response from backend
  };
  
  test('sends correct data to the backend when all fields are filled', async () => {
    // Mock fetch to return the mockResponse
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
  
    // Render the form
    render(<BrowserRouter><PostingPage /></BrowserRouter>);
  
    // Fill out the form
    fireEvent.change(screen.getByTestId('locationID'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByTestId('openRadio'));
    fireEvent.change(screen.getByTestId('female-radio'), { target: { value: 'female' } });
    fireEvent.change(screen.getByTestId('startTime'), { target: { value: '14:00' } });
    fireEvent.change(screen.getByTestId('Budget'), { target: { value: '100' } });
    fireEvent.change(screen.getByTestId('Difficulty'), { target: { value: 'small_task' } });
    fireEvent.change(screen.getByTestId('categorySelect'), { target: { value: 'Plumbing' } });
    fireEvent.change(screen.getByTestId('otherDetails'), { target: { value: 'Requires a plumber' } });
    fireEvent.click(screen.getByTestId('ageDoesntMatterRadio'));
    fireEvent.change(screen.getByTestId('req'), { target: { value: 'Requires a plumber' } });
  
    // Submit the form
    fireEvent.click(screen.getByTestId('submitButton'));
  
    // Wait for the API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  
    // Check that the fetch was called with the correct data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/jobs/addjob',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake_token', // Assuming the token is passed correctly
          },
          body: JSON.stringify({
            home_owner_id: 2,  // Mocked user_id from jwtDecode
            description: 'Requires a plumber',
            location: 'New York',
            job_type: 'small_task',
            job_category: 'Plumbing',
            budget: 100,
            status: 'pending',
            availability_type: 'open',
            start_date: '2025-12-13',
            end_date: '2025-12-14',
            age_matters: false,
            age_min: null,
            age_max: null,
            required_gender: 'female',
            additional_details: 'Requires a plumber',
          }),
        })
      );
    });
  
    // You can log the response to check in the test logs
    await waitFor(() => {
      console.log('Received mock response:', mockResponse);
    });
  

  });


});
