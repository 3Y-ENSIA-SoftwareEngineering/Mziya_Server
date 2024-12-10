import React, { useState } from "react";
import { Navbar } from "./../Components/NavBar";
import JobCard from "./../Components/JobCard";
import { Footer } from "./../Components/Footer.jsx";
import "./../CSSFiles/footer.css";

const FindJob = () => {
  const jobs = [
    {
      name: "Amel Feddag",
      location: "Algeria",
      title: "Post Title",
      description: "Presenting you the opportunity to work...",
      price: 25,
      category: "Garden, Plumbing",
      time: "1h",
      contact: "+213 55050496",
    },
    {
      name: "Amel Feddag",
      location: "Algeria",
      title: "Post Title",
      description: "Presenting you the opportunity to work...",
      price: 25,
      category: "Garden, Plumbing",
      time: "1h",
      contact: "+213 55050496",
    },
    {
      name: "Amel Feddag",
      location: "Algeria",
      title: "Post Title",
      description: "Presenting you the opportunity to work...",
      price: 25,
      category: "Garden, Plumbing",
      time: "1h",
      contact: "+213 55050496",
    },
    {
      name: "Amel Feddag",
      location: "Algeria",
      title: "Post Title",
      description: "Presenting you the opportunity to work...",
      price: 25,
      category: "Garden, Plumbing",
      time: "1h",
      contact: "+213 55050496",
    },
    {
      name: "Amel Feddag",
      location: "Algeria",
      title: "Post Title",
      description: "Presenting you the opportunity to work...",
      price: 25,
      category: "Garden, Plumbing",
      time: "1h",
      contact: "+213 55050496",
    },
    {
      name: "Amel Feddag",
      location: "Algeria",
      title: "Post Title",
      description: "Presenting you the opportunity to work...",
      price: 25,
      category: "Garden, Plumbing",
      time: "1h",
      contact: "+213 55050496",
    },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log(`Selected: ${option}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px",
        }}
      >
        <div className="d-flex flex-row justify-content-end mb-4">
          <div
            className="d-flex flex-row justify-content-start col-md-7 rounded-pill"
            style={{
              marginLeft: "auto",
              marginRight: "20px",
              width: "70%",
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search for a job..."
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="d-flex flex-row" style={{ marginTop: "20px" }}>
          {/* Sidebar */}
          <div
            className="d-flex flex-column"
            style={{
              width: "30%",
              marginLeft: "10vw",
              marginRight: "20px",
            }}
          >
            <div className="options d-flex flex-column align-items-start mt-5 ">
              <h5 className="mb-2">Sort by:</h5>
              <ul className="list-unstyled ">
                <li className="mb-1">
                  <button
                    className="btn btn-link w-100 text-start"
                    onClick={() => handleSelect("Category")}
                  >
                    Category
                  </button>
                </li>
                <li className="mb-1">
                  <button
                    className="btn btn-link w-100 text-start"
                    onClick={() => handleSelect("Closest Jobs")}
                  >
                    Closest Jobs
                  </button>
                </li>
                <li className="mb-1">
                  <button
                    className="btn btn-link w-100 text-start"
                    onClick={() => handleSelect("Best Price")}
                  >
                    Best Price
                  </button>
                </li>
                <li className="mb-1">
                  <button
                    className="btn btn-link w-100 text-start"
                    onClick={() => handleSelect("Best Rating")}
                  >
                    Best Rating
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Job List */}
          <div style={{ flexGrow: 1, height: "80vh", paddingBottom: "5vh" }}>
            <div className="row">
              {jobs.map((job, index) => (
                <div key={index} className="col-12 mb-4">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-left">
            <h3>Mziya.DARI</h3>
            <p>
              Mziya is your one and only destination for finding a job
              <br /> in HomeServices, and getting yourself workers too!
            </p>
            <div className="social-icons">
              <i className="fab fa-youtube"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-envelope"></i>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h4>Company</h4>
              <ul>
                <li>About us</li>
                <li>Services</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li>Terms</li>
                <li>Privacy</li>
                <li>License</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>©2024 Mziya.DARI. All rights reserved</p>
        </div>
      </footer> */}
    </div>
  );
};

export { FindJob };
