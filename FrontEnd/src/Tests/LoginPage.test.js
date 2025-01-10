import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

describe("Login Component", () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  test("renders login form with required fields", () => {
    renderComponent();

    // Check if all elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/hi again/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(submitButton);

    // Check validation messages
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test("shows validation error for invalid email", async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });

    const submitButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/email is invalid/i)).toBeInTheDocument();
  });

  test("submits the form successfully with valid data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "mockToken" }),
      })
    );

    renderComponent();

    // Fill out the form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(submitButton);

    // Ensure fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@example.com", password: "password123" }),
        })
      );
    });

    // Clean up mock
    global.fetch.mockClear();
    delete global.fetch;
  });

  test("displays server error on failed login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.reject(new Error("Unauthorized")),
      })
    );

    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    const submitButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(submitButton);

    // Check for server error message
    await waitFor(() =>
      expect(
        screen.getByText(/login failed. please check your credentials./i)
      ).toBeInTheDocument()
    );

    // Clean up mock
    global.fetch.mockClear();
    delete global.fetch;
  });
});
