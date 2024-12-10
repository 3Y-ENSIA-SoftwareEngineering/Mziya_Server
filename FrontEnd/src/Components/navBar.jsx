import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-sm"
      style={{
        backgroundColor: "#142257",
        width: "100vw",
        color: "white",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          <img
            src="/log.png"
            width="30"
            height="24"
            className="d-inline-block align-text-top me-3 ms-3"
            alt="Logo"
          />
          Mziya.DARI
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse d-flex flex-row justify-content-end"
          id="navbarNav"
        >
          <ul
            className="navbar-nav ms-auto mb-2 mb-lg-0"
            style={{ gap: "20px" }}
          >
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/findjob">
                Find a Job
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/makepost">
                Make a Post
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contact">
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/login">
                Account
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
