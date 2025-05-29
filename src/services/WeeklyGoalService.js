import apiClient from "./apiClient";

export const getWeeklyGoals = async (id, weekId = 0) => {
  try {
    const response = apiClient.get(`/api/students/${id}/weekly-goals?week_id=` + weekId);
    return response;
  } catch (error) {
    console.error("Error fetching weekly goals:", error);
    throw error;
  }
};

export const updateWeeklyGoal = async (goalId, weeklyGoal) => {
  try {
    const response = await apiClient.put("/api/weekly-goals/" + goalId, weeklyGoal);
    return response;
  }
  catch (error) {
    throw error;
  }
};

export const createWeeklyGoal = async (data) => {
  try {
    const response = await apiClient.post("/api/weekly-goals", data);
    return response;
  } catch (error) {
    console.error("Error creating weekly goal:", error);
    throw error;
  }
};

export const deleteWeeklyGoal = async (goalId) => {
  try {
    const response = await apiClient.delete("/api/weekly-goals/" + goalId);
    return response;
  } catch (error) {
    console.error("Error deleting weekly goal:", error);
    throw error;
  }
};

