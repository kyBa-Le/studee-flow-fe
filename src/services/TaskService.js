import apiClient from './apiClient';

export async function getTask() {
    try {
        return await apiClient.get('api/student/tasks');
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}