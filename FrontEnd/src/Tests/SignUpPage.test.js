import React from 'react';
//Step 1: Import the SignUp from the SignUpPage
import { SignUp } from "../screens/SignUpPage";
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import {waitFor } from '@testing-library/react';
afterEach(cleanup);
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
global.fetch = jest.fn();
beforeEach(() => {
  fetch.mockClear();
});
//! start the test using describe 
  //describe: is used to start the test , basically we are describing the component 
describe(SignUp,()=>{
    //all individual tests of the components will be defined in here 
   

    //todo: check that the input fields , buttons , gender radio buttons render 
    it("renders all input fields correctly ",()=>{
        //simulate the component for testing 
        const {getByTestId}=render(
            //wrap the signup by the browserRoute because in the code we use the route to navigate 
            <BrowserRouter>
            <SignUp/>
            </BrowserRouter>
        )
        //select an element from the Dom using the data-testId and checks if it is present in the simulated (rendered)Dom
             //? note : IDs must be defined in the react code to be able to use get by id 
             const firstName = getByTestId("first-name");
             expect(firstName).toBeInTheDocument();

             const lastName = getByTestId("last-name");
             expect(lastName).toBeInTheDocument();

             const email = getByTestId("email");
             expect(email).toBeInTheDocument();

             const phone = getByTestId("phone");
             expect(phone).toBeInTheDocument();

             const password = getByTestId("password");
             expect(password).toBeInTheDocument();

             const cpassword = getByTestId("confirm-password");
             expect(cpassword).toBeInTheDocument();

             const idd = getByTestId("idd");
             expect(idd).toBeInTheDocument();
    })
    it("renders gender radio buttons correctly", () => {
        render(
          <BrowserRouter>
            <SignUp />
          </BrowserRouter>
        );
    
        // Check if the 'Female' radio button is rendered
        expect(screen.getByTestId('female-radio')).toBeInTheDocument();
        
        // Check if the 'Male' radio button is rendered
        expect(screen.getByTestId('male-radio')).toBeInTheDocument();
    });
    it("selects the gender correctly", () => {
        render(
          <BrowserRouter>
            <SignUp />
          </BrowserRouter>
        );
    
        // Find the 'Female' and 'Male' radio buttons by their ID
        const femaleRadioButton = screen.getByTestId('female-radio');
        const maleRadioButton = screen.getByTestId('male-radio');
    
        // Select the 'Female' radio button
        fireEvent.click(femaleRadioButton);
        expect(femaleRadioButton).toBeChecked();
        expect(maleRadioButton).not.toBeChecked();
    
        // Select the 'Male' radio button
        fireEvent.click(maleRadioButton);
        expect(maleRadioButton).toBeChecked();
        expect(femaleRadioButton).not.toBeChecked();
    });
    it("displays an error if gender is not selected (if applicable)", () => {
        render(
          <BrowserRouter>
            <SignUp />
          </BrowserRouter>
        );
    
        // If no gender is selected, you could simulate a form submit and check for the error
        fireEvent.submit(screen.getByTestId("sign-up-form"));
    
        // Check if the error message for gender is displayed
        const errorMessage = screen.getByText(/gender is required/i);
        expect(errorMessage).toBeInTheDocument();
    });
    // it("renders the DatePicker component correctly", () => {
    //     render(
    //       <BrowserRouter>
    //         <SignUp />
    //       </BrowserRouter>
    //     );
    
    //     // Select the DatePicker by its test ID
    //     const datePicker = screen.getByTestId("birthdate-picker");
    //     expect(datePicker).toBeInTheDocument();
    //   });
    it("renders the DatePicker component correctly", () => {
      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      );
  
      const datePicker = screen.getByTestId("birthdate-picker");
      expect(datePicker).toBeInTheDocument();
    });
    it("updates BirthDate correctly when a date is selected", () => {
      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      );
    
      const datePickerInput = screen.getByPlaceholderText('Select your birthdate y/m/d');
    
      // Simulate selecting a date by setting a new value on the DatePicker input
      fireEvent.change(datePickerInput, { target: { value: '2025/01/01' } });
    
      // Check if the value was updated correctly
      expect(datePickerInput).toHaveValue('2025/01/01');
    });
    //todo: Test for Empty Required Fields
    it("shows errors for empty required fields on form submission", () => {
      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      );
    
      // Submit the form without filling in any fields
      fireEvent.submit(screen.getByTestId("sign-up-form"));
    
      // Check if the error messages are displayed for required fields using IDs
      expect(screen.getByTestId("error-first-name")).toBeInTheDocument();
      expect(screen.getByTestId("error-last-name")).toBeInTheDocument();
      expect(screen.getByTestId("error-email")).toBeInTheDocument();
      expect(screen.getByTestId("error-phone")).toBeInTheDocument();
      expect(screen.getByTestId("error-password")).toBeInTheDocument();
      expect(screen.getByTestId("error-confirm")).toBeInTheDocument();
      expect(screen.getByTestId("error-idd")).toBeInTheDocument();
    });
    //todo: Check if the password and the confirm password match 
    it("displays an error if passwords do not match", () => {
      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      );
    
      // Simulate filling the password fields with different values
      fireEvent.change(screen.getByTestId("password"), { target: { value: "password123" } });
      fireEvent.change(screen.getByTestId("confirm-password"), { target: { value: "password124" } });
    
      // Simulate submitting the form
      fireEvent.submit(screen.getByTestId("sign-up-form"));
    
      // Check if the error message for password mismatch is displayed
      const errorMessage = screen.getByTestId("error-confirm");
      expect(errorMessage).toHaveTextContent("Passwords do not match");
    });
    it("does not display an error if passwords match", () => {
      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      );
    
      // Simulate filling the password fields with the same value
      fireEvent.change(screen.getByTestId("password"), { target: { value: "password123" } });
      fireEvent.change(screen.getByTestId("confirm-password"), { target: { value: "password123" } });
    
      // Simulate submitting the form
      fireEvent.submit(screen.getByTestId("sign-up-form"));
    
      // Check that no error message is displayed
      const errorMessage = screen.queryByTestId("error-confirm");
      expect(errorMessage).toBeNull();
    });
    //todo: Form submission 
    // it('submits the form successfully if all fields are valid', async () => {
    //   const mockPostDataToBackend = jest.fn();
    
    //   render(
    //     <BrowserRouter>
    //       <SignUp />
    //     </BrowserRouter>
    //   );
    
    //   // Set form values to trigger validation errors (empty fields here for simplicity)
    //   fireEvent.change(screen.getByTestId("first-name"), { target: { value: "afnane" } });
    //   fireEvent.change(screen.getByTestId("last-name"), { target: { value: "karaoui" } });
    //   fireEvent.change(screen.getByTestId("email"), { target: { value: "afnane.karaoui@ensia.edu.dz" } });
    //   fireEvent.change(screen.getByTestId("password"), { target: { value: "hello" } });
    //   fireEvent.change(screen.getByTestId("confirm-password"), { target: { value: "hello" } });
    
    //   // Simulate form submission
    //   fireEvent.submit(screen.getByTestId("sign-up-form"));
    
    //   // Assert that PostDataToBackend was not called (form validation failed)
    //   expect(mockPostDataToBackend).toHaveBeenCalledTimes(0);
    // });
    it('sends correct data to the backend when all fields are filled', async () => {
        // Mock the fetch API response
        fetch.mockResolvedValue({
          json: () => Promise.resolve({ data: 'success' }), // Mock the successful response
        });
        // // Mock the API response
        //api.submitJob = jest.fn().mockResolvedValue({ data: 'success' });
    
        // Render the form
        render(<BrowserRouter><SignUp/></BrowserRouter>
        );
        // Set form values to trigger validation errors (empty fields here for simplicity)
        fireEvent.change(screen.getByTestId("first-name"), { target: { value: "afnane" } });
        fireEvent.change(screen.getByTestId("last-name"), { target: { value: "karaoui" } });
        fireEvent.click(screen.getByTestId('female-radio'));
        fireEvent.change(screen.getByTestId("email"), { target: { value: "afnane.karaoui@ensia.edu.dz" } });
        fireEvent.change(screen.getByTestId("password"), { target: { value: "password123" } });
        fireEvent.change(screen.getByTestId("confirm-password"), { target: { value: "password123" } });
      
       
        // Submit the form
        fireEvent.click(screen.getByTestId('submit-button'));
    
        // // Wait for the API call
        // await waitFor(() => expect(api.submitJob).toHaveBeenCalled());
    
        // Check that the API call was made with the correct data
        await waitFor(() =>
          expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/auth/register', // The expected URL
            expect.objectContaining({
              method: 'POST', // Expected HTTP method
              headers: {
                'Content-Type': 'application/json', // Expected headers
              },
              body: JSON.stringify({
                Fname: 'afnane',
                Lname: 'karaoui',
                Gender: 'female',
                BirthDate:null,
                Id: null,
                email: 'afnane.karaoui@ensia.edu.dz',
                PhoneNum: null,
                password: 'password123',
                confirmPassword: 'password123'
                  }), // Expected body content
            })
          )
        );
      });
    // it('does not submit the form if any field is invalid', async () => {
    //   const mockPostDataToBackend = jest.fn();
    
    //   render(
    //     <BrowserRouter>
    //       <SignUp />
    //     </BrowserRouter>
    //   );
    
    //   // Set form values to trigger validation errors (empty fields here for simplicity)
    //   fireEvent.change(screen.getByTestId("first-name"), { target: { value: "" } });
    //   fireEvent.change(screen.getByTestId("last-name"), { target: { value: "" } });
    //   fireEvent.change(screen.getByTestId("email"), { target: { value: "" } });
    //   fireEvent.change(screen.getByTestId("password"), { target: { value: "" } });
    //   fireEvent.change(screen.getByTestId("confirm-password"), { target: { value: "" } });
    
    //   // Simulate form submission
    //   fireEvent.submit(screen.getByTestId("sign-up-form"));
    
    //   // Assert that PostDataToBackend was not called because of validation errors
    //   expect(mockPostDataToBackend).toHaveBeenCalledTimes(0);
    // });
    
   
})