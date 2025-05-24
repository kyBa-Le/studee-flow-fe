import apiClient from "./apiClient";

export async function getCurrentSemesterByClassroomId(classroomId) {
    try {
        const response = await apiClient.get(`/api/classroom/${classroomId}/current-semester`);
        return response;
    } catch (error) {
        console.error('Failed to fetch current semester:', error);
        throw error;
    }
}

export async function getAllSemestersByClassroomId(classroomId) {
    try {
        const response = await apiClient.get(`/api/semesters?classroom_id=${classroomId}`);
        return response;
    } catch (error) {
        console.error('Failed to fetch all semesters:', error);
        throw error;
    }
}