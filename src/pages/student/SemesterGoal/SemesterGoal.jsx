import React, { useEffect, useState } from 'react';
import {getAllSubjects} from '../../../services/SubjectService';
import './SemesterGoal.css';

export function SemesterGoal() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("4");


      useEffect(() => {
        const fetchSubjects = async () => {
        try {
            const response = await getAllSubjects(); 
            setSubjects(response); 
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
        }
        };
    
        fetchSubjects();
      }, []);

 return (
    <div className="semester-goal-container">
        <div className="semester-goal">
            <div className="semester-goal-btn">
                <select
                    className="semester-goal-btn-select"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                </select>
                </div>
            <div className="semester-goal-content">
                <div className="semester-goal-content-in">
                     <div className="semester-goal-header">
                        <p><strong>Semester goal:</strong><br />
                        What do I expect from the course and my teachers?<br />
                        At the end of this semester, what exactly would I like to be able to do in the language?</p>
                    </div>
                    <div className="semester-goal-title">Semester 4</div>
                    <div className="semester-goal-table">
                        <div className="semester-goal-row header-row">
                            <div className="semester-goal-cell title"></div>
                            <div className="semester-goal-cell">What I expect from the teacher & instructor</div>
                            <div className="semester-goal-cell">What I expect from the course</div>
                            <div className="semester-goal-cell">What I expect from myself</div>
                        </div>
                        {subjects.map((cls, index) => (
                            <div key={index} className="semester-goal-row">
                            <div className="semester-goal-cell title">{cls.subject_name}</div>
                            <div className="semester-goal-cell">
                                <textarea placeholder="Enter expectation for teacher" />
                            </div>
                            <div className="semester-goal-cell">
                                <textarea placeholder="Enter expectation for course" />
                            </div>
                            <div className="semester-goal-cell">
                                <textarea placeholder="Enter expectation for yourself" />
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="semester-goal-btn">
                 <button type="button" className="semester-goal-btn-submit">Submit</button>
            </div>
        </div>
    </div>
  );
}
