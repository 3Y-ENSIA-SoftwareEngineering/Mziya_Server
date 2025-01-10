import React, { useState, useEffect } from "react";
import { Navbar } from "./../Components/NavBar.jsx";
import JobCard from "./../Components/JobCard";
import { Footer } from "./../Components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import "./../CSSFiles/footer.css";

const FindJob = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async (option = null, category = null) => {
    setIsLoading(true);
    setError(null);

    // get the token from session storage
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login"); // Redirect if not authenticated
      return;
    }

    try {
      let endpoint = "http://localhost:3000/api/getJob/";

      // Modify endpoint based on selected option
      switch (option) {
        case "Category":
          if (category) {
            endpoint = `http://localhost:3000/api/getJob/category/${category}`;
          }
          break;
        case "Closest Jobs":
          endpoint = "http://localhost:3000/api/getJob/";
          break;
        case "Best Price":
          endpoint = "http://localhost:3000/api/getJob/best-price";
          break;
        case "Best Rating":
          endpoint = "http://localhost:3000/api/getJob/";
          break;
        default:
          endpoint = "http://localhost:3000/api/getJob/";
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs. Please try again.");
      }

      const responseData = await response.json();
      setJobs(responseData.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.message);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedOption) {
      fetchJobs(selectedOption, selectedCategory);
    }
  }, [selectedOption, selectedCategory]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    if (option !== "Category") setSelectedCategory(null);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedOption("Category");
  };

  return (
    <div>
      <Navbar />
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: 1, padding: "20px" }}>
          <div className="d-flex flex-row justify-content-end mb-4">
            <div
              className="d-flex flex-row justify-content-start col-md-7 rounded-pill"
              style={{ marginLeft: "auto", marginRight: "20px", width: "70%" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search for a job..."
              />
            </div>
          </div>
          <div className="d-flex flex-row" style={{ marginTop: "20px" }}>
            <div
              className="d-flex flex-column"
              style={{
                width: "120vw",
                height: "100%",
                marginLeft: "10vw",
                marginRight: "20px",
              }}
            >
              <div className="options d-flex flex-column align-items-start mt-5">
                <h5 className="mb-2">Sort by:</h5>
                <ul
                  className="list-unstyled"
                  style={{ listStyle: "none", padding: 0 }}
                >
                  {(() => {
                    const buttonStyle = {
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      backgroundColor: "#f9f9f9",
                      transition: "all 0.3s ease",
                    };

                    const activeButtonStyle = {
                      ...buttonStyle,
                      backgroundColor: "#e9ecef",
                    };

                    return (
                      <>
                        <li>
                          <select
                            className="form-select"
                            style={
                              selectedOption === "Category"
                                ? activeButtonStyle
                                : buttonStyle
                            }
                            value={selectedCategory || ""}
                            onChange={handleCategoryChange}
                          >
                            <option value="" disabled>
                              Select Category
                            </option>
                            <option value="Babysitting">Babysitting</option>
                            <option value="Child Care">Child Care</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Gardening">Gardening</option>
                            <option value="Painting">Painting</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Private Tutor">Private Tutor</option>
                          </select>
                        </li>
                        <li
                          className="mb-1"
                          style={
                            selectedOption === "Closest Jobs"
                              ? activeButtonStyle
                              : buttonStyle
                          }
                          onClick={() => handleSelect("Closest Jobs")}
                        >
                          Closest Jobs
                        </li>
                        <li
                          className="mb-1"
                          style={
                            selectedOption === "Best Price"
                              ? activeButtonStyle
                              : buttonStyle
                          }
                          onClick={() => handleSelect("Best Price")}
                        >
                          Best Price
                        </li>
                        <li
                          className="mb-1"
                          style={
                            selectedOption === "Best Rating"
                              ? activeButtonStyle
                              : buttonStyle
                          }
                          onClick={() => handleSelect("Best Rating")}
                        >
                          Best Rating
                        </li>
                      </>
                    );
                  })()}
                </ul>
              </div>
            </div>
            <div style={{ flexGrow: 1, height: "80vh", paddingBottom: "5vh" }}>
              <div className="row">
                {isLoading ? (
                  <p>Loading jobs...</p>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div key={job.id} className="col-12 pb-4 mb-6">
                      <JobCard job={job} />
                    </div>
                  ))
                ) : (
                  <p>No jobs found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export { FindJob };
