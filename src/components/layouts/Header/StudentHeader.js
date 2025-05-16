import React, { useEffect, useState } from 'react';
import './StudentHeader.css';
import Logo from "../../../assests/images/Logo.png";
import { getUser } from '../../../services/UserService';
import { Link } from "react-router-dom";

function StudentHeader() {
    const [user, setUser] = useState({});
  
    useEffect(() => {
      getUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(error => console.error('Error fetching User:', error));
    }, []);

  return (
    <div className='student-header-container'>
      <div className='student-header-content'>
        <Link to='/student/home' className='header-logo'>
          <img src={Logo} alt="Logo" />
        </Link>
        <ul className='header-navigation'>
          <li><Link to='/student/home'>Home</Link></li>
          <li><Link to='/student/learning-journal'>Learning journal</Link></li>
          <li><Link to='/student/semester-goal'>Semester goal</Link></li>
          <li><Link to='/student/achievement'>Achievement</Link></li>
        </ul>
        <div className='help-notification-icon'>
          <div className='profile-wrapper'>
            <div className='profile-header'>
              <img className='profile-img-header' src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" alt='profile'/>
              <div className='drop-down-option-profile-logout'>
                <div className='profile-img-name'>
                  <img className='profile-img' src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" alt='profile'/>
                  <span className='profile-name'>{user?.full_name || 'Student'}</span>
                </div>
                <hr/>
                <div className='drop-down-option-content'>
                  <Link to='/student/profile'><span className='drop-down-option drop-down-option-profile'><i className="fa-regular fa-user"></i> Profile</span></Link>
                  <Link to='/student/log-out'><span className='drop-down-option drop-down-option-logout'><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</span></Link>
                </div>
              </div>
            </div>
          </div>
          <i className="fa-regular fa-circle-question"></i>
          <i class="fa-regular fa-bell"></i>        
        </div>
      </div>
    </div>
  );
}

export default StudentHeader;
