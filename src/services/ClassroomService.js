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
