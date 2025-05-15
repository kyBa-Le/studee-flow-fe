import apiClient from "./apiClient";

export async function getSemesterGoalsByUser(semester_id) {
  try {
    const response = await apiClient.get(`/api/student/semeter-goals?semester_id=${semester_id}`);
    return response;
  } catch (error) {
    console.error("Error while fetching semester goals:", error);
    return [];
  }
}
