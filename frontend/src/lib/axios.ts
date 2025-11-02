import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api"
      : "/api",
});

// Add request interceptor to handle token refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the token from window.__clerk if available
    if (typeof window !== 'undefined' && (window as any).__clerk) {
      try {
        const clerk = (window as any).__clerk;
        if (clerk.session) {
          const token = await clerk.session.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.warn("Failed to refresh token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request - token may be invalid or expired");
    }
    return Promise.reject(error);
  }
);
