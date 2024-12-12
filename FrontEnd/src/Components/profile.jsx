import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './NavBar.jsx';
import "bootstrap/dist/css/bootstrap.min.css";

export const Profile = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', location: '' });
  const [jobDeals, setJobDeals] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchJobDeals();
    fetchJobOffers();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user');
      setFormData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDeals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jobDeals');
      setJobDeals(response.data);
    } catch (error) {
      console.error('Error fetching job deals:', error);
    }
  };

  const fetchJobOffers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jobOffers');
      setJobOffers(response.data);
    } catch (error) {
      console.error('Error fetching job offers:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/changePassword', { newPassword: formData.newPassword, currentPassword: formData.currentPassword });
      alert(response.data.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/uploadProfilePic', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfilePic(response.data.publicUrl);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <label htmlFor="profile-pic" className="position-absolute">
                <span role="img" aria-label="Camera">📷</span>
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
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
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
      onChange={(e) => setFormData(prev => ({
        ...prev,
        newPassword: e.target.value
      }))}
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
      onChange={(e) => setFormData(prev => ({
        ...prev,
        confirmPassword: e.target.value
      }))}
      className="form-control"
      required
    />
    </div>
              {/* New Password fields... */}
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
                jobDeals.map(deal => (
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
                <div className="p-3 border rounded" style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}>
                  <p className="text-muted text-center">No deals yet</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-secondary">My Job Offers</h4>
              {jobOffers.length > 0 ? (
                jobOffers.map(offer => (
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
                <div className="p-3 border rounded" style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}>
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