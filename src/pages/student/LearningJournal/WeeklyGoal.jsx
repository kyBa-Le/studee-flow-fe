import React, { useEffect, useState } from "react";
import { getWeeklyGoals, updateWeeklyGoal } from "../../../services/WeeklyGoalService";
import { getWeeks } from "../../../services/WeekService";

export function WeeklyGoal({ weekId }) {
  const [goalIndex, setGoalIndex] = useState(0);

  // const [currentWeekId, setCurrentWeekId] = useState(weekId);
  const [weeklyGoals, setWeeklyGoals] = useState([]);

  // useEffect(() => {
  //   getWeeks()
  //     .then((data) => {
  //       setWeeks(data);
  //       if (data.length > 0) {
  //         setCurrentWeekId(data[0].id);
  //       }
  //     })
  //     .catch(console.error);
  // }, []);

  useEffect(() => {
    if (!currentWeekId) return;
    getWeeklyGoals(currentWeekId)
      .then((data) => {
        console.log("Weekly goals:", data);
        setWeeklyGoals(data);
      })
      .catch(console.error);
  }, [currentWeekId]);

  const handlePrev = () => {
    setGoalIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setGoalIndex((prev) => Math.min(prev + 1, goals.length - 3));
  };

  const handleGoalChange = (index, newGoalText) => {
    const updatedGoals = [...weeklyGoals];
    updatedGoals[index] = { ...updatedGoals[index], goal: newGoalText };
    setWeeklyGoals(updatedGoals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalToUpdate = weeklyGoals[acruateIndex];
      await updateWeeklyGoal(goalToUpdate.id, { goal: goalToUpdate.goal });
      console.log("Goal updated!");
    } catch (error) {
      console.error("Failed to update goal", error);
    }
  };

  return (
    <div
      className="student-selfstudy-goals-row"
      style={{ display: "flex", alignItems: "center", gap: 16 }}
    >
      <i
        className="bi bi-chevron-compact-left"
        style={{ fontSize: 15, cursor: "pointer" }}
        onClick={handlePrev}
      ></i>
      <div className="student-selfstudy-goals" style={{ flex: 1 }}>
        {weeklyGoals.slice(goalIndex, goalIndex + 3).map((goal, index) => (
          <form onSubmit={handleSubmit}
            key={goal.id}
            className="student-selfstudy-goal"
          >
            <input
              type="checkbox"
              name={`goal_${goalIndex + index}`}
              id={`goal_${goalIndex + index}`}
            />
            <input
              type="text"
              name={`goal_${goalIndex + index}`}
              id={`goal_${goalIndex + index}`}
              value={goal.goal || ""}
              onChange={(e) => handleGoalChange(goalIndex + index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </form>
        ))}
      </div>
      <i
        className="bi bi-chevron-compact-right"
        style={{ fontSize: 15, cursor: "pointer" }}
        onClick={handleNext}
      ></i>
    </div>
  );
}
