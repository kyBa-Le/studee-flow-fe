import React, { useState } from "react";
import "./SelfStudy.css";
import { WeeklyGoal } from "./WeeklyGoal";
import { SelfStudy } from "./SelfStudy";
import { InClass } from "./InClass";

export function LearningJournalLayout({ children }) {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [isSelf, setIsSelf] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
  };

  const changeLayout = (isSelfStudy) => {
    setIsSelf(isSelfStudy);
  };

  return (
    <div className="student-selfstudy-container">
      <div className="student-selfstudy" onSubmit={handleSubmit}>
        <div className="student-selfstudy-headerr">
          <div className="student-selfstudy-week-selector">
            <select
              name="week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="1">Week 1</option>
              <option value="2">Week 2</option>
              <option value="3">Week 3</option>
            </select>
            <i className="fa-solid fa-angle-down student-selfstudy-icon"></i>
          </div>
        </div>
        <div className="student-selfstudy-goal-content">
          <div className="student-selfstudy-header">
            <div className="student-selfstudy-title-wrapper">
              <h2
                className="student-selfstudy-title"
                style={{ paddingTop: "20px" }}
              >
                Weekly Goal
              </h2>
            </div>
          </div>

          <div className="student-selfstudy-goal-section">
            

              {<WeeklyGoal weekId={1} />}

              
          </div>

          <hr />
          <div className="student-selfstudy-header">
            <div className="student-selfstudy-tabs">
              <button
                onClick={() => changeLayout(false)}
                type="button"
                className={`student-selfstudy-tab ${
                  !isSelf ? "active" : "inactive"
                }`}
              >
                Classroom
              </button>
              <button
                onClick={() => changeLayout(true)}
                type="button"
                className={`student-selfstudy-tab ${
                  isSelf ? "active" : "inactive"
                }`}
              >
                Self study
              </button>
            </div>
            <h2 className="student-selfstudy-title">Learning Journal</h2>
            <h2 className="student-selfstudy-titles">
              Week 1: 16/02/2025 - 23/02/2025
            </h2>
          </div>
          <div className="student-selfstudy-table-container">
            {isSelf === true ? <SelfStudy /> : <InClass />}
          </div>
        </div>
        <div className="student-selfstudy-submit">
          <button type="submit" className="student-selfstudy-submit-btn">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
