import apiClient from "./apiClient";

export async function getStudentProgerssByStudentId(studentId) {
    try {
        const response = await apiClient.get(`/api/student/${studentId}/progress`);
        return response;
    } catch (error) {
        console.error('Failed to fetch current semester:', error);
        throw error;
    }
}