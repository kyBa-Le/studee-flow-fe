import apiClient from './apiClient';
export async function getUser() {
    try {
        const response = await apiClient.get('/api/user');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}