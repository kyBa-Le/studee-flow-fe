import axios from "axios";

const STUDENT_API_BASE = "http://localhost:8000/api/student";

export const getWeeklyGoals = async (weekId) => {
  try {
    const response = await axios.get(
      `${STUDENT_API_BASE}/weekly-goals?week_id=${weekId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly goals:", error);
    throw error;
  }
};

export const updateWeeklyGoal = async (goalId, goalPayload) => {
    try {
        const response = await axios.put(
        `${STUDENT_API_BASE}/weekly-goals/${goalId}`,
        goalPayload,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


