import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient.js';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "./NavBar.jsx";

export const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', location: '' });
  const [jobDeals, setJobDeals] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchJobDeals();
    fetchJobOffers();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not found');

      // Fetch user details from your users table
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      // Clear password fields and show success message
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      alert('Password updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrl })
        .eq('id', (await supabase.auth.getUser()).data.user.id);

      if (updateError) throw updateError;

      setProfilePic(publicUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError(error.message);
    }
        .select('name, email, address')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Assuming name is stored as "firstName lastName"
      const [firstName, lastName] = (data.name || '').split(' ');
      
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: data.email,
        location: data.address || ''
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch job contracts where the user is either the worker or home owner
      const { data, error } = await supabase
        .from('job_contract')
        .select(`
          *,
          jobs:job_id(description, job_category),
          worker:user_worker_id(name),
          home_owner:user_home_owner_id(name)
        `)
        .or(`user_worker_id.eq.${user.id},user_home_owner_id.eq.${user.id}`);

      if (error) throw error;
      setJobDeals(data);
    } catch (error) {
      console.error('Error fetching job deals:', error);
    }
  };

  const fetchJobOffers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch jobs posted by the user
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('home_owner_id', user.id);

      if (error) throw error;
      setJobOffers(data);
    } catch (error) {
      console.error('Error fetching job offers:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      // Clear password fields and show success message
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      alert('Password updated successfully!');
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrl })
        .eq('id', (await supabase.auth.getUser()).data.user.id);

      if (updateError) throw updateError;

      setProfilePic(publicUrl);
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
              {/* New Password fields... */}
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
