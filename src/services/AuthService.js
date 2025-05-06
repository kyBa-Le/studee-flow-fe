import apiClient from "./apiClient";   

export const login = async (email, password) => {
    try {
        const response = await apiClient.post("/api/login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}