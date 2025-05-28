import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { io } from "socket.io-client";

const baseURL = "https://chat-web-app-prototype.onrender.com";
export const useAuthStore = create((set, get) => ({
  authState: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  error: null,
  socket: null,
  onlineUsers: [],
  theme: localStorage.getItem("theme") || "light",
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/user/check-auth");
      if (response.data.user) {
        set({ authState: response.data.user, isCheckingAuth: false });
        get().connectSocket(); 
        return true;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ authState: null, isCheckingAuth: false });
    }
    return false;
  },

  signup: async (userData) => {
    set({ isSigningUp: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
      });

      const response = await axiosInstance.post("/user/signup", formData);

      set({
        authState: response.data.user,
        isSigningUp: false,
      });
      get().connectSocket();
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Signup failed",
        isSigningUp: false,
      });
      return false;
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true, error: null });
    try {
      const response = await axiosInstance.post("/user/login", credentials);
      console.log(response);
      set({
        authState: response.data.user,
        isLoggingIn: false,
      });
      get().connectSocket();
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoggingIn: false,
      });
      return false;
    }
  },
  connectSocket: () => {
    const { authState } = get();

    if (!authState) return;
    const socket = io(baseURL, {
      query: { userId: authState.id },
      withCredentials: true,
    });
    console.log(authState.id);
    socket.connect();
    set({ socket });

    socket.on("onlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
  logout: async () => {
    set({ isLoggingOut: true, error: null });
    try {
      await axiosInstance.post("/user/logout");

      // Disconnect socket
      get().disconnectSocket();

      // Clear auth state and reset store
      set({
        authState: null,
        isLoggingOut: false,
        socket: null,
        onlineUsers: [],
        error: null,
      });

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Logout failed",
        isLoggingOut: false,
      });
      return false;
    }
  },
  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    set({ theme: newTheme });
  },
}));
