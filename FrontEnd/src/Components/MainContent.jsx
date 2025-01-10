import React from "react";
import "./../CSSFiles/MainContent.css";
import doorRepair from "./images/door-repair.png";
import plumbingRepair from "./images/plumbing-repair.png";
import satisfactionicon from "./images/satisfaction-icon.png";
import joboffers from "./images/job-offers-icon.png";
import searchicon from "./images/search-icon.png";
import calendar from "./images/calendar-icon.png";
import { Link, useNavigate } from "react-router-dom";

export const MainContent = () => (
  <main className="main-content">
    <div className="image-container">
      <img src={doorRepair} alt="Door Repair" />
    </div>

    <div className="text-content">
      <p>Your platform towards easily found jobs, and trusted workers!</p>
      <h1>In need of a job OR a </h1>
      <h1>homeService in a </h1>
      <h1>record time?</h1>
      <h1> We got you!</h1>
      <button className="cta-button">
        <Link className="nav-link text-white" to="/signup">
          Get Started NOW!
        </Link>
      </button>

      {/* Features Section */}
      <div className="features">
        <div className="feature-item">
          <img src={satisfactionicon} alt="Satisfaction Guarantee" />
          <p>Satisfaction Guarantee</p>
        </div>
        <div className="feature-item">
          <img src={joboffers} alt="24H Job Offers" />
          <p>24H Job Offers</p>
        </div>
        <div className="feature-item">
          <img src={searchicon} alt="Search from Anywhere" />
          <p>Search from Anywhere</p>
        </div>
        <div className="feature-item">
          <img src={calendar} alt="Choose Date You Want" />
          <p>Choose the Date You Want</p>
        </div>
      </div>
    </div>

    <div className="image-container">
      <img src={plumbingRepair} alt="Plumbing Repair" />
    </div>
  </main>
);
