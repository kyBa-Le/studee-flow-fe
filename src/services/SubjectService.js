import apiClient from "./apiClient";

export async function getAllSubjects(classroomId) {
    try {
      const response = await apiClient.get(`/api/classroom/${classroomId}/subjects`);
      return response;
    } catch (error) {
      console.error("Error while fetching classrooms:", error);
      return [];
    }
}