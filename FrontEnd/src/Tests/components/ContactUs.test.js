import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactUs } from "./ContactUs"; // Adjust the import according to your file structure
import "@testing-library/jest-dom";

// Mock the fetch API for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
);

describe("ContactUs Component", () => {
  test("renders the form fields correctly", () => {
    render(<ContactUs />);

    // Check for form fields
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Surname/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your message/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test("shows loading state when submitting the form", async () => {
    render(<ContactUs />);

    const submitButton = screen.getByText(/Submit/i);

    // Fill the form fields
    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Surname/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Your message/i), {
      target: { value: "Hello!" },
    });

    // Click the submit button
    fireEvent.click(submitButton);

    // Check if the button changes to "Sending..."
    expect(submitButton).toHaveTextContent("Sending...");

    // Simulate an API response and check if the modal appears
    await waitFor(() => expect(screen.getByText(/Message sent successfully!/i)).toBeInTheDocument());
  });

  test("displays error modal if message sending fails", async () => {
    // Mock the fetch to simulate an error
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Failed to send message"))
    );

    render(<ContactUs />);

    const submitButton = screen.getByText(/Submit/i);

    // Fill the form fields
    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Surname/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Your message/i), {
      target: { value: "Hello!" },
    });

    // Click the submit button
    fireEvent.click(submitButton);

    // Check if the error modal is displayed
    await waitFor(() =>
      expect(screen.getByText(/Failed to send message. Please try again./i)).toBeInTheDocument()
    );
  });

  test("closes the modal when close button is clicked", async () => {
    render(<ContactUs />);

    // Fill and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Surname/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "john.doe@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Your message/i), { target: { value: "Hello!" } });
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the modal to appear
    await waitFor(() => expect(screen.getByText(/Message sent successfully!/i)).toBeInTheDocument());

    // Click the "Close" button on the modal
    fireEvent.click(screen.getByText(/Close/i));

    // Check if the modal is closed (doesn't exist in the DOM anymore)
    expect(screen.queryByText(/Message sent successfully!/i)).not.toBeInTheDocument();
  });
});
