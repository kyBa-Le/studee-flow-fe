import apiClient from "./apiClient";

export async function getInClassJournal(id, week_id) {
  try {
    const response = await apiClient.get(`/api/students/${id}/in-classes?week_id=${week_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createInClassJournal(data) {
  try {
    const response = await apiClient.post("/api/student/in-classes", data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function updateInClassJournal(id, data) {
  try {
    const response = await apiClient.put(
      `/api/student/in-classes/${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}