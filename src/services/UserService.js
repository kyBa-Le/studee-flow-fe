import apiClient from "./apiClient";

// This folder is to store service to interact with specific backend resource
export async function getAllTeachers() {
    const response = await apiClient.get("/api/teachers");
    return response.data;
}