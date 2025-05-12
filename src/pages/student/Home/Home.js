import React, { useEffect, useState, useRef } from 'react';
import { getAchievement } from '../../../services/AchievementService'; 
import Banner from '../../../assests/images/Banner.png';
import SmileGreen from '../../../assests/images/smile_icon_green.png';
import SmileBlue from '../../../assests/images/smile_icon_blue.png';
import Certificate from '../../../assests/images/Certificate.png';
import Scheduel from '../../../components/ui/Schedule/Schedule.tsx';
import { getUser } from '../../../services/UserService';
import "./Home.css";

function Home() {
  const [achievements, setAchievements] = useState([]);
  const carouselRef = useRef(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    getUser()
      .then(response => {
        setUser(response); 
      })
      .catch(error => console.error('Error fetching User:', error));
    getAchievement()
      .then(response => {
        setAchievements(response); 
      })
      .catch(error => console.error('Error fetching achievements:', error));
  }, []);

  useEffect(() => {
    if (carouselRef.current && window.bootstrap) {
      new window.bootstrap.Carousel(carouselRef.current, {
        interval: false, 
        ride: false     
      });
    }
  }, [achievements]);

  const chunkAchievements = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const achievementChunks = chunkAchievements(achievements, 4);

  return (
    <div className='student-home-container'>
      <div className='student-home-content'>
        {/* Banner */}
        <div className='student-banner'>
          <img className='banner-img' src={Banner} style={{ width: '100%', marginTop: '70px' }} alt='banner' />
          <div className='banner-content'>
            <p className='banner-title'>Welcome to StudeeFlow !</p>
            <p className='banner-text'>
              A platform that helps students track their learning journey, set clear goals, and visualize progress every <br /> step of the way.
            </p>
            <button className='banner-btn-goal'>LET'S MAKE YOUR GOALS</button>
          </div>
        </div>
        {/* Main content */}
        <div className='main-student-content-container'>
          <div className='main-student-content'>
            <div className='welcome-student'>
              <div className='welcome-student-title'>Welcome back, {user?.full_name || 'Student'}! 👋</div>
              <span className='welcome-student-text'>Let's check your progress today.</span>
            </div>
            {/* Time table */}
            <div className='time-table'>
              <div className='time-table-content'>
                <Scheduel/>
              </div>
            </div>
            <div className='nav-blog-student'>
              {/* Goals */}
              <div className='goal-blog'>
                <div className='blog-content goal-blog-content'>
                  <div className='blog-content-left goal-blog-left'>
                    <div className='blog-content-title goal-icon-title'>
                      <i className="fa-solid fa-bullseye"></i> Goals
                    </div>
                    <div className='blog-text-content goal-text-content'>Complete 5 chapters of Java OOP</div>
                    <button className='goal-btn'>EDIT GOALS</button>
                  </div>
                  <img className='goal-blog-right' src={SmileGreen} alt='Green Smile' />
                </div>
              </div>
              {/* Pending Tasks */}
              <div className='pending-task-blog'>
                <div className='blog-content pending-task-blog-content'>
                  <div className='blog-content-left pending-task-blog-left'>
                    <div className='blog-content-title pending-task-icon-title'>
                      <i className="fa-regular fa-clock"></i> Pending tasks
                    </div>
                    <div className='blog-text-content pending-task-text-content'>Submit journal by Friday</div>
                    <div className='blog-text-content pending-task-text-content'>Update study plan</div>
                  </div>
                  <img className='pending-task-blog-right' src={SmileBlue} alt='Blue Smile' />
                </div>
              </div>
            </div>
            {/* Achievements */}
            <div className='student-achievement'>
              <div className='student-achievement-content'>
                <div className='student-achievement-title'>
                  <i className="fa-solid fa-award"></i> Achievements
                </div>
                <div className='student-achievement-blog'>
                  <div id="carouselExampleControls" className="carousel slide" ref={carouselRef}>
                    {/* Left control */}
                    <button className="custom-carousel-control prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                      <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <div className="carousel-inner">
                      {achievementChunks.map((chunk, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                          <div className='achievement-row student-achievement-blog-content'>
                            {chunk.map((achievement, idx) => (
                              <div className='achievement-blog' key={idx}>
                                <img className='certificate-img' src={Certificate} alt="certificate" />
                                <div className='achievement-blog-right'>
                                  <div className='achievement-blog-right-top'>
                                    <div className='achievement-blog-right-title'>{achievement.title}</div>
                                    <div className='achievement-blog-right-text'>{achievement.content}</div>
                                    <div className='semester-subject'>Semester {achievement.semester}</div>
                                  </div>
                                  <button className='view-certificate-btn'>View Certificate</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Right control */}
                    <button className="custom-carousel-control next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                      <i className="fa-solid fa-angle-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End Achievements */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
