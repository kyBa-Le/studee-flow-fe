import React, { useEffect, useState } from 'react';
import './StudentHeader.css';
import Logo from "../../../assests/images/Logo.png";
import { getUser } from '../../../services/UserService';
import { Logout } from '../../../services/AuthService';
import { Link, useLocation, useNavigate } from "react-router-dom";

function StudentHeader() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const location = useLocation();
    
    useEffect(() => {
      getUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(error => console.error('Error fetching User:', error));
    }, []);

  const navItems = [
    { path: '/student/home', label: 'Home' },
    { path: '/student/learning-journal', label: 'Learning journal' },
    { path: '/student/semester-goal', label: 'Semester goal' },
    { path: '/student/achievement', label: 'Achievement' }
  ];
  const handleLogout = () => {
      Logout(); 
      navigate('/login'); 
    };
  return (
    <div className='student-header-container'>
      <div className='student-header-content'>
        <Link to='/student/home' className='header-logo'>
          <img src={Logo} alt="Logo" />
        </Link>
        <ul className='header-navigation'>
          {navItems.map(item => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
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
                  <Link to='#' onClick={handleLogout}>
                      <span className='drop-down-option drop-down-option-logout'>
                          <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                      </span>
                  </Link>
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
