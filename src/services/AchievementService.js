import apiClient from './apiClient';

export async function getAchievement() {
    try {
        return await apiClient.get('api/student/achievements');
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}
export async function  getAchievementByStudentId(id) {
    try {
        return await apiClient.get(`api/student/${id}/achievements`);
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

export async function creatAchievement(data) {
    try {
         const response = await apiClient.post(`api/student/achievements`, data);
        return response;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}