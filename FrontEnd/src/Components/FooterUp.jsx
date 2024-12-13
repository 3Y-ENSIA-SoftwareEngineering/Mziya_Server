import React from "react";
import personpointing from "./images/person-pointing.png";
import "./../CSSFiles/footerUp.css";
export const FooterUp = () => {
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
    </div>
  );
};
