import { useEffect, useState } from "react";
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


  return (
    <div className="learning-journal-container">
      <div className="learning-journal">
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

          <div className="learning-journal-goal-section">

              <WeeklyGoal weekId={1} goalIndex={goalIndex} />

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
      </div>
    </div>
  );
}
