import { useEffect, useState } from "react";
import { getWeeklyGoals, updateWeeklyGoal } from "../../../services/WeeklyGoalService";
import { toast, ToastContainer } from "react-toastify";

export function WeeklyGoal({ weekId }) {

  const [goalIndex, setGoalIndex] = useState(0);
  const [weeklyGoals, setWeeklyGoals] = useState([]);

  //get the weekly goals of the current week
  useEffect(() => {
    if (!weekId) return;
    getWeeklyGoals(weekId)
      .then((data) => {
        console.log("Weekly goals:", data);
        setWeeklyGoals(data.data);
      })
      .catch(console.error);
  }, [weekId]);

  // handle button to change the slide
  const handlePrev = () => {
    setGoalIndex((prev) => Math.max(prev - 1, 0));
  };

  // hanle button to change the slide
  const handleNext = () => {
    setGoalIndex((prev) => Math.min(prev + 1, weeklyGoals.length - 3));
  };

  return (
    <div
      className="learning-journal-goals-row"
      style={{ display: "flex", alignItems: "center", gap: 16 }}
    >
      <i
        className="bi bi-chevron-compact-left"
        style={{ fontSize: 15, cursor: "pointer" }}
        onClick={handlePrev}
      ></i>
      <div className="learning-journal-goals" style={{ flex: 1 }}>
        {weeklyGoals.slice(goalIndex, goalIndex + 3).map((goal) => (
          <WeeklyGoalForm goal={goal} />
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


// weekly goal form
export function WeeklyGoalForm({goal}) {

  const [formData, setFormData] = useState(goal);

  const handleOnChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateWeeklyGoal(formData.id, formData);
      toast.success(`Goal updated`);
    } catch (error) {
      toast.error("Goal update failed, please try again");
    }
  };

  return (
    <form onSubmit={handleSubmit}
      key={formData?.id}
      className="learning-journal-goal"
    >
      <input type="number" name="goal_id" style={{ display: 'none' }} aria-hidden="true" value={goal.id} />
      <input
        type="checkbox"
        name={`is_achieved`}
        checked={formData?.is_achieved === 1}
        onChange={handleOnChange}/>
      <input
        type="text"
        name={`goal`}
        value={formData?.goal || ""}
        onChange={handleOnChange}
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
  );
}
