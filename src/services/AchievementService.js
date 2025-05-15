import apiClient from './apiClient';

export async function getAchievement() {
    try {
        return await apiClient.get('api/student/achievements');
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}