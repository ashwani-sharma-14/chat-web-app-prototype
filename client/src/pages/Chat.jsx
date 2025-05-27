import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MobileChat from "../components/MobileChat";
import DesktopChat from "../components/DesktopChat";

const Chat = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [mediaPreview, setMediaPreview] = useState({
    type: null,
    url: null,
    file: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState("contacts");

  const {
    users,
    messages,
    selectedUser,
    fetchUsers,
    selectUser,
    sendMessage,
    isLoadingUsers,
    isLoadingMessages,
    subscribeToNewMesssage,
    unsubscribeToNewMessage,
  } = useChatStore();
  const { authState, onlineUsers } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleMediaSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setMediaPreview({
        type,
        url: URL.createObjectURL(file),
        file,
      });
      setShowMediaMenu(false);
    }
  };

  const clearMediaPreview = () => {
    if (mediaPreview.url) {
      URL.revokeObjectURL(mediaPreview.url);
    }
    setMediaPreview({ type: null, url: null, file: null });
  };

  useEffect(() => {
    if (selectedUser) {
      subscribeToNewMesssage();
      return () => unsubscribeToNewMessage();
    }
  }, [selectedUser, subscribeToNewMesssage, unsubscribeToNewMessage]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarOpen(false);
        if (!selectedUser) {
          setMobileView("contacts");
        }
      } else {
        setIsSidebarOpen(true);
        setMobileView("contacts");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedUser]);

  const sharedProps = {
    users,
    messages,
    selectedUser,
    searchQuery,
    setSearchQuery,
    messageText,
    setMessageText,
    showMediaMenu,
    setShowMediaMenu,
    mediaPreview,
    clearMediaPreview,
    handleMediaSelect,
    sendMessage,
    isLoadingUsers,
    isLoadingMessages,
    authState,
    onlineUsers,
  };

  if (isMobile) {
    return (
      <MobileChat
        {...sharedProps}
        mobileView={mobileView}
        setMobileView={setMobileView}
        selectUser={(user) => {
          selectUser(user);
          setMobileView("chat");
        }}
      />
    );
  }

  return (
    <DesktopChat
      {...sharedProps}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      selectUser={selectUser}
    />
  );
};

export default Chat;