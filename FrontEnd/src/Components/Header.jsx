import React from "react";
import "./../CSSFiles/Header.css";
import { Link, useNavigate } from "react-router-dom";
export const Header = () => (
  <header className="header">
    <div className="logo">Mziya.DARI</div>
    <nav className="nav">
      <button className="btn login">
        {" "}
        <Link className="nav-link text-white" to="/login">
          Log in
        </Link>
      </button>
      <button className="btn signup">
        {" "}
        <Link className="nav-link text-white" to="/signup">
          Sign up
        </Link>
      </button>
    </nav>
  </header>
);
