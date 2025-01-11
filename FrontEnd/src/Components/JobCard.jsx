import React, { useState } from "react";
import jwtDecode from "jwt-decode"; // Ensure you have this package installed

const JobCard = ({ job }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const handleApplyClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSubmissionError(null); // Clear any previous error messages
  };

  const confirmApply = async () => {
    setIsApplying(true);
    setSubmissionError(null);

    try {
      // Get the token from session storage
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("You must be logged in to apply for a job.");
      }

      // Decode the token to get user ID
      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
      } catch (err) {
        throw new Error("Invalid token.");
      }

      const userId = decodedToken.user_id;

      // Send a request to apply for the job
      const response = await fetch(
        `http://localhost:3000/api/apply/${job.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId: job.id, userId }),
        }
      );
      

      if (!response.ok) {
        throw new Error("Failed to apply for the job.");
      }

      alert("Application successful!");
      closePopup();
    } catch (err) {
      setSubmissionError(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div
      className="job-card border d-flex flex-row align-items-center pt-3 w-100 mb-3"
      style={{
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      {/* Owner Information */}
      <div
        className="HOwnerInfo d-flex flex-column align-items-start"
        style={{ width: "30%", paddingRight: "20px" }}
      >
        <h6 className="text-primary fw-bold">{job.name}</h6>
        <p className="text-secondary small">{job.location}</p>
        <p className="text-secondary small">{job.budget} DA/h</p>
        <h6 className="text-primary fw-bold">{job.contact}</h6>
      </div>

      {/* Divider */}
      <div
        className="line bg-secondary"
        style={{ width: "1px", height: "100%", margin: "0 20px" }}
      ></div>

      {/* Job Information */}
      <div
        className="JobInfo d-flex flex-column align-items-start flex-grow-1"
        style={{ width: "70%" }}
      >
        <div className="d-flex flex-row justify-content-between w-100">
          <div className="tags d-flex flex-row">
            {job.job_category ? (
              job.job_category.split(", ").map((tag, index) => (
                <span
                  key={index}
                  className="badge bg-info text-white me-2"
                  style={{ fontSize: "1rem", padding: "0.4rem 0.8rem" }}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-muted small">No categories</span>
            )}
          </div>
          <p className="text-muted small">{job.time} ago</p>
        </div>
        <div className="d-flex flex-row justify-content-between w-100 align-items-center">
          <div className="d-flex flex-column">
            <h5 className="card-title fw-bold mt-3">{job.title}</h5>
            <p className="card-text small mt-2">{job.description}</p>
            <button
              className="btn btn-primary mt-3"
              style={{
                fontSize: "0.8rem",
                padding: "0.3rem 0.6rem",
                width: "10vw",
              }}
              onClick={handleApplyClick}
            >
              Apply to Job
            </button>
          </div>
          <div className="job-image ms-4">
            <img
              src="/imageforuse.png"
              alt="job"
              className="rounded"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          className="popup-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="popup-content bg-white p-4 rounded"
            style={{
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <h5 className="mb-3">Apply for {job.title}</h5>
            <p>Are you sure you want to apply for this job?</p>
            {submissionError && (
              <p className="text-danger small">{submissionError}</p>
            )}
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary" onClick={closePopup}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={confirmApply}
                disabled={isApplying}
              >
                {isApplying ? "Applying..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
