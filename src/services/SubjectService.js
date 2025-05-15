import apiClient from "./apiClient";

export async function getAllSubjects() {
    try {
      const response = await apiClient.get("/api/subjects");
      return response.data;
    } catch (error) {
      console.error("Error while fetching classrooms:", error);
      return [];
    }
}