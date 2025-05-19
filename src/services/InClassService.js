import apiClient from "./apiClient";

export async function getInClassJournal(week_id = 0) {
  try {
    const response = await apiClient.get(`/api/student/in-classes?week_id=${week_id}`);
    return response;
  } catch (error) {
    console.error("Error while fetching semester goals:", error);
    return [];
  }
}

export async function createInClassJournal(data) {
  try {
    const response = await apiClient.post("/api/student/in-classes", data);
    return response;
  } catch (error) {
    return error;
  }
}