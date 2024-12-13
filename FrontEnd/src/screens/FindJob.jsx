import React, { useState, useEffect } from "react";
import { Navbar } from "../Components/NavBar.jsx";
import JobCard from "./../Components/JobCard";
import { Footer } from "./../Components/Footer.jsx";
import "./../CSSFiles/footer.css";

const FindJob = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://your-backend-api.com/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log(`Selected: ${option}`);
  };

  return (
    <div>
      <Navbar />
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
                <ul
                  className="list-unstyled "
                  style={{
                    listStyle: "none",
                    padding: 0,
                  }}
                >
                  <li
                    className="mb-1"
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      marginBottom: "10px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e9ecef";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                    onClick={() => handleSelect("Category")}
                  >
                    Category
                  </li>
                  <li
                    className="mb-1"
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      marginBottom: "10px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e9ecef";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                    onClick={() => handleSelect("Closest Jobs")}
                  >
                    Closest Jobs
                  </li>
                  <li
                    className="mb-1"
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      marginBottom: "10px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e9ecef";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                    onClick={() => handleSelect("Best Price")}
                  >
                    Best Price
                  </li>
                  <li
                    className="mb-1"
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      marginBottom: "10px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e9ecef";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                    onClick={() => handleSelect("Best Rating")}
                  >
                    Best Rating
                  </li>
                </ul>
              </div>
            </div>
            {/* Job List */}
            <div style={{ flexGrow: 1, height: "80vh", paddingBottom: "5vh" }}>
              <div className="row">
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <div key={index} className="col-12 mb-4">
                      <JobCard job={job} />
                    </div>
                  ))
                ) : (
                  <p>Loading jobs...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FindJob };
