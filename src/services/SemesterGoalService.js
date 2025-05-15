import apiClient from "./apiClient";

export async function getSemesterGoalsByUser(semester) {
  try {
    const response = await apiClient.get(`/api/semester-goals?semester=${semester}`);
    return response;
  } catch (error) {
    console.error("Error while fetching semester goals:", error);
    return [];
  }
}
