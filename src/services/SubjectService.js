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

export async function createSubject(classroomId, formData) {
    try {
        const response = await apiClient.post(`/api/classrooms/${classroomId}/subjects`, formData);
        return response;
    } catch (error) {
        console.error("Error while creating subject:", error);
        throw error;
    }
}