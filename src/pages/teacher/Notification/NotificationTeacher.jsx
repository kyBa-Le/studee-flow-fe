import React, { useState, useEffect } from 'react';
import { customGetToken, getNotifications, markNotificationAsRead } from '../../../services/NotificationService';
import { CancelButton } from '../../../components/ui/Button/Cancel/CancelButton';
import './NotificationTeacher.css';
import NoNotification from "../../../assests/images/NoNotification.png";
import { onMessage } from 'firebase/messaging';
import { messaging } from '../../../services/firebase';

const NOTIFICATION_DETAILS = {
  5: {
    subject: "IT English",
    deadline: "23:59, 15/12/2025",
    student: "Nguyen Van A"
  },
  6: {
    subject: "Speaking",
    deadline: "10/12/2025",
    student: "Tran Thi B"
  },
  7: {
    subject: "History",
    deadline: "18/12/2025",
    student: "Mr. Tuan"
  },
  8: {
    subject: "Physics",
    deadline: "05/12/2025 (Overdue)",
    student: "Le Van C"
  }
};

export function NotificationTeacher() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    customGetToken();
        onMessage(messaging, (payload) => {
          setNotifications((prev) => [payload.data, ...prev]);
        })
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
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationDetails = (notificationId) => {
    return NOTIFICATION_DETAILS[notificationId] || {
      subject: 'General',
      deadline: 'N/A',
      student: 'N/A'
    };
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.is_read;
    if (activeFilter === 'question') return notification.type === 'question';
    if (activeFilter === 'reminder') return notification.type === 'reminder';
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
            className={`filter ${activeFilter === 'question' ? 'active' : ''}`}
            onClick={() => setActiveFilter('question')}
          >
            Question
          </button>
          <button 
            className={`filter ${activeFilter === 'reminder' ? 'active' : ''}`}
            onClick={() => setActiveFilter('reminder')}
          >
            Reminder
          </button>
        </div>

        <div className="notification-content">
          <div className="notification-list">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <div 
                  className={`notification-item ${!item.is_read ? 'unread' : ''}`} 
                  key={item.id}
                >
                  <div className="notification-left" onClick={() => {
                    setSelectedNotification(item);
                    if (!item.is_read) handleMarkAsRead(item.id);
                  }}>
                    {!item.is_read && <span className="orange-dot"></span>}
                    <div className="notification-text-content">
                      <h4 className="notification-title-item">{item.title}</h4>
                      <p className="notification-message">{item.content}</p>
                    </div>
                  </div>
                  <div className="notification-right">
                    <button 
                      className="notification-btn blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotification(item);
                        if (!item.is_read) handleMarkAsRead(item.id);
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
                <img src={NoNotification} alt="No notifications" />
              </div>
            )}
          </div>
        </div>

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
                    <span className="detail-label">Student:</span>
                    <span>{getNotificationDetails(selectedNotification.id).student}</span>
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
                    if (selectedNotification.link) {
                      window.location.href = selectedNotification.link;
                    }
                  }}
                >
                  Check
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
