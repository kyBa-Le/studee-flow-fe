import apiClient from "./apiClient";

export async function getAllClassrooms() {
    try {
      return await apiClient.get("/api/classrooms");
    } catch (error) {
      console.error("Error while fetching classrooms:", error);
      return [];
    }
}