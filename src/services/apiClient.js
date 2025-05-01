import axios from "axios";

const apiClient = axios.create(
    {
        baseUrl:process.env.REACT_APP_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    }
)

// add interceptors to add token to header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

export default apiClient