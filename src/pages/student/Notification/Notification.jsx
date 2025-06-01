import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead } from '../../../services/NotificationService';
import { CancelButton } from '../../../components/ui/Button/Cancel/CancelButton';
import './Notification.css';
import NoNotification from "../../../assests/images/NoNotification.png";

const availableImages = [
  'https://anhnail.vn/wp-content/uploads/2024/10/meme-meo-khoc-2.webp',
  'https://dongvat.edu.vn/upload/2025/01/cute-meme-3.webp',
  'https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/meme-cute13-1725522340.jpg',
  'https://anhdep.edu.vn/upload/2024/05/bung-no-cam-xuc-voi-kho-anh-meme-cute-sieu-hai-huoc-dang-yeu-nhat-0.webp',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSlwFIH_N1h3Pm5REyWQuXhYUPj7KgoNGGow&s',
  'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/meme-meo-4.jpg',
  'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482552nnu/anh-mo-ta.png',
  'https://anhcute.net/wp-content/uploads/2024/10/Hinh-ve-meme-hai-huoc-de-thuong.jpg',
  'https://i.pinimg.com/736x/2d/af/5e/2daf5ec75cc3f6b948e2f6be27fd8508.jpg',
  'https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/meme-cute4-1725522368.jpg'
];

const NOTIFICATION_DETAILS = {
  1: {
    subject: 'IT English',
    deadline: '23:59, 15/12/2025',
    teacher: 'Ms. Nguyen Thi Lan',
    requirement: 'Complete exercises on pages 45–50'
  },
  2: {
    subject: 'Literature',
    deadline: '10/12/2025',
    teacher: 'Ms. Lan',
    requirement: 'Read chapter 3-5'
  },
  3: {
    subject: 'History',
    deadline: '18/12/2025',
    teacher: 'Mr. Hung',
    requirement: 'Revise part 2'
  },
  4: {
    subject: 'Physics',
    deadline: '05/12/2025 (Overdue)',
    teacher: 'Mr. Tuan',
    requirement: 'Complete lab report'
  }
};

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  return availableImages[randomIndex];
};

export function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? {...n, is_read: true} : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationDetails = (notificationId) => {
    return NOTIFICATION_DETAILS[notificationId] || {
      subject: 'General',
      deadline: 'N/A',
      teacher: 'N/A',
      requirement: 'N/A'
    };
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.is_read;
    if (activeFilter === 'deadline') return notification.type === 'deadline';
    if (activeFilter === 'feedback') return notification.type === 'feedback';
    return true;
  });

  return (
    <div className="notification-container">
      <div className="notification-main">
      <h2 className="notification-title">NOTIFICATIONS</h2>
      <hr />
      <div className="notification-filters">
        <button 
          className={`filter ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter ${activeFilter === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveFilter('unread')}
        >
          Unread
        </button>
        <button 
          className={`filter ${activeFilter === 'deadline' ? 'active' : ''}`}
          onClick={() => setActiveFilter('deadline')}
        >
          Deadline
        </button>
        <button 
          className={`filter ${activeFilter === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveFilter('feedback')}
        >
          Feedback
        </button>
      </div>
      <div className='notification-content'>
        <div className="notification-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div className={`notification-item ${!item.is_read ? 'unread' : ''}`} key={item.id}>
                <div className="notification-left">
                  {!item.is_read && <span className="orange-dot"></span>}
                  <div className="notification-text-content">
                    <h4 className="notification-title-item">{item.title}</h4>
                    <p className="notification-message">{item.content}</p>
                    <div className="notification-icon">
                      <img 
                        src={getRandomImage()} 
                        alt="Notification icon" 
                        style={{ width: '50px', height: '50px', borderRadius: '30px' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="notification-right">
                  <button 
                    className="notification-btn blue"
                    onClick={() => {
                      setSelectedNotification(item);
                      if (!item.is_read) {
                        handleMarkAsRead(item.id);
                      }
                    }}
                  >
                    View detail
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <p>No notifications found</p>
              <img src={NoNotification}></img>
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="notification-detail-modal">
          <div className="detail-modal-content">
            <div className="detail-modal-header">
              <h3>Notification details</h3>
            </div>
            
            <div className="detail-modal-body">
              <h4 className="detail-title">{selectedNotification.title}</h4>
              <p className="detail-message">{selectedNotification.content}</p>
              
              <div className="detail-info">
                <div className="detail-row">
                  <span className="detail-icon"><i className="fa-solid fa-book"></i></span>
                  <span className="detail-label">Subject:</span>
                  <span>{getNotificationDetails(selectedNotification.id).subject}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon"><i className="fa-solid fa-clock"></i></span>
                  <span className="detail-label">Deadline:</span>
                  <span>{getNotificationDetails(selectedNotification.id).deadline}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon"><i className="fa-solid fa-user"></i></span>
                  <span className="detail-label">Teacher:</span>
                  <span>{getNotificationDetails(selectedNotification.id).teacher}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon"><i className="fa-solid fa-file"></i></span>
                  <span className="detail-label">Requirement:</span>
                  <span>{getNotificationDetails(selectedNotification.id).requirement}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-modal-footer">
              <CancelButton
                className="detail-btn cancel"
                onClick={() => setSelectedNotification(null)}
              >
                Cancel
              </CancelButton>
              <button 
                className="actionButton GotoexciseClassButton"
                onClick={() => {
                  window.location.href = selectedNotification.link;
                }}
              >
                Go to exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}