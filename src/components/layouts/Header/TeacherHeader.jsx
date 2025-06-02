import React, { useCallback, useEffect, useState } from 'react';
import './TeacherHeader.css';
import Logo from "../../../assests/images/Logo.png";
import { getUser } from '../../../services/UserService';
import { Logout } from '../../../services/AuthService';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { customGetToken } from '../../../services/NotificationService';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../../../services/firebase';

export function TeacherHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const location = useLocation();
  const [isHasNewNotification, setIsHasNewNotification] = useState(false);
  const isOnNotificationPage = location.pathname === "/student/notification";

  // Tối ưu hóa useEffect cho notification
  useEffect(() => {
    if (isOnNotificationPage) return;
    let unsubscribe;

    const setupNotifications = async () => {
      try {
        await customGetToken();
        // Lắng nghe tin nhắn từ Firebase
        unsubscribe = onMessage(messaging, (payload) => {
          setIsHasNewNotification(true);

        });
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    setupNotifications();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching User:", error);
      }
    };

    fetchUser();
  }, []);

  const navItems = [
    { path: '/teacher/home', label: 'Classrooms' },
    { path: '/teacher/report', label: 'Report' },
  ];

  const handleLogout = () => {
    Logout();
    navigate('/login');
  };

  const handleNotificationClick = useCallback(() => {
    setIsHasNewNotification(false);
  }, []);

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
                <hr />
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
          <Link to='/teacher/notification' className={`notification-link ${location.pathname === '/teacher/notification' ? 'active' : ''}`} onClick={handleNotificationClick}>
            <div className="notification-icon-wrapper">
              <i
                className={`fa-regular fa-bell`}
              ></i>
              {isHasNewNotification && (
                <span className="notification-dot"></span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}