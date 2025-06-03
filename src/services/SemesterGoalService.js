import apiClient from "./apiClient";

export async function getSemesterGoalsByUser(studentId,semesterId) {
  console.log(semesterId);
  try {
    const response = await apiClient.get(`/api/students/${studentId}/semester-goals?semester_id=${semesterId}`);
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
    console.error("Error while creating semester goal:", error);
    throw error;
  }
}

export async function updateSemesterGoals(semesterGoalId, data) {
  try {
    const response = await apiClient.put("/api/student/semester-goals/" + semesterGoalId, data);
    return response;
  } catch (error) {
    console.error("Error while updating semester goals:", error);
    throw error;
  }
}