import apiClient from "./apiClient";

// This folder is to store service to interact with specific backend resource

/**
 * Fetch teachers with optional query parameters.
 * @param {Object} params - An object containing query parameters (e.g. { role: "teacher", page: 2 })
 */
export async function getAllTeachers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get("/api/teachers?" + query);
    return response.data;
}