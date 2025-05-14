import React, { useEffect, useState } from 'react';
import './SemesterGoal.css';

export function SemesterGoal() {
 return (
    <div className="semester-goal-container">
        <div className="semester-goal">
            <div className="semester-goal-content">
                <div className="semester-goal-header">
                    <p><strong>Semester goal:</strong><br />
                    What do I expect from the course and my teachers?<br />
                    At the end of this semester, what exactly would I like to be able to do in the language?</p>
                </div>
                <div className="semester-goal-title">Semester 4</div>
                <div className="semester-goal-table">
                    <div className="semester-goal-row header-row">
                    <div className="semester-goal-cell title"></div>
                    <div className="semester-goal-cell">IT ENGLISH 2</div>
                    <div className="semester-goal-cell">TOEIC 1</div>
                    <div className="semester-goal-cell">Speaking</div>
                    </div>
                    <div className="semester-goal-row">
                    <div className="semester-goal-cell title">What I expect from the teacher & instructor</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    </div>
                    <div className="semester-goal-row">
                    <div className="semester-goal-cell title">What I expect from the course</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    </div>
                    <div className="semester-goal-row">
                    <div className="semester-goal-cell title">What I expect from myself</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    <div className="semester-goal-cell">Teacher are friendly and support of student</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
