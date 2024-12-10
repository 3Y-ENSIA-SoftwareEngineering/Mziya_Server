import React from "react";
import "./Header.css";
const Header = () => (
  <header className="header">
    <div className="logo">Mziya.DARI</div>
    <nav className="nav">
      <button className="btn login">Log in</button>
      <button className="btn signup">Sign up</button>
    </nav>
  </header>
);

export default Header;
