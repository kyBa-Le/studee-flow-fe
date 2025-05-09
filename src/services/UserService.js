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

export async function getAllStudents(page = 1, limit = 5) {
  try {
    const response = await apiClient.get(`/api/admin/students`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student list:', error);
    throw error;
  }
}