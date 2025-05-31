import apiClient from "./apiClient";

export async function createDeadlinesByClassroomId(classroomId, formData) {
  try {
    const response = await apiClient.post(`/api/classrooms/${classroomId}/deadlines/bulk`, formData);
    return response;
  } catch (error) {
    console.error("Error while creating deadlines:", error);
    throw error;
  }
}