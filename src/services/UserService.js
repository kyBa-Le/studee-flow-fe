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

export async function updateStudent(student) {
  try {
    const payload = {
      full_name: student.full_name,
      email: student.email,
      password: student.password,
      gender: student.gender,
      student_classroom_id: student.student_classroom_id,
    };

    return await apiClient.put(`/api/students/${student.id}`, payload);
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

export async function deleteStudent(studentId) {
  try {
    return await apiClient.delete(`/api/users/${studentId}`);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

export async function updateOwnProfile(profile) {
  try {
    const payload = {
      full_name: profile.full_name,
      gender: profile.gender,
      avatar_link: profile.avatar_link,
    };
    if (profile.current_password && profile.new_password && profile.confirm_new_password) {
      payload.current_password = profile.current_password;
      payload.new_password = profile.new_password;
      payload.confirm_new_password = profile.confirm_new_password;
    }

    return await apiClient.put('/api/student/profile', payload);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}