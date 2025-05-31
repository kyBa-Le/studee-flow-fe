import React from 'react';
import './StudentComment.css';

export function StudentComment() {
    return (
        <div className='student-comment-container'>
            <div className='student-comment-content'>
                <div className='student-comment-info'>
                    <img
                    src="https://scontent.fdad1-1.fna.fbcdn.net/v/t39.30808-6/486454536_1878099446334401_1257763256559020178_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGwruZ-_Pm7P29ztpeeVLq7-63-8EkXrT77rf7wSRetPgfdMEuFVoQb69RxW2i-Ka3DOF98WX5V5OYsrnTRvu0A&_nc_ohc=1qQnqFob7VkQ7kNvwHQkzC5&_nc_oc=AdkYDUQ9qyASuLmZWIYzrUiWKLXTXVMofA-nmTWQQmqOl2480nVst-JVsn4XQvvcIDI&_nc_zt=23&_nc_ht=scontent.fdad1-1.fna&_nc_gid=U4jhB8RBa3RJ1tLPubgt4Q&oh=00_AfI_KQFhIqzifzdwifTf16SetTbV1kwM1MM6IYHn39eI1w&oe=683EF0ED"
                    alt="Avatar"
                    className="avatar"
                    />
                    <span className="username">Hồ Thị Tiếp</span>
                </div>
                <input
                    type="text"
                    placeholder="Comment or add others with @"
                    className="comment-input"
                />
                <div className='student-comment-button-group'>
                    <button className="student-comment-btn student-comment-btn-cancel">Cancel</button>
                    <button className="student-comment-btn student-comment-btn-submit">Comment</button>
                </div>
            </div>
        </div>
    );
};

 