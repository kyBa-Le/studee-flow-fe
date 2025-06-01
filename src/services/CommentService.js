import apiClient from "./apiClient";

export async function getCommentByJournalId(id, type) {
  try {
    const response = await apiClient.get(`/api/comments?type=${type}&journal_id=${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createComment(data) {
  try {
    const response = await apiClient.post("/api/comments", data);
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