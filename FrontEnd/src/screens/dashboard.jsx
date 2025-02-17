import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "./../Components/NavBar";
import { FooterDown } from "./../Components/FooterDown";
import "bootstrap/dist/css/bootstrap.min.css";

export const Dashboard = () => {
  return (
    <div>
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: "70vh" }}
      >
        <Link to="/makepost">
          <button
            className="btn btn-lg btn-primary m-3"
            style={{ width: "250px" }}
          >
            Post a Job
          </button>
        </Link>

        <Link to="/findjob">
          <button
            className="btn btn-lg btn-secondary m-3"
            style={{ width: "250px" }}
          >
            Get a Job
          </button>
        </Link>
      </main>

     {/* Footer */}
     <FooterDown />
    </div>
  );
};

export default Dashboard;
