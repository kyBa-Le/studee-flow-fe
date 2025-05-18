import React, { useEffect, useState } from "react";
import "./LearningJournal.css";
import { WeeklyGoal } from "./WeeklyGoal";
import { SelfStudy } from "./SelfStudy";
import { InClass } from "./InClass";
import { getAllWeek } from "../../../services/WeekService";

export function LearningJournalLayout({ children }) {
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [goalIndex, setGoalIndex] = useState(0);
  const [isSelf, setIsSelf] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weekResponse = await getAllWeek();
        setSelectedWeek(weekResponse.data);

      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchData();
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

  const changeLayout = (isSelfStudy) => {
    setIsSelf(isSelfStudy);
  };

  return (
    <div className="learning-journal-container">
      <form className="learning-journal" onSubmit={handleSubmit}>
        <div className="learning-journal-headerr">
          <div className="learning-journal-week-selector">
            <select
              defaultValue={selectedWeek[0]?.week || ""}>
              {selectedWeek.map((week) => (
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
              <h2
                className="learning-journal-title"
                style={{ paddingTop: "20px" }}
              >
                Weekly Goal
              </h2>
            </div>
          </div>

          <div className="learning-journal-goal-section">
            <div
              className="learning-journal-goals-row"
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <i
                className="bi bi-chevron-compact-left"
                style={{ fontSize: 15, cursor: "pointer" }}
                onClick={handlePrev}
              ></i>

              {<WeeklyGoal goals={goals} goalIndex={goalIndex} />}

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
                onClick={() => changeLayout(false)}
                type="button"
                className={`learning-journal-tab ${
                  !isSelf ? "active" : "inactive"
                }`}
              >
                Classroom
              </button>
              <button
                onClick={() => changeLayout(true)}
                type="button"
                className={`learning-journal-tab ${
                  isSelf ? "active" : "inactive"
                }`}
              >
                Self study
              </button>
            </div>
            <h2 className="learning-journal-title">Learning Journal</h2>
            <h2 className="learning-journal-titles">
              Week 1: 16/02/2025 - 23/02/2025
            </h2>
          </div>
          <div className="learning-journal-table-container">
            {isSelf === true ? <SelfStudy /> : <InClass />}
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
