import React, { useState } from "react";
import { Navbar } from "./../Components/NavBar";
import JobCard from "./../Components/JobCard";
import Footer from "./../Components/Footer";

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
        overflowY: "auto",
      }}
    >
      <Navbar />
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
      {/* <Footer /> */}
    </div>
  );
};

export { FindJob };
