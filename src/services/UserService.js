import apiClient from "./apiClient";


/**
 * Fetch teachers with optional query parameters.
 * @param {Object} params - An object containing query parameters (e.g. { role: "teacher", page: 2 })
 */
export async function getAllTeachers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get("/api/teachers?" + query);
    return response.data;
}

export async function getUser() {
    try {
        const response = await apiClient.get('/api/user');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}