import axios from "axios";

const API_BASE = "http://localhost:8000/api/classroom";

export const getWeeks = async () => {
  try {
    const response = await axios.get(`${API_BASE}/weeks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weeks:", error);
    throw error;
  }
};