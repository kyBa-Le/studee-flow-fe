import React from 'react';
import './StudentHeader.css';
import Logo from "../../../assests/images/Logo.png";
import { Link } from "react-router-dom";

function StudentHeader() {
  return (
    <div className='student-header-container'>
      <div className='student-header-content'>
        <Link to='/student/home' className='header-logo'>
          <img src={Logo} alt="Logo" />
        </Link>
        <ul className='header-navigation'>
          <li><Link to='/student/home'>Home</Link></li>
          <li><Link to='/student/classroom'>Classroom</Link></li>
          <li><Link to='/student/profile'>Profile</Link></li>
        </ul>
        <div className='help-notification-icon'>
          <i className="fa-regular fa-circle-question"></i>
          <i class="fa-regular fa-bell"></i>        
        </div>
      </div>
    </div>
  );
}

export default StudentHeader;
