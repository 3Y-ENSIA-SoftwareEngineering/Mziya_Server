import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  test('renders the Logout button', async () => {
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

    await waitFor(() => expect(screen.getByText(/My Infos:/i)).toBeInTheDocument());
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
