import apiClient from './apiClient';

export async function getTask(studentId) {
    try {
        return await apiClient.get(`api/student/${studentId}/tasks`);
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}