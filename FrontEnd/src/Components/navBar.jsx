import React from "react";

export const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-sm m- "
      style={{
        backgroundColor: "#142257",
        width: "100vw",
        color: "white ",
      }}
    >
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="#">
          <img
            src="/log.png"
            width="30"
            height="24"
            className="d-inline-block align-text-top me-3 ms-3"
          />
          Mziya.DARI
        </a>

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
          {/* Add a class to push the menu to the right */}
          <ul
            className="navbar-nav ms-auto mb-2 mb-lg-0 "
            style={{ gap: "20px" }}
          >
            <li className="nav-item ">
              <a
                className="nav-link text-white active"
                aria-current="page"
                href="#"
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Find a Job
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Make a Post
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Contact Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="./../screens/Login.jsx">
                Account
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
