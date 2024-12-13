import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => (
  <header 
    className="d-flex justify-content-between align-items-center w-100 px-4 py-3" 
    style={{ 
      backgroundColor: 'rgba(20, 34, 87, 1)', 
      color: '#fff' 
    }}
  >
    <div 
      className="fs-4 fw-bold" 
      style={{ color: '#fff' }}
    >
      Mziya.DARI
    </div>
    <nav className="d-flex gap-3">
      <Link 
        to="/login" 
        className="btn btn-outline-light"
      >
        Log in
      </Link>
      <Link 
        to="/signup" 
        className="btn" 
        style={{ 
          backgroundColor: 'rgba(21, 178, 245, 1)', 
          color: '#fff' 
        }}
      >
        Sign up
      </Link>
    </nav>
  </header>
);