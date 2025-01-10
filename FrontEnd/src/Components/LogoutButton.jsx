import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    // Your logout logic here
    console.log('User logged out!');
    alert('You have been logged out.');
    // For example, you might clear local storage and redirect
    localStorage.clear();
    window.location.href = '/login'; // Redirect to login or another page
  };

  return (
    <div className="text-center mt-3">
      <button 
        className="btn btn-danger btn-lg" 
        onClick={handleLogout}
        aria-label="Logout Button"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
