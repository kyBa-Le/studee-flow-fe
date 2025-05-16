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

export async function createSemesterGoal(data) {
  try {
    const response = await apiClient.post("/api/student/semester-goals", data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateSemesterGoals(semesterGoalId, data) {
  try {
    const response = await apiClient.put("/api/student/semester-goals/" + semesterGoalId, data);
    return response;
  } catch (error) {
    return error;
  }
}