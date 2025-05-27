import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")), // Initialize from localStorage
  isLoadingUsers: false,
  isLoadingMessages: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoadingUsers: true, error: null });
    try {
      const response = await axiosInstance.get("/message/users");
      set({ users: response.data, isLoadingUsers: false });

      // Restore selected user from users list if it exists
      const selectedUser = get().selectedUser;
      if (selectedUser) {
        const user = response.data.find((u) => u._id === selectedUser._id);
        if (user) {
          get().selectUser(user);
        }
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        isLoadingUsers: false,
      });
    }
  },

  fetchMessages: async (userId) => {
    set({ isLoadingMessages: true, error: null });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data, isLoadingMessages: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch messages",
        isLoadingMessages: false,
      });
    }
  },

  selectUser: (user) => {
    localStorage.setItem("selectedUser", JSON.stringify(user)); // Save to localStorage
    set({ selectedUser: user });
    if (user) {
      get().fetchMessages(user._id);
    }
  },

  uploadMedia: async (file, type) => {
    try {
      const formData = new FormData();
      formData.append(type, file); // type is either 'image' or 'video'

      const response = await axiosInstance.post(
        `/message/upload/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.url;
    } catch (error) {
      set({ error: error.response?.data?.message || "Upload failed" });
      return null;
    }
  },

  sendMessage: async (text, mediaFile) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    try {
      let mediaUrl = null;
      if (mediaFile) {
        const type = mediaFile.type.startsWith("image/") ? "image" : "video";
        mediaUrl = await get().uploadMedia(mediaFile, type);
      }

      await axiosInstance.post(`/message/${selectedUser._id}`, {
        text,
        image: mediaFile?.type.startsWith("image/") ? mediaUrl : null,
        video: mediaFile?.type.startsWith("video/") ? mediaUrl : null,
      });

      get().fetchMessages(selectedUser._id);
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to send message" });
    }
  },

  subscribeToNewMesssage:()=>{
const {selectedUser} = get();
if(!selectedUser) return 
const socket = useAuthStore.getState().socket;
socket.on("newMessage", (message)=>{

  if(message.senderId !== selectedUser._id){
    return
  }
  

  set({messages:[...get().messages,message]})
  // get().fetchMessages(selectedUser._id);  
})
  },

  unsubscribeToNewMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Add cleanup method
  clearSelectedUser: () => {
    localStorage.removeItem("selectedUser");
    set({ selectedUser: null, messages: [] });
  },
}));
