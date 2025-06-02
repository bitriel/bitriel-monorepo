import axios from "axios";
import { ExpoSecureStoreAdapter } from "../store/localStorage";

const BASE_URL = "https://stablemint.api.selendra.org";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the token to all requests
apiClient.interceptors.request.use(
    async config => {
        const token = await ExpoSecureStoreAdapter.getItem("custodial_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Clear the token and user data
                await Promise.all([
                    ExpoSecureStoreAdapter.removeItem("custodial_token"),
                    ExpoSecureStoreAdapter.removeItem("custodial_user"),
                ]);

                // Redirect to login or handle token expiration
                // You might want to emit an event or use a navigation service here
                throw new Error("Session expired. Please login again.");
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
