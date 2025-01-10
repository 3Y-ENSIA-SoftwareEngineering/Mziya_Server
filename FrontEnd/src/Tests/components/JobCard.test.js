import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import JobCard from "./JobCard";

describe("JobCard Component", () => {
  const mockJob = {
    name: "John Doe",
    location: "Algiers, Algeria",
    budget: "500",
    contact: "123-456-789",
    job_category: "Web Development, Design",
    time: "2 hours",
    title: "Frontend Developer Needed",
    description: "We are looking for an experienced React developer.",
  };

  test("renders job information correctly", () => {
    render(<JobCard job={mockJob} />);

    // Check owner info
    expect(screen.getByText(mockJob.name)).toBeInTheDocument();
    expect(screen.getByText(mockJob.location)).toBeInTheDocument();
    expect(screen.getByText(`${mockJob.budget} DA/h`)).toBeInTheDocument();
    expect(screen.getByText(mockJob.contact)).toBeInTheDocument();

    // Check job info
    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.description)).toBeInTheDocument();
    expect(screen.getByText(mockJob.time + " ago")).toBeInTheDocument();

    // Check job categories
    mockJob.job_category.split(", ").forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });

    // Check job image
    const jobImage = screen.getByAltText("job");
    expect(jobImage).toBeInTheDocument();
    expect(jobImage).toHaveAttribute("src", "/imageforuse.png");
  });

  test("opens popup when 'Apply to Job' button is clicked", () => {
    render(<JobCard job={mockJob} />);

    const applyButton = screen.getByText("Apply to Job");
    expect(applyButton).toBeInTheDocument();

    // Simulate button click
    fireEvent.click(applyButton);

    // Check popup is displayed
    expect(screen.getByText(`Apply for ${mockJob.title}`)).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to apply for this job?")
    ).toBeInTheDocument();
  });

  test("closes popup when 'Cancel' button is clicked", () => {
    render(<JobCard job={mockJob} />);

    const applyButton = screen.getByText("Apply to Job");
    fireEvent.click(applyButton);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Check popup is not displayed anymore
    expect(
      screen.queryByText(`Apply for ${mockJob.title}`)
    ).not.toBeInTheDocument();
  });

  test("confirms application and closes popup", () => {
    const consoleSpy = jest.spyOn(console, "log");

    render(<JobCard job={mockJob} />);

    const applyButton = screen.getByText("Apply to Job");
    fireEvent.click(applyButton);

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Check application logic and popup closure
    expect(consoleSpy).toHaveBeenCalledWith("Application submitted!");
    expect(
      screen.queryByText(`Apply for ${mockJob.title}`)
    ).not.toBeInTheDocument();
  });

  test("displays 'No categories' if job categories are missing", () => {
    const jobWithoutCategories = { ...mockJob, job_category: null };

    render(<JobCard job={jobWithoutCategories} />);

    expect(screen.getByText("No categories")).toBeInTheDocument();
  });
});
