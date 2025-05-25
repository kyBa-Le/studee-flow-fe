import apiClient from "./apiClient";

export async function getAllClassrooms() {
    try {
      return await apiClient.get("/api/teacher/classrooms");
    } catch (error) {
      console.error("Error while fetching classrooms:", error);
      return [];
    }
}

export async function adminGetAllClassrooms() {
    try {
      return await apiClient.get("/api/classrooms");
    } catch (error) {
      console.error("Error while fetching classrooms:", error);
      return [];
    }
}

export async function getAllTeachersByClassroomId(id) {
  try {
    return await apiClient.get(`/api/classrooms/${id}/teachers`);
  } catch (error) {
    return [];
  }
}

export async function addTeacherToClassroom(classroomId, teacherId) {
  try {
    return await apiClient.post(`/api/classrooms/${classroomId}/add-teacher`, { teacher_id: teacherId });
  } catch (error) {
    console.error("Error while adding teacher to classroom:", error);
    throw error;
  }
}