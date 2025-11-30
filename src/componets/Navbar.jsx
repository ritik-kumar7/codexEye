import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Css/NavBar.css';
import { CodeBracketSquareIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src="/logo-bgRemove.png" alt="CodexEye Logo" className="logo-icon" />
          <span>CodexEye</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/code-review" className={`nav-link ${location.pathname === '/code-review' ? 'active' : ''}`}>Code Review</Link>
        </div>

        <div className="nav-actions">
          {/* <button className="btn-signin">Sign In</button> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
