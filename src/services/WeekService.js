import apiClient from "./apiClient";

export async function getAllWeek() {
    try {
        const response = await apiClient.get(`/api/classroom/weeks`);
        return response;
    } catch (error) {
        console.error('Failed to fetch current semester:', error);
        throw error;
    }
}

export async function createWeek(weekData) {
    try {
        const response = await apiClient.post(`/api/students/weeks`, weekData);
        return response;
    } catch (error) {
        console.error('Failed to create week:', error);
        throw error;
    }
}