import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./Navbar";

describe("Navbar Component", () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test("renders Navbar component with all links", () => {
    renderWithRouter(<Navbar />);

    // Check for logo
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/log.png");

    // Check for brand name
    const brandName = screen.getByText("Mziya.DARI");
    expect(brandName).toBeInTheDocument();

    // Check for navigation links
    const homeLink = screen.getByText("Home");
    const findJobLink = screen.getByText("Find a Job");
    const makePostLink = screen.getByText("Make a Post");
    const contactLink = screen.getByText("Contact Us");
    const accountLink = screen.getByText("Account");
    const profileLink = screen.getByText("Profile");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(findJobLink).toHaveAttribute("href", "/findjob");
    expect(makePostLink).toHaveAttribute("href", "/makepost");
    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(accountLink).toHaveAttribute("href", "/login");
    expect(profileLink).toHaveAttribute("href", "/profile");
  });

  test("renders navbar with correct styles", () => {
    renderWithRouter(<Navbar />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toHaveStyle("background-color: #142257");
    expect(navbar).toHaveStyle("width: 100vw");
    expect(navbar).toHaveStyle("color: white");
  });

  test("renders toggler button for smaller screens", () => {
    renderWithRouter(<Navbar />);

    const togglerButton = screen.getByLabelText("Toggle navigation");
    expect(togglerButton).toBeInTheDocument();
  });
});
