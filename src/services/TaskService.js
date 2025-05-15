import apiClient from './apiClient';
export async function getTask() {
    try {
        const response = await apiClient.get('api/student/tasks');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}