import apiClient from "./apiClient";

export async function getCommentById(id) {
  try {
    const response = await apiClient.get(`/api/comment/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createComment(data) {
  try {
    const response = await apiClient.post("/api/comment", data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getAllTeachersByClassroomId(id) {
  try {
    return await apiClient.get(`/api/classrooms/${id}/teachers`);
  } catch (error) {
    return [];
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