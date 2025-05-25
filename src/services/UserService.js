import apiClient from "./apiClient";


/**
 * Fetch teachers with optional query parameters.
 * @param {Object} params - An object containing query parameters (e.g. { role: "teacher", page: 2 })
 */
export async function getAllTeachers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get("/api/teachers?" + query);
    return response;
}

export async function getUser() {
    try {
        return await apiClient.get('/api/user');
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

export async function createUser(user) {
    try {
        return await apiClient.post("/api/users", user);
    } catch (error) {
        console.log("Error posting user data: ", error);
        throw error;
    }
}
export async function getAllStudents(page = 1, limit = 5) {
  try {
    return await apiClient.get(`/api/students`);
  } catch (error) {
    console.error('Error fetching student list:', error);
    throw error;
  }
}

export async function createBulkStudents(data) {
  try {
    return await apiClient.post('/api/students/bulk', data);
  } catch (error) {
    console.error('Error creating students:', error);
    throw error;
  }
}

export async function getAllClassrooms() {
  try {
    return await apiClient.get("/api/classrooms");
  } catch (error) {
    console.error("Error while fetching classrooms:", error);
    return [];
  }
}

export async function getStudentById(id) {
    try {
        return await apiClient.get(`/api/students/${id}/profile`);
    } catch (error) {
        console.error('Error fetching student data:', error);
        throw error;
    }
}

export async function getAllStudentsByClassroomId(classroomId) {
  try {
    return await apiClient.get(`/api/classroom/${classroomId}/students`);
  } catch (error) {
    console.error('Error fetching student list:', error);
    throw error;
  }
}

