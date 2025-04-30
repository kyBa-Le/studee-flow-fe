import React from 'react';
import './StudentHeader.css';
import Logo from "../../../assests/images/Logo.png";

function StudentHeader() {
  return (
    <div className='student-header-container'>
      <div className='student-header-content'>
        <div className='header-logo'>
          <img src={Logo} alt="Logo" />
        </div>
        <ul className='header-navigation'>
          <li>Home</li>
          <li>Classroom</li>
          <li>Profile</li>
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
