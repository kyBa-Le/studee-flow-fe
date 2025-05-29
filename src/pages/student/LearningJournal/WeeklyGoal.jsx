import { useEffect, useState } from "react";
import {
  getWeeklyGoals,
  updateWeeklyGoal,
  createWeeklyGoal,
  deleteWeeklyGoal,
} from "../../../services/WeeklyGoalService";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { getStudentById, getUser } from "../../../services/UserService";

export function WeeklyGoal({ weekId }) {
  const [goalIndex, setGoalIndex] = useState(0);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const { studentId } = useParams();
  const isReadOnly = !!studentId;
  const [newGoals, setNewGoals] = useState([]);
  const [userIdFromGetUser, setUserIdFromGetUser] = useState(null);
  const allGoals = [...weeklyGoals, ...newGoals];

  useEffect(() => {
    console.log(weekId);
    if (!weekId) return;

    const fetchWeeklyGoals = async () => {
      try {
        const id = studentId ? studentId : (await getUser()).data.id;
        const data = (await getWeeklyGoals(id, weekId)).data;
        setWeeklyGoals(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWeeklyGoals();
  }, [weekId]);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!studentId) {
        try {
          const user = await getUser();
          setUserIdFromGetUser(user.data.id);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUserId();
  }, [studentId]);

  const handlePrev = () => {
    setGoalIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setGoalIndex((prev) =>
      Math.min(prev + 1, Math.max(allGoals.length - 3, 0))
    );
  };

  const handleAddGoal = () => {
    if (allGoals.length >= 3) {
      const maxIndex = Math.max(allGoals.length - 3, 0);
      setGoalIndex((prev) => Math.min(prev + 1, maxIndex));
    }

    setNewGoals((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        goal: "",
        is_achieved: 0,
        isNew: true,
        week_id: weekId,
        student_id: studentId || userIdFromGetUser,
      },
    ]);
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
        {allGoals.slice(goalIndex, goalIndex + 3).map((goal) => (
          <WeeklyGoalForm
            key={goal.id}
            isReadOnly={isReadOnly}
            goal={goal}
            onSaveNew={
              goal.isNew
                ? (newGoal) => {
                    setWeeklyGoals((prev) => [...prev, newGoal]);
                    setNewGoals((prev) => prev.filter((g) => g.id !== goal.id));
                    toast.success("Goal added");
                  }
                : undefined
            }
            onUpdate={(updatedGoal) => {
              if (updatedGoal === null) {
                setWeeklyGoals((prev) => prev.filter((g) => g.id !== goal.id));
              } else {
                setWeeklyGoals((prev) =>
                  prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
                );
              }
            }}
          />
        ))}
      </div>
      <i
        className="bi bi-chevron-compact-right"
        style={{ fontSize: 15, cursor: "pointer" }}
        onClick={handleNext}
      ></i>

      <button
        onClick={handleAddGoal}
        disabled={!studentId && !userIdFromGetUser}
        style={{
          cursor: "pointer",
          backgroundColor: "rgb(254, 153, 59)",
          color: "#fff",
          border: "none",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 14,
        }}
      >
        +
      </button>
      <ToastContainer />
    </div>
  );
}

export function WeeklyGoalForm({ goal, isReadOnly, onSaveNew, onUpdate }) {
  const [formData, setFormData] = useState(goal);

  useEffect(() => {
    setFormData(goal);
  }, [goal]);

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
      if (formData.isNew) {
        const payload = {
          goal: formData.goal.trim() ?? "",
          is_achieved: formData.is_achieved,
          week_id: formData.week_id,
          student_id: formData.student_id,
        };

        if (!formData.goal || formData.goal.trim() === "") {
          toast.error("Goal cannot be empty");
          return;
        }

        if (!payload.week_id || !payload.student_id) {
          toast.error("Missing required fields!");
          return;
        }

        const res = await createWeeklyGoal(payload);
        onSaveNew && onSaveNew(res.data);
      } else {
        if (!formData.goal.trim()) {
          await deleteWeeklyGoal(formData.id);
          toast.info("Goal deleted");
          onUpdate && onUpdate(null);
          return;
        }
        const res = await updateWeeklyGoal(formData.id, formData);
        toast.success(`Goal updated`);
        onUpdate && onUpdate(res.data);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (formData.isNew ? "Goal add failed" : "Goal update failed");
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="learning-journal-goal">
      <input
        type="number"
        name="goal_id"
        style={{ display: "none" }}
        aria-hidden="true"
        value={goal.id}
        readOnly
      />
      <input
        type="checkbox"
        name={`is_achieved`}
        checked={formData?.is_achieved === 1}
        onChange={isReadOnly ? undefined : handleOnChange}
        disabled={isReadOnly}
      />
      {goal !== null && (
        <input
          type="text"
          name={`goal`}
          value={formData?.goal || ""}
          onChange={isReadOnly ? undefined : handleOnChange}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            color: "#fff",
            fontSize: "14px",
          }}
          readOnly={isReadOnly}
        />
      )}
      <button
        type="submit"
        style={{ display: "none" }}
        aria-hidden="true"
        disabled={isReadOnly}
      />
    </form>
  );
}
