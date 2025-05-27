import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chat-web-app-prototype.onrender.com/api",
  withCredentials: true,
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const isUserLoggedIn = () => {
  return !!getCookie("accessToken");
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token && config.url !== "/auth/refresh-token") {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/user/auth/refresh-token" &&
      isUserLoggedIn()
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/user/auth/refresh-token");
        const newToken = getCookie("accessToken");
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
