import { useEffect, useState } from "react";
import "./LearningJournal.css";
import { WeeklyGoal } from "./WeeklyGoal";
import { SelfStudy } from "./SelfStudy";
import { InClass } from "./InClass";
import { getAllWeek } from "../../../services/WeekService";
import { useParams } from "react-router-dom";

export function LearningJournalLayout() {
  const [weeks, setWeeks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState({});
  const [isSelfStudy, setIsSelfStudy] = useState(false);
  const { studentId } = useParams();


  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const response = await getAllWeek();
        const weekData = response.data.sort((a, b) => new Date(a.end_date) - new Date(b.end_date)) || [];
        setWeeks(weekData);

        if (weekData.length > 0) {
          setCurrentWeek(weekData[weekData.length - 1]);
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
          {studentId && <button className="student-profile-back-btn" onClick={() => window.history.back()}>
            <i className="fa-solid fa-circle-arrow-left"></i>
          </button>}
          <div></div>
          <div className="learning-journal-week-selector">
            <select
              value={weeks.findIndex(w => w.week === currentWeek.week)}
              onChange={(e) => {
                const selectedIndex = parseInt(e.target.value);
                const selectedWeek = weeks[selectedIndex];
                setCurrentWeek(selectedWeek);
              }}
            >
              {weeks.map((week, index) => (
                <option key={week.id} value={index}>
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

            <WeeklyGoal weekId={currentWeek.id} />

          </div>

          <hr />

          <div className="learning-journal-header">
            <div className="learning-journal-tabs">
              <button
                type="button"
                onClick={() => setIsSelfStudy(false)}
                className={`learning-journal-tab left ${!isSelfStudy ? "active" : "inactive"}`}
              >
                Classroom
              </button>
              <button
                type="button"
                onClick={() => setIsSelfStudy(true)}
                className={`learning-journal-tab right ${isSelfStudy ? "active" : "inactive"}`}
              >
                Self Study
              </button>
            </div>

            <h2 className="learning-journal-title">Learning Journal</h2>
            <div>
              <b>Week {currentWeek?.week}</b>: {currentWeek?.start_date} - {currentWeek?.end_date}
            </div>
          </div>

          <div className="learning-journal-table-container">
            {isSelfStudy ? <SelfStudy weekId={currentWeek.id} /> : <InClass weekId={currentWeek.id} />}
          </div>
        </div>

        <div className="learning-journal-submit">
          {
            !studentId && <button type="submit" className="learning-journal-submit-btn">
              Submit
            </button>
          }
        </div>
      </div>
    </div>
  );
}
