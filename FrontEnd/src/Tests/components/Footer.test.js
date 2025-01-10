import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer"; // Adjust the import according to your file structure
import "@testing-library/jest-dom";

describe("Footer Component", () => {
  test("renders the header section with the correct text", () => {
    render(<Footer />);

    // Check that the header section text is present
    expect(screen.getByText(/In need of a Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Service within 24/i)).toBeInTheDocument();
    expect(screen.getByText(/hours?/i)).toBeInTheDocument();
    expect(screen.getByText(/Mziya\.DARI is here/i)).toBeInTheDocument();
    expect(screen.getByText(/for you!/i)).toBeInTheDocument();
  });

  test("renders the 'Get started now!' button", () => {
    render(<Footer />);
    const button = screen.getByText(/Get started now!/i);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("get-started-button");
  });

  test("renders social media icons", () => {
    render(<Footer />);
    // Check that social media icons are present
    expect(screen.getByClassName("fab fa-youtube")).toBeInTheDocument();
    expect(screen.getByClassName("fab fa-instagram")).toBeInTheDocument();
    expect(screen.getByClassName("fab fa-twitter")).toBeInTheDocument();
    expect(screen.getByClassName("fab fa-envelope")).toBeInTheDocument();
  });

  test("renders footer content and links", () => {
    render(<Footer />);

    // Check footer content
    expect(screen.getByText(/Mziya\.DARI/i)).toBeInTheDocument();
    expect(screen.getByText(/Mziya is your one and only destination/i)).toBeInTheDocument();
    expect(screen.getByText(/for finding a job/i)).toBeInTheDocument();

    // Check footer links
    expect(screen.getByText(/About us/i)).toBeInTheDocument();
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/License/i)).toBeInTheDocument();
  });

  test("renders footer bottom text", () => {
    render(<Footer />);
    expect(screen.getByText(/©2024 Mziya\.DARI\. All rights reserved/i)).toBeInTheDocument();
  });
});
