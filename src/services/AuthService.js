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

export function Logout() {
    localStorage.removeItem("token");
    console.log("clicked");
    window.location.href = "/login";
}