import React from 'react';
import './Service.css';

const Service = () => {
  return (
    <div className="service-container">
      <h2 className="service-title">Our Services</h2>
      <div className="service-items">
        <div className="service-item">
          <h3 className="service-item-title">Find Trusted Service Providers</h3>
          <p className="service-item-description">
            Easily browse and book verified service providers for home cleaning, plumbing, and electrical work. Enjoy a wide range of options and customized solutions to meet your needs.
          </p>
        </div>
        <div className="service-item">
          <h3 className="service-item-title">Seamless Job Postings for Homeowners</h3>
          <p className="service-item-description">
            Post job listings effortlessly, manage requests, and track applications from vetted service providers - all from a single platform.
          </p>
        </div>
        <div className="service-item2">
          <h3 className="service-item-title">Flexible Work Opportunities for Service Providers</h3>
          <p className="service-item-description">
            Skilled professionals can create profiles, find job opportunities, and connect with homeowners for part-time or full-time work.
          </p>
        </div>
        <div className="service-item2">
          <h3 className="service-item-title">Secure Payments and Transparent Transactions</h3>
          <p className="service-item-description">
            Our secure payment system ensures all transactions are handled safely, promoting trust and accountability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Service;