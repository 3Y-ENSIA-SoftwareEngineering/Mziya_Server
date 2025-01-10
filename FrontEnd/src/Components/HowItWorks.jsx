import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSSFiles/HowItWorks.css";
import workerImage from "./images/worker-image.png";

export const HowItWorks = () => {
  const [activeSection, setActiveSection] = useState("homeowner");

  const toggleSection = () => {
    setActiveSection((prev) => (prev === "worker" ? "homeowner" : "worker"));
  };

  return (
    <section className="how-it-works container py-5">
      <h2 className="how-title mb-4">How Does Mziya Work?</h2>
      <div className="row g-4">
        {/* Worker Section */}
        <div className="col-md-6 text-center">
          <button
            className="btn btn-outline-primary w-75"
            style={{
              backgroundColor: "transparent",
              color:"Black",
              fontSize: "2vw",
              fontWeight:"bold",
              border: "none", // Removes border
            }}
            onClick={toggleSection}
          >
            As a Worker
          </button>
          {activeSection === "worker" ? (
           <div className="mt-4">
           <ul className="steps list-group">
             <li className="list-group-item " style={{ border: "none" }}>
                <strong>Post your service request:</strong> You can post about the services that you need to be provided, complete all the details needed about it.
             </li>
             <li className="list-group-item " style={{ border: "none" }}>
                <strong>Review and select a worker:</strong> After publishing your post, you can sort the workers who want to complete the task and select the most suitable candidate.
             </li>
             <li className="list-group-item "style={{ border: "none" }}>
                <strong>Get the job done and leave a review:</strong> Once the worker is done with your needed service, you pay them the amount needed and leave a review on their profile.
             </li>
           </ul>
         </div>
         
          ) : (
            <img
              src={workerImage}
              alt="Worker"
              className="worker-image img-fluid mt-4"
            />
          )}
        </div>

        {/* Homeowner Section */}
        <div className="col-md-6 text-center">
          <button
            className="btn btn-outline-success w-75"
            style={{
              backgroundColor: "transparent",
              color:"Black",
              fontSize: "2vw",
              fontWeight:"bold",
    border: "none", // Removes border
            }}
            onClick={toggleSection}
          >
            As a Homeowner
          </button>
          {activeSection === "homeowner" ? (
           <div className="mt-4">
           <ul className="steps list-group">
             <li className="list-group-item " style={{ border: "none" }}>
                <strong>Post your service request:</strong> You can post about the services that you need to be provided, complete all the details needed about it.
             </li>
             <li className="list-group-item " style={{ border: "none" }}>
                <strong>Review and select a worker:</strong> After publishing your post, you can sort the workers who want to complete the task and select the most suitable candidate.
             </li>
             <li className="list-group-item "style={{ border: "none" }}>
                <strong>Get the job done and leave a review:</strong> Once the worker is done with your needed service, you pay them the amount needed and leave a review on their profile.
             </li>
           </ul>
         </div>
         
          ) : (
            <img
              src={workerImage}
              alt="Worker"
              className="worker-image img-fluid mt-4"
            />
          )}
        </div>
      </div>
    </section>
  );
};
