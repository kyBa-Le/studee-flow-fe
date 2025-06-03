import apiClient from "./apiClient";

export async function getWeeklySelfStudyJournalOfStudent(studentId ,week_id = 0) {
   try {
    const response = await apiClient.get(`/api/students/${studentId}/self-studies?week_id=${week_id}`);
    return response;
  } catch (error) {
    console.error("Error while fetching semester goals:", error);
    return [];
  }
}
export async function createSelfStudyJournal(data) {
  try {
    const response = await apiClient.post("/api/student/self-studies", data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateSelfStudyJournal(id, data) {
  try {
    const response = await apiClient.put(`/api/student/self-studies/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}