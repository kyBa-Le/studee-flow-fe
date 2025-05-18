import React, { useEffect, useState } from "react";
import "./LearningJournal.css";
import { WeeklyGoal } from "./WeeklyGoal";
import { SelfStudy } from "./SelfStudy";
import { InClass } from "./InClass";
import { getAllWeek } from "../../../services/WeekService";

export function LearningJournalLayout() {
  const [weeks, setWeeks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState("");
  const [goalIndex, setGoalIndex] = useState(0);
  const [isSelfStudy, setIsSelfStudy] = useState(true);

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const response = await getAllWeek();
        const weekData = response.data || [];
        setWeeks(weekData);
        if (weekData.length > 0) {
          setCurrentWeek(weekData[0].week);
        }
      } catch (error) {
        console.error("Error fetching weeks:", error);
      }
    };

    fetchWeeks();
  }, []);

  const goals = [
    "I can listen to the text and apply it to choose the answer in TOEIC.",
    "I can quickly identify and apply tenses.",
    "I can use passive and active voice in correct contexts.",
    "I can identify keywords in listening sections.",
    "I can summarize a short TOEIC paragraph.",
  ];

  const handlePrev = () => {
    setGoalIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setGoalIndex((prev) => Math.min(prev + 1, goals.length - 3));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
  };

  return (
    <div className="learning-journal-container">
      <form className="learning-journal" onSubmit={handleSubmit}>
        <div className="learning-journal-headerr">
          <div className="learning-journal-week-selector">
            <select
              value={currentWeek}
              onChange={(e) => setCurrentWeek(e.target.value)}
            >
              {weeks.map((week) => (
                <option key={week.id} value={week.week}>
                  Week {week.week}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down learning-journal-icon"></i>
          </div>
        </div>

        <div className="learning-journal-goal-content">
          <div className="learning-journal-header">
            <div className="learning-journal-title-wrapper">
              <h2 className="learning-journal-title" style={{ paddingTop: "20px" }}>
                Weekly Goal
              </h2>
            </div>
          </div>

          <div className="student-selfstudy-goal-section">
            <div
              className="student-selfstudy-goals-row"
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <i
                className="bi bi-chevron-compact-left"
                style={{ fontSize: 15, cursor: "pointer" }}
                onClick={handlePrev}
              ></i>

              <WeeklyGoal goals={goals} goalIndex={goalIndex} />

              <i
                className="bi bi-chevron-compact-right"
                style={{ fontSize: 15, cursor: "pointer" }}
                onClick={handleNext}
              ></i>
            </div>
          </div>

          <hr />

          <div className="learning-journal-header">
            <div className="learning-journal-tabs">
              <button
                type="button"
                onClick={() => setIsSelfStudy(false)}
                className={`learning-journal-tab ${!isSelfStudy ? "active" : "inactive"}`}
              >
                Classroom
              </button>
              <button
                type="button"
                onClick={() => setIsSelfStudy(true)}
                className={`learning-journal-tab ${isSelfStudy ? "active" : "inactive"}`}
              >
                Self Study
              </button>
            </div>

            <h2 className="learning-journal-title">Learning Journal</h2>
            {/* TODO: Dynamically load week range based on selected week */}
            <h2 className="learning-journal-titles">
              Week {currentWeek}: 16/02/2025 - 23/02/2025
            </h2>
          </div>

          <div className="learning-journal-table-container">
            {isSelfStudy ? <SelfStudy /> : <InClass />}
          </div>
        </div>

        <div className="learning-journal-submit">
          <button type="submit" className="learning-journal-submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
