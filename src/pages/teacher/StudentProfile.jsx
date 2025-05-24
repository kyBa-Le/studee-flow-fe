import React, { useEffect, useState, useRef, use } from 'react';
import "./StudentProfile.css";
import Schedule from '../../components/ui/Schedule/Schedule.tsx';
import { getStudentById } from '../../services/UserService';
import {Achievement} from '../../components/ui/Achievement/Achievement.jsx';
import { getAchievementByStudentId } from '../../services/AchievementService'; 
export function StudentProfile({ studentId = 1 }) {
    const [achievements, setAchievements] = useState([]);
     const [student, setStudent] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentResponse = await getStudentById(studentId);
                setStudent(studentResponse.data);
                console.log(studentResponse.data)
                const achievementsResponse = await getAchievementByStudentId(studentId);
                setAchievements(achievementsResponse.data);
                console.log(achievementsResponse.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [studentId]);

  return (
    <div className="student-profile-container">
      <div className="student-profile">
        <div className="student-profile-header-row">
          <button className="student-profile-back-btn">
            <i className="fa-solid fa-circle-arrow-left"></i>
          </button>
          <h2 className="student-profile-title">STUDENT PROFILE</h2>
        </div>
        <div className="student-profile-card">
          <div className="student-profile-image">
            <img src={student.avatar_link ?? "https://example.com/default-avatar.png"} alt="Avatar" />
          </div>
          <hr />
          <div className="student-profile-section-title">
            <span role="img" aria-label="clipboard">
              <i class="fa-solid fa-book"></i>
            </span>{" "}
            General Information
          </div>
          <div className="student-profile-info">
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                value={student?.full_name || "Student"}
                readOnly
              />
            </div>
            <div className="row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <input id="gender" type="text" value={student?.gender || "Female"} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="text"
                  value={student?.email || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="student-profile-section-title">
            <span role="img" aria-label="clipboard">
             <i class="fa-regular fa-calendar"></i>
            </span>{" "}
            Timetable
          </div>
          <div className='student-profile-time-table'>
            <div className='student-profile-time-table-content'>
                <Schedule/>
            </div>
          </div>
          <hr />
            <Achievement achievements={achievements} />
        </div>
      </div>
    </div>
  );
}
