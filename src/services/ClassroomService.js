import apiClient from "./apiClient";

export const ClassroomService = {
    // Get the list of all classrooms
    getAllClassrooms: async function () {
        try {
            const response = await apiClient.get("/api/classrooms");
            return response.data;
        } catch (error) {
            console.error("Error while fetching classrooms:", error);
            return [];
        }
    },

    // Get a classroom by its ID
    getClassroomById: async function (id) {
        try {
            const response = await apiClient.get(`/api/classrooms/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error while fetching classroom with ID ${id}:`, error);
            return null;
        }
    },

    // Create a new classroom
    createClassroom: async function (newClassroom) {
        try {
            const response = await apiClient.post("/api/classrooms", newClassroom);
            return response.data;
        } catch (error) {
            console.error("Error while creating classroom:", error);
            return null;
        }
    },

    // Update classroom information
    updateClassroom: async function (updatedClassroom) {
        try {
            const response = await apiClient.put(`/api/classrooms/${updatedClassroom.id}`, updatedClassroom);
            return response.data;
        } catch (error) {
            console.error("Error while updating classroom:", error);
            return null;
        }
    },

    // Delete a classroom by its ID
    deleteClassroomById: async function (id) {
        try {
            await apiClient.delete(`/api/classrooms/${id}`);
            console.log("Classroom has been deleted!");
        } catch (error) {
            console.error("Error while deleting classroom:", error);
        }
    },

    // Search classrooms by name (query ?name=keyword)
    searchClassroomsByName: async function (keyword) {
        try {
            const response = await apiClient.get(`/api/classrooms?name=${encodeURIComponent(keyword)}`);
            return response.data;
        } catch (error) {
            console.error("Error while searching classrooms by name:", error);
            return [];
        }
    },

    // Get classrooms with pagination
    getClassroomsByPage: async function (page = 1, limit = 10) {
        try {
            const response = await apiClient.get(`/api/classrooms?_page=${page}&_limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error while paginating classrooms:", error);
            return [];
        }
    }
};
