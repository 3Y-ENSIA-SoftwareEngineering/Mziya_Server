import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="job-card border d-flex flex-row justify-content-evenly align-items-start pt-3 w-100 mb-3">
      <div className="HOwnerInfo d-flex flex-column align-items-end pe-4 ps-4">
        <h6 className="text-primary fw-bold">{job.name}</h6>
        <p className="text-secondary small">{job.location}</p>
        <p className="text-secondary small">{job.price} DA/h</p>
        <h6 className="text-primary fw-bold">{job.contact}</h6>
      </div>
      <div className="line bg-secondary mx-3"></div>
      <div className="JobInfo d-flex flex-column align-items-start ps-3 flex-grow-1">
        <div className="d-flex flex-row justify-content-between w-100">
          <div className="tags mb-2 d-flex flex-row justify-content-start">
            {job.category.split(", ").map((tag, index) => (
              <span key={index} className="badge bg-info text-white me-2">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-muted small ps-2 mb-0">{job.time} ago</p>
        </div>
        <div className="d-flex flex-row justify-content-between w-100 align-items-center">
          <div className="d-flex flex-column align-items-start flex-grow-1">
            <h5 className="card-title fw-bold mt-3">{job.title}</h5>
            <p className="card-text small mt-2">{job.description}</p>
          </div>
          <div className="job-image ms-3">
            <img
              src="/imageforuse.png"
              alt="job"
              className="rounded"
              style={{
                width: "6vw",
                height: "6vw",
                marginTop: "2vh",
                marginRight: "2vh",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
