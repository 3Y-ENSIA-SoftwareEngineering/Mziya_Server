import { render, screen, fireEvent } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks"; // Adjust the path if necessary
import workerImage from "./images/worker-image.png"; // Ensure this image path is correct

test("renders HowItWorks component and toggles sections", () => {
  // Render the component
  render(<HowItWorks />);

  // Check if the title is rendered
  expect(screen.getByText(/How Does Mziya Work?/i)).toBeInTheDocument();

  // Check if the "As a Worker" button is rendered
  const workerButton = screen.getByText(/As a Worker/i);
  expect(workerButton).toBeInTheDocument();

  // Check if the "As a Homeowner" button is rendered
  const homeownerButton = screen.getByText(/As a Homeowner/i);
  expect(homeownerButton).toBeInTheDocument();

  // Initially, check if the "As a Worker" section is visible
  expect(screen.getByText(/Post your service request:/i)).toBeInTheDocument();
  expect(screen.getByText(/Review and select a worker:/i)).toBeInTheDocument();
  expect(screen.getByText(/Get the job done and leave a review:/i)).toBeInTheDocument();

  // Check if the worker image is not visible initially
  expect(screen.queryByAltText("Worker")).not.toBeInTheDocument();

  // Click the "As a Homeowner" button
  fireEvent.click(homeownerButton);

  // Now the "As a Homeowner" section should be visible
  expect(screen.getByText(/Post your service request:/i)).toBeInTheDocument();
  expect(screen.getByText(/Review and select a worker:/i)).toBeInTheDocument();
  expect(screen.getByText(/Get the job done and leave a review:/i)).toBeInTheDocument();

  // Check if the worker image is visible for "Homeowner"
  expect(screen.getByAltText("Worker")).toBeInTheDocument();

  // Click the "As a Worker" button to toggle back
  fireEvent.click(workerButton);

  // Now the "As a Worker" section should be visible again
  expect(screen.getByText(/Post your service request:/i)).toBeInTheDocument();
  expect(screen.getByText(/Review and select a worker:/i)).toBeInTheDocument();
  expect(screen.getByText(/Get the job done and leave a review:/i)).toBeInTheDocument();

  // Check if the worker image is not visible when "As a Worker" is active
  expect(screen.queryByAltText("Worker")).not.toBeInTheDocument();
});
