import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from './ProfilePage'; // Replace with your actual file path

// Mocking fetch API for the component
global.fetch = jest.fn();

describe('ProfilePage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading message initially', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/Loading profile.../i)).toBeInTheDocument();
  });

  test('fetches and displays user profile data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          email: 'test@example.com',
          phoneNumber: '123456789',
        },
        jobDeals: [],
        jobOffers: [],
      }),
    });

    render(<ProfilePage />);

    // Wait for the profile to be displayed
    await waitFor(() => expect(screen.getByText(/My Infos:/i)).toBeInTheDocument());
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
  });

  test('handles profile update correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          email: 'test@example.com',
          phoneNumber: '123456789',
        },
      }),
    });

    const mockUpdateFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Profile updated successfully' }),
    });

    fetch.mockImplementationOnce(mockUpdateFetch);

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText(/My Infos:/i)).toBeInTheDocument());

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'new-email@example.com' } });

    const updateButton = screen.getByText(/Update Profile/i);
    fireEvent.click(updateButton);

    await waitFor(() =>
      expect(mockUpdateFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profile/update',
        expect.objectContaining({
          method: 'PUT',
        })
      )
    );

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test('displays error when profile fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to fetch user data' }),
    });

    render(<ProfilePage />);

    await waitFor(() =>
      expect(screen.getByText(/Error: Failed to fetch user data/i)).toBeInTheDocument()
    );
  });

  test('uploads profile picture successfully', async () => {
    const mockUploadFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Profile picture updated successfully' }),
    });

    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: async () => ({
        user: { email: 'test@example.com', phoneNumber: '123456789' },
        jobDeals: [],
        jobOffers: [],
      }),
    }));

    fetch.mockImplementationOnce(mockUploadFetch);

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText(/My Infos:/i)).toBeInTheDocument());

    const file = new File(['profile-pic'], 'profile.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/📷/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() =>
      expect(mockUploadFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profile/uploadProfilePic',
        expect.any(Object)
      )
    );

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test('changes password successfully', async () => {
    const mockPasswordChangeFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Password changed successfully' }),
    });

    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: async () => ({
        user: { email: 'test@example.com', phoneNumber: '123456789' },
        jobDeals: [],
        jobOffers: [],
      }),
    }));

    fetch.mockImplementationOnce(mockPasswordChangeFetch);

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText(/My Infos:/i)).toBeInTheDocument());

    const currentPassword = screen.getByLabelText(/Current Password/i);
    fireEvent.change(currentPassword, { target: { value: 'oldPassword' } });

    const newPassword = screen.getByLabelText(/New Password/i);
    fireEvent.change(newPassword, { target: { value: 'newPassword123' } });

    const confirmPassword = screen.getByLabelText(/Confirm New Password/i);
    fireEvent.change(confirmPassword, { target: { value: 'newPassword123' } });

    const changeButton = screen.getByText(/Change Password/i);
    fireEvent.click(changeButton);

    await waitFor(() =>
      expect(mockPasswordChangeFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profile/changePassword',
        expect.objectContaining({
          method: 'PUT',
        })
      )
    );

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
