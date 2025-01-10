//Widget_Deal.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Widget_Deal = ({ category, description, status, onAccept, onReject }) => {
  // Determine the badge color based on the status
  const getBadgeClass = (status) => {
    switch (status) {
      case "Completed":
      case "Accepted":
        return "bg-success"; // Green
      case "Pending":
        return "bg-warning"; // Orange
      case "Rejected":
        return "bg-danger"; // Red
      case "In Progress":
        return "bg-primary"; // Blue
      default:
        return "bg-secondary"; // Gray (for unknown statuses)
    }
  };

  return (
    <div className="card shadow-sm mb-3 position-relative" style={{ width: '100%' }}>
      {/* Status Badge */}
      <span
        className={`badge position-absolute ${getBadgeClass(status)}`}
        style={{ top: '10px', right: '10px' }}
      >
        {status}
      </span>
      
      {/* Card Content */}
      <div className="card-body">
        <h6
          className="card-subtitle mb-2 text-muted"
          style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          Category: {category}
        </h6>
        <div className="mt-2">
          <strong>Description:</strong>
          <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{description}</p>
        </div>

        {/* Conditional Buttons */}
        {status === "Pending" && (
          <div className="mt-3 d-flex justify-content-end">
            <button
              className="btn btn-success me-2"
              onClick={onAccept}
            >
              Accept
            </button>
            <button
              className="btn btn-danger"
              onClick={onReject}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Widget_Deal;
