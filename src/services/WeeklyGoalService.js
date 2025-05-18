import apiClient from "./apiClient";

export const getWeeklyGoals = async (weekId) => {
  try {
    const response = apiClient.get("/api/student/weekly-goals?week_id=" + weekId);
    return response;
  } catch (error) {
    console.error("Error fetching weekly goals:", error);
    throw error;
  }
};

export const updateWeeklyGoal = async (goalId, weeklyGoal) => {
  try {
    const response = apiClient.put("/api/weekly-goals/" + goalId, weeklyGoal);
    return response;
  }
  catch (error) {
    throw error;
  }
}


