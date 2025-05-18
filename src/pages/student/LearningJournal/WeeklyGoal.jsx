import { useEffect, useState } from "react";
import { getWeeklyGoals, updateWeeklyGoal } from "../../../services/WeeklyGoalService";
import { toast, ToastContainer } from "react-toastify";

export function WeeklyGoal({ weekId }) {

  const [goalIndex, setGoalIndex] = useState(0);
  const [currentWeekId, setCurrentWeekId] = useState(weekId);
  const [weeklyGoals, setWeeklyGoals] = useState([]);

  //get the weekly goals of the current week
  useEffect(() => {
    if (!currentWeekId) return;
    getWeeklyGoals(currentWeekId)
      .then((data) => {
        console.log("Weekly goals:", data);
        setWeeklyGoals(data.data);
      })
      .catch(console.error);
  }, [currentWeekId]);

  // hanle button to change the slide
  const handlePrev = () => {
    setGoalIndex((prev) => Math.max(prev - 1, 0));
  };

  // hanle button to change the slide
  const handleNext = () => {
    setGoalIndex((prev) => Math.min(prev + 1, weeklyGoals.length - 3));
  };

  // handle form when input the goal
  const handleGoalChange = (index, newGoalText) => {
    const updatedGoals = [...weeklyGoals];
    updatedGoals[index] = { ...updatedGoals[index], goal: newGoalText };
    setWeeklyGoals(updatedGoals);
  };

  const handleIsAchievedChange = (index, isChecked) => {
    const updatedGoals = [...weeklyGoals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      is_achieved: isChecked ? 1 : 0
    };
    setWeeklyGoals(updatedGoals);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      await updateWeeklyGoal(data.goal_id, { goal: data.goal, is_achieved: data.is_achieved });

      toast.success(`Goal updated`);
    } catch (error) {
      toast.error("Goal update failed, please try again");
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
            <input type="number" name="goal_id" style={{ display: 'none' }} aria-hidden="true" value={goal.id} />
            <input
              type="checkbox"
              name={`is_achieved`}
              checked={goal.is_achieved === 1}
              onChange={(e) => handleIsAchievedChange(index, e.target.checked)}
              id={`goal_${goalIndex + index}`} value={goal.is_achieved ? 1 : 0}
            />
            <input
              type="text"
              name={`goal`}
              id={`goal_${goalIndex + index}`}
              value={goal.goal || ""}
              onChange={(e) => handleGoalChange(goalIndex + index, e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: "#fff",
                fontSize: "14px",
              }}
            />
            <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
          </form>
        ))}
      </div>
      <i
        className="bi bi-chevron-compact-right"
        style={{ fontSize: 15, cursor: "pointer" }}
        onClick={handleNext}
      ></i>
      <ToastContainer />
    </div>
  );
}
