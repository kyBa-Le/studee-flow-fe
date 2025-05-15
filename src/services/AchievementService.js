import apiClient from './apiClient';
export async function getAchievement() {
    try {
        const response = await apiClient.get('api/student/achievements');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}