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

export async function createUser(user) {
    try {
        const response = await apiClient.post("/api/users", user);
        return response;
    } catch (error) {
        console.log("Error posting user data: ", error);
        throw error;
    }
}
export async function getAllStudents(page = 1, limit = 5) {
  try {
    const response = await apiClient.get(`/api/admin/students`);
    return response;
  } catch (error) {
    console.error('Error fetching student list:', error);
    throw error;
  }
}

export async function createBulkStudents(data) {
  try {
    const response = await apiClient.post('/api/admin/students/bulk', data);
    return response.data;
  } catch (error) {
    console.error('Error creating students:', error);
    throw error;
  }
}
