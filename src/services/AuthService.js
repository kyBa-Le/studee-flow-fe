import apiClient from "./apiClient";

export const login = async (email, password) => {
    try {
        return await apiClient.post("/api/login", {
            email,
            password,
        });
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
    try {
        return await apiClient.post("/api/logout");
    } catch (error) {
        throw error;
    }
}