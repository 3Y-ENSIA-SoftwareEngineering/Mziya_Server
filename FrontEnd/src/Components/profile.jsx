import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Navbar } from "./NavBar.jsx";
// import { supabase } from '../supabaseClient.js';
export const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "John", // Set initial value for display
    lastName: "Doe", // Set initial value for display
    email: "john.doe@example.com", // Set initial value for display
    location: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePic, setProfilePic] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted", formData);
  };

  return (
    <div>
      <Navbar />
      <div style={{ margin: "4vw" }}>
        <div className="row">
          {/* Profile Info Section */}
          <div className="col-lg-6">
            <h3 className="text-primary mb-4">My Infos:</h3>
            <div className="text-center mb-4 position-relative">
              <img
                src={profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-circle border"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              {/* File Input Label */}
              <label
                htmlFor="profile-pic"
                className="position-absolute"
                style={{
                  bottom: "0.05vh",
                  right: "0.03vw",
                  color: "#fff",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "10vw",
                  height: "10vh",
                }}
              >
                <span role="img" aria-label="Camera">
                  📷
                </span>
              </label>
              <input
                type="file"
                id="profile-pic"
                name="profile-pic"
                className="d-none"
                onChange={handleProfilePicChange}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <div className="border p-2 rounded">
                  <span>{formData.firstName}</span>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <div className="border p-2 rounded">
                  <span>{formData.lastName}</span>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="border p-2 rounded">
                <span>{formData.email}</span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <h4 className="text-primary mt-4">Change Password</h4>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            {/* Change Password Button */}
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: "2vh" }}
            >
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "rgba(20, 34, 87, 1)",
                  color: "#fff",
                  width: "20vw", // Adjust the width as needed
                  padding: "1.5vh 0.5vw", // Adjust padding if needed
                }}
              >
                Change Password
              </button>
            </div>
          </div>
          {/* Job Info Section */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h4 className="text-secondary">My Job Deals</h4>
              <div
                className="p-3 border rounded"
                style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
              >
                <p className="text-muted text-center">No deals yet</p>
              </div>
              <div
                className="p-3 border rounded"
                style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
              >
                <p className="text-muted text-center">No deals yet</p>
              </div>
              <div
                className="p-3 border rounded"
                style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
              >
                <p className="text-muted text-center">No deals yet</p>
              </div>
              {/* More job deal divs here */}
            </div>
            <div>
              <h4 className="text-secondary">My Job Offers</h4>
              <div
                className="p-3 border rounded"
                style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
              >
                <p className="text-muted text-center">No offers yet</p>
              </div>
              <div
                className="p-3 border rounded"
                style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
              >
                <p className="text-muted text-center">No offers yet</p>
              </div>
              <div
                className="p-3 border rounded"
                style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
              >
                <p className="text-muted text-center">No offers yet</p>
              </div>
              {/* More job offer divs here */}
            </div>
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: "2vh" }}
            >
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "rgba(20, 34, 87, 1)",
                  color: "#fff",
                  width: "20vw", // Adjust the width as needed
                  padding: "1.5vh 0.5vw", // Adjust padding if needed
                }}
              >
                Post Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
