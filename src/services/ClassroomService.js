import apiClient from "./apiClient";

export async function getAllClassrooms() {
    try {
      const response = await apiClient.get("/api/classrooms");
      return response;
    } catch (error) {
      console.error("Error while fetching classrooms:", error);
      return [];
    }
}