import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Components/NavBar.jsx';
import Widget from "./../Components/Widget";
import Widget_Deal from "./../Components/Widget_Deal";
import profileImage from '../Components/images/profile.PNG';
import LogoutButton from '../Components/LogoutButton.jsx';
import jwtDecode from 'jwt-decode';



export const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    phoneNumber: '',
    profile_picture: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePic, setProfilePic] = useState(profileImage);
  const [message, setMessage] = useState(null);
  const [jobDeals, setJobDeals] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');



  const handleApplicationAction = async (offerId, workerId, action) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/jobOffers/${offerId}/applications/${workerId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      const data = await response.json();

      // Update the local state to reflect the changes
      setJobOffers(prevOffers => 
        prevOffers.map(offer => {
          if (offer.id === offerId) {
            return {
              ...offer,
              jobApplications: offer.jobApplications.map(app => {
                if (app.workerId === workerId) {
                  return {
                    ...app,
                    status: action === 'accept' ? 'accepted' : 'declined'
                  };
                }
                return app;
              })
            };
          }
          return offer;
        })
      );

      setMessage(`Application ${action}ed successfully`);
      setNotificationType('success');
      setShowNotification(true);
    } catch (err) {
      setError(`Failed to ${action} application: ${err.message}`);
      setNotificationType('error');
      setShowNotification(true);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from session storage
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Decode token to get user_id
        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
        } catch (err) {
          console.error('Token decode error:', err);
          navigate('/login');
          return;
        }

        const userResponse = await fetch('http://localhost:3000/api/profile/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setFormData({
          ...formData,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          location: userData.location,
          phoneNumber: userData.phone || '',
          profile_picture: userData.profile_picture || profileImage,
        });

        if (userData.profile_picture) {
          setProfilePic(userData.profile_picture);
        }

        // Fetch job deals and offers using the same token
        await Promise.all([
          fetchJobDeals(token),
          fetchJobOffers(token)
        ]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchJobDeals = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/profile/jobDeals', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job deals');
      }

      const data = await response.json();
      setJobDeals(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching job deals:', err);
    }
  };

  const fetchJobOffers = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/profile/jobOffers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job offers');
      }

      const data = await response.json();
      setJobOffers(data);
    } catch (err) {
      console.error('Error fetching job offers:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleProfileUpdate = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setNotificationType('success');
      } else {
        setError(data.message);
        setNotificationType('error');
      }
      setShowNotification(true);
    } catch (err) {
      setError('Error updating profile');
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  const handlePasswordChange = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setNotificationType('error');
      setShowNotification(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/profile/changePassword', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.password,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setNotificationType('success');
        setFormData(prev => ({
          ...prev,
          password: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        setError(data.message);
        setNotificationType('error');
      }
      setShowNotification(true);
    } catch (err) {
      setError('Error changing password');
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  const handleProfilePicUpload = async (event) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      setNotificationType('error');
      setShowNotification(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setNotificationType('error');
      setShowNotification(true);
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch('http://localhost:3000/api/profile/uploadProfilePic', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const data = await response.json();
      setProfilePic(data.imageUrl);
      setMessage('Profile picture updated successfully');
      setNotificationType('success');
      setShowNotification(true);
    } catch (err) {
      setError('Error uploading profile picture: ' + err.message);
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  



  return (
    

    <div className="min-h-screen bg-gray-50">
     
   
      <Navbar />
      <div style={{ margin: "4vw" }}>
        <div className="row">
          {/* Left Section: User Info */}
          <div className="col-lg-6 mb-4">
            <h3 className="text-primary mb-4">My Infos:</h3>
            <div className="text-center mb-4 position-relative">
            <img
              src={profilePic}
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
                onChange={handleProfilePicUpload}
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
              <div className="col-md-12 mb-3">
                <label className="form-label">Email</label>
                <div className="border p-2 rounded">
                  <span>{formData.email}</span>
                </div>
              </div>
            </div>
  
            {/* Profile Update Form */}
            <h4 className="mb-3">Update Your Info</h4>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="form-control"
              />
            </div>
            <button onClick={handleProfileUpdate} className="btn btn-primary mt-3">Update Profile</button>
  
            {/* Password Change Form */}
            <h4 className="mb-3">Change Your Password</h4>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="form-control"
              />
            </div>
            <button onClick={handlePasswordChange} className="btn btn-danger mt-3">Change Password</button>
          </div>
          
  
          {/* Right Section: Job Deals and Offers */}
          <div className="col-lg-6">
            {/* Job Deals */}
            <div className="mb-4">
              <h4 className="text-secondary">My Job Deals</h4>
              {jobDeals.length > 0 ? (
                <div className="space-y-3">
                  {jobDeals.map((deal, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded"
                      style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
                    >
                       <Widget
                      key={index}
                      category={deal.job.job_category}
                      description={deal.job.description}
                      status={deal.job.status}
                    />
                      {/* <p className="font-medium text-lg text-gray-800">{deal.jobs?.job_category}</p>
                      <p className="text-gray-600">{deal.jobs?.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Status: <span className="font-medium">{deal.status}</span>
                      </p> */}
                    </div>
                    

                  ))}
                
                </div>
              ) : (
                <div
                  className="p-3 border rounded"
                  style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}
                >
                  <p className="text-muted text-center">No deals yet</p>
                </div>
              )}
            </div>
  {/* Replace the existing Job Offers section with this code */}
<div>
  <h4 className="text-secondary">My Job Offers</h4>
  {jobOffers.length > 0 ? (
    <div className="space-y-3">
      {jobOffers.map((offer, index) => (
        <div key={index}>
          <Widget_Deal
            category={offer.job_category}
            description={offer.description}
            status={offer.status}
          />
          
          {/* Applications Section */}
          <div className="mt-3 mb-4">
            <h6 className="text-primary mb-3">Applications:</h6>
            
            {offer.jobApplications && offer.jobApplications.length > 0 ? (
              
              offer.jobApplications.map((application, appIndex) => (
                 // Log the application data
                <Widget_Deal
                  key={appIndex}
                  category={`Application from ${application.workerFirstName} ${application.workerLastName}`}
                  description={`Worker: ${application.workerFirstName}`} 
                  status={application.status || "Pending"}
                  onAccept={() => handleApplicationAction(offer.id, application.workerId, 'accept')}
                  onReject={() => handleApplicationAction(offer.id, application.workerId, 'decline')}
                />
              ))
            ) : (
              <div className="alert alert-info">
                No applications received yet.
              </div>
            )}
          </div>
        
        </div>
      ))}
    </div>
  ) : (
    <div className="p-3 border rounded" style={{ backgroundColor: "#e9ecef", marginTop: "2vh" }}>
      <p className="text-muted text-center">No offers yet</p>
    </div>
  )}
  <LogoutButton onLogout={handleLogout} />
</div>
          </div>
        </div>
      </div>
      {/* <Toast
      type={notificationType}
      message={notificationType === 'success' ? message : error}
      show={showNotification}
      onClose={() => setShowNotification(false)}
    /> */}
    </div>
  );
  
};

