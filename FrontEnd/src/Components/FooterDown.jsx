import React from "react";
import "./../CSSFiles/footerDown.css";

export const FooterDown = () => {
  return (
    <footer className="footer-section">
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
    </footer>
  );
};
