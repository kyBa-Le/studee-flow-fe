import React, { useEffect, useState } from 'react';
import './TeacherHeader.css';
import Logo from "../../../assests/images/Logo.png";
import { getUser } from '../../../services/UserService';
import { Logout } from '../../../services/AuthService';
import { Link, useLocation, useNavigate } from "react-router-dom";

export function TeacherHeader() {
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
    { path: '/teacher/home', label: 'Classrooms' },
    { path: '/teacher/report', label: 'Report' },
  ];
  const handleLogout = () => {
      Logout(); 
      navigate('/login'); 
    };
  return (
    <div className='teacher-header-container'>
      <div className='teacher-header-content'>
        <Link to='/teacher/home' className='header-logo'>
          <img src={Logo} alt="Logo" />
        </Link>
        <ul className='header-navigate'>
          {navItems.map(item => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <div className='help-notification-icon'>
          <div className='profile-wrapper'>
            <div className='profile-header'>
              <img
                  className='profile-img-header'
                  src={user?.avatar_link || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                  alt="Avatar"
              />
              <div className='drop-down-option-profile-logout'>
                <div className='profile-img-name'>
                  <img
                    className='profile-img'
                    src={user?.avatar_link || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                    alt="Avatar"
                  />
                  <span className='profile-name'>{user?.full_name || 'teacher'}</span>
                </div>
                <hr/>
                <div className='drop-down-option-content'>
                  <Link to='/teacher/profile'><span className='drop-down-option drop-down-option-profile'><i className="fa-regular fa-user"></i> Profile</span></Link>
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
          <Link to='/teacher/notification' className={`notification-link ${location.pathname === '/teacher/notification' ? 'active' : ''}`}>
              <i className="fa-regular fa-bell"></i>
          </Link>     
        </div>
      </div>
    </div>
  );
}