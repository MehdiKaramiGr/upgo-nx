import axios, { AxiosError, AxiosRequestConfig } from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        return http(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default http;
