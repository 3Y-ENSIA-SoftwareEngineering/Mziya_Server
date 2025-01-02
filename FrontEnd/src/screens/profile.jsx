import React, { useState } from "react";
import { Navbar } from "./../Components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";

export const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    location: "New York, USA",
    newPassword: "",
    currentPassword: "",
    confirmPassword: "",
  });

  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150"
  );

  const jobDeals = [
    {
      id: 1,
      jobs: {
        job_category: "Design",
        description: "Logo Design for a startup",
      },
      status: "Completed",
    },
    {
      id: 2,
      jobs: {
        job_category: "Development",
        description: "Build a React website",
      },
      status: "In Progress",
    },
  ];

  const jobOffers = [
    {
      id: 1,
      job_category: "Writing",
      description: "Content writing for a blog",
      status: "Pending",
    },
    {
      id: 2,
      job_category: "Marketing",
      description: "Social media campaign",
      status: "Accepted",
    },
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
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
                src={profilePic}
                alt="Profile"
                className="rounded-circle border"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <label htmlFor="profile-pic" className="position-absolute">
                <span role="img" aria-label="Camera">
                  📷
                </span>
              </label>
              <input
                type="file"
                id="profile-pic"
                accept="image/*"
                className="d-none"
                onChange={handleProfilePicChange}
              />
            </div>

            {/* User Info Display */}
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

            {/* Password Change Form */}
            <form onSubmit={handlePasswordChange}>
              <h4 className="text-primary mt-4">Change Password</h4>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="form-control"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "rgba(20, 34, 87, 1)",
                  color: "#fff",
                  width: "20vw",
                  padding: "1.5vh 0.5vw",
                }}
              >
                Change Password
              </button>
            </form>
          </div>

          {/* Job Info Section */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h4 className="text-secondary">My Job Deals</h4>
              {jobDeals.length > 0 ? (
                jobDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3 border rounded"
                    style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
                  >
                    <p>Category: {deal.jobs.job_category}</p>
                    <p>Description: {deal.jobs.description}</p>
                    <p>Status: {deal.status}</p>
                  </div>
                ))
              ) : (
                <div
                  className="p-3 border rounded"
                  style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
                >
                  <p className="text-muted text-center">No deals yet</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-secondary">My Job Offers</h4>
              {jobOffers.length > 0 ? (
                jobOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-3 border rounded"
                    style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
                  >
                    <p>Category: {offer.job_category}</p>
                    <p>Description: {offer.description}</p>
                    <p>Status: {offer.status}</p>
                  </div>
                ))
              ) : (
                <div
                  className="p-3 border rounded"
                  style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
                >
                  <p className="text-muted text-center">No offers yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
