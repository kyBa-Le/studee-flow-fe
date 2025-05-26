import React, { useEffect, useState, useRef } from 'react';
import { getAchievement } from '../../../services/AchievementService'; 
import Banner from '../../../assests/images/Banner.png';
import SmileGreen from '../../../assests/images/smile_icon_green.png';
import SmileBlue from '../../../assests/images/smile_icon_blue.png';
import Schedule from '../../../components/ui/Schedule/Schedule.tsx';
import { getUser } from '../../../services/UserService';
import {Achievement} from '../../../components/ui/Achievement/Achievement.jsx';
import { Link} from "react-router-dom";
import "./Home.css";

function Home() {
  const [achievements, setAchievements] = useState([]);
  const [user, setUser] = useState({});
  
  useEffect(() => {
    getUser()
      .then(response => {
        setUser(response.data);
      })
      .catch(error => console.error('Error fetching User:', error));
    getAchievement()
      .then(response => {
        setAchievements(response.data);
      })
      .catch(error => console.error('Error fetching achievements:', error));
  }, []);

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
             <Link to='/student/semester-goal'><button className='banner-btn-goal'>LET'S MAKE YOUR GOALS</button></Link>
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
                <Schedule/>
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
                    <Link to='/student/learning-journal'><button className='goal-btn'>EDIT GOALS</button></Link>
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
              <Achievement achievements={achievements} />
            {/* End Achievements */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
