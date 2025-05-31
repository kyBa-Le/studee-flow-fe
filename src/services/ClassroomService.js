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

export async function deleteTeacherFromClassroom(classroomId, teacherId) {
  try {
    return await apiClient.delete(`/api/classrooms/${classroomId}/teachers/${teacherId}`);
  } catch (error) {
    console.error("Error while deleting teacher from classroom:", error);
    throw error;
  }
}

export async function adminCreateClassroom(formData) {
  try {
    const response = await apiClient.post("/api/classrooms", formData);
    return response; 
  } catch (error) {
    console.error("Error while creating classroom:", error);
    throw error; 
  }
}

export async function adminUpdateClassroom(id, formData) {
  try {
    const response = await apiClient.put(`/api/classrooms/${id}`, formData);
    return response;
  } catch (error) {
    console.error("Error while updating classroom:", error);
    throw error; 
  }
}

export async function getClassroomByClassroomId(id) {
    try {
      return await apiClient.get(`/api/classrooms/${id}`);
    } catch (error) {
      console.error("Error while fetching classrooms:", error);
      return [];
    }
}

export async function getAllDeadlinesByClassroomId(id) {
  try {
    return await apiClient.get(`/api/classrooms/${id}/deadlines`);
  } catch (error) {
    throw error;
  }
}