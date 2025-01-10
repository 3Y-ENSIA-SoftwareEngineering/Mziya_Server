import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { FindJob } from "./FindJob";

// Mock components
jest.mock("./../Components/NavBar.jsx", () => ({ Navbar: () => <div>Mock Navbar</div> }));
jest.mock("./../Components/JobCard", () => ({ job }) => <div>{job.title}</div>);
jest.mock("./../Components/Footer.jsx", () => ({ Footer: () => <div>Mock Footer</div> }));

global.fetch = jest.fn();

describe("FindJob Component", () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <FindJob />
      </BrowserRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the FindJob component correctly", () => {
    renderComponent();

    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search for a job...")).toBeInTheDocument();
    expect(screen.getByText("Sort by:")).toBeInTheDocument();
  });

  test("shows loading state when fetching jobs", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    renderComponent();

    expect(screen.getByText("Loading jobs...")).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  test("renders fetched jobs correctly", async () => {
    const mockJobs = [
      { id: 1, title: "Job 1" },
      { id: 2, title: "Job 2" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockJobs }),
    });

    renderComponent();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Job 1")).toBeInTheDocument();
    expect(screen.getByText("Job 2")).toBeInTheDocument();
  });

  test("displays an error message on failed API call", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch jobs"));

    renderComponent();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Error: Failed to fetch jobs"));
  });

  test("handles category selection and triggers API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    renderComponent();

    const categorySelect = screen.getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: "Babysitting" } });

    expect(categorySelect.value).toBe("Babysitting");

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenLastCalledWith(
      "http://localhost:3000/api/getJob/category/Babysitting",
      expect.any(Object)
    );
  });

  test("handles sort option selection and triggers API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    renderComponent();

    const sortOption = screen.getByText("Closest Jobs");
    fireEvent.click(sortOption);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenLastCalledWith(
      "http://localhost:3000/api/getJob/",
      expect.any(Object)
    );
  });
});
