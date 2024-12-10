import React from "react";
import "./footer.css";
import personpointing from './images/person-pointing.png';

const HomeService = () => {
  return (
    <div className="home-service-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="text-container">
          <h1>In need of a Home </h1>
          <h1>Service within 24</h1>
          <h1> hours?</h1>
          <h2>
            Mziya.DARI is here <br /> for you!
          </h2>
          <ul className="features-list">
            <li>✓ Fast Services</li>
            <li>✓ 100% Commitment-Free</li>
          </ul>
          <button className="get-started-button">Get started now!</button>
        </div>
        <div className="image-container">
          <img
            src={personpointing} // Replace with your image URL
            alt="Person pointing"
            className="person-image"
          />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-left">
            <h3>Mziya.DARI</h3>
            <p>
              Mziya is your one and only destination for finding a job<br /> in
              HomeServices, and getting yourself workers too!
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
      </footer>
    </div>
  );
};

export default HomeService;
