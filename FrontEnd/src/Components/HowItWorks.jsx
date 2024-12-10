import React from 'react';
import './HowItWorks.css';
import workerImage from './images/worker-image.png';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2 className="how-title">How Does Mziya Work?</h2>
      <div className="how-container">
        {/* Worker Section */}
        <div className="worker-section">
          <h3 className="worker-title">As a Worker</h3>
          <img src={workerImage} alt="Worker" className="worker-image" />
        </div>

        {/* Homeowner Section */}
        <div className="homeowner-section">
          <h3 className="homeowner-title">As a Homeowner</h3>
          <ul className="steps">
            <li>
              <strong>Post about your service</strong>
              <p>
                You can post about the services that you need to be provided,
                complete all the details needed about it.
              </p>
            </li>
            <li>
              <strong>Select the worker you want</strong>
              <p>
                After publishing your post, you can sort the workers who want
                to complete the task and select the most suitable candidate.
              </p>
            </li>
            <li>
              <strong>Have your work done and leave a review</strong>
              <p>
                Once the worker is done with your needed service, you pay them
                the amount needed and leave a review on their profile.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;