import { useState, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  UserCircleIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  XCircleIcon,
  ChevronLeftIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    return format(new Date(timestamp), "HH:mm | MMM d");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

const DesktopChat = ({
  users,
  messages,
  selectedUser,
  selectUser,
  sendMessage,
  isLoadingUsers,
  isLoadingMessages,
  authState,
  onlineUsers,
}) => {
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [mediaPreview, setMediaPreview] = useState({
    type: null,
    url: null,
    file: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    const container = messagesEndRef.current?.parentNode;

    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

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

  const isMessageEmpty = !messageText.trim() && !mediaPreview.file;
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isMessageEmpty) {
      sendMessage(messageText.trim(), mediaPreview.file);
      clearMediaPreview();
      setMessageText("");
    }
  };

  const getProfileImage = (user) => {
    if (user.profile) {
      return user.profile;
    }
    return "/user.png";
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-base-100 relative">
      <button
        className="absolute top-4 left-4 z-50 btn btn-circle btn-ghost hover:bg-base-200 transition-all duration-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {isSidebarOpen ? (
          <ChevronLeftIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 ease-in-out h-full bg-base-200 overflow-hidden border-r border-base-300 shadow-lg`}
      >
        <div className="p-6 pt-16 h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-base-content mb-2">
              Messages
            </h1>
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/60">
                {users.length} contacts
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-base-content/60">
                  {onlineUsers.length} online
                </span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="form-control mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="input input-bordered w-full pl-10 pr-10 bg-base-100 focus:bg-base-100 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle hover:bg-base-300"
                  onClick={() => setSearchQuery("")}
                >
                  <XCircleIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingUsers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user._id}
                      className={`w-full flex items-center p-4 hover:bg-base-100 rounded-xl cursor-pointer transition-all duration-200 text-left border-2 border-transparent hover:border-base-300 ${
                        selectedUser?._id === user._id
                          ? "bg-primary/10 border-primary/30"
                          : ""
                      }`}
                      onClick={() => selectUser(user)}
                    >
                      {/* User Avatar */}
                      <div className="avatar relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full">
                          <img
                            src={getProfileImage(user)}
                            alt={user.name}
                            className="object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/user.png";
                            }}
                          />
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full absolute bottom-0 right-0 border-2 border-base-200
                          ${
                            isUserOnline(user._id) ? "bg-success" : "bg-error"
                          }`}
                        />
                      </div>

                      {/* User Info Column */}
                      <div className="ml-4 flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-base text-base-content truncate">
                            {user.name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-base-content/60">
                            {isUserOnline(user._id) ? (
                              <span className="flex items-center gap-2">
                                Active now
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                              </span>
                            ) : (
                              "Offline"
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <UserCircleIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/60 text-lg mb-2">
                      No contacts found
                    </p>
                    <p className="text-base-content/40 text-sm">
                      Try adjusting your search or add new contacts
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="navbar bg-base-200 border-b border-base-300 min-h-16 px-6 shadow-sm">
              <div
                className={`flex-1 ${
                  isSidebarOpen ? "ml-0" : "ml-16"
                } transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  {/* Profile Image */}
                  <div className="avatar relative flex-shrink-0">
                    <div className="w-12 rounded-full">
                      <img
                        src={getProfileImage(selectedUser)}
                        alt={selectedUser.name}
                        className="object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/user.png";
                        }}
                      />
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-base-200
          ${isUserOnline(selectedUser._id) ? "bg-success" : "bg-error"}`}
                    />
                  </div>

                  {/* Name and Status in Column */}
                  <div className="flex flex-col">
                    <div className="font-bold text-lg text-base-content">
                      {selectedUser.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      {isUserOnline(selectedUser._id) ? (
                        <>
                          <span>Active now</span>
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        </>
                      ) : (
                        <span>Offline</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-base-100 to-base-50">
              {isLoadingMessages ? (
                <div className="flex justify-center py-12">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {messages.map((message) => {
                    const isSender = message.senderId === authState.id;
                    return (
                      <div
                        key={message._id}
                        className={`chat ${
                          isSender ? "chat-end" : "chat-start"
                        }`}
                      >
                        {/* Message Avatar */}
                        <div ref={messagesEndRef} className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              src={getProfileImage(
                                isSender ? authState : selectedUser
                              )}
                              alt={isSender ? "Me" : selectedUser.name}
                              className="object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/user.png";
                              }}
                            />
                          </div>
                        </div>

                        {/* Message Content */}
                        <div
                          className={`chat-bubble max-w-md break-words shadow-lg ${
                            isSender
                              ? "chat-bubble-primary"
                              : "chat-bubble-secondary"
                          }`}
                        >
                          {/* Media Content */}
                          {message.image && (
                            <img
                              src={message.image} // Cloudinary URL will be stored directly
                              alt="Shared"
                              className="w-full max-w-xs rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                // Image viewer modal logic
                              }}
                            />
                          )}
                          {message.video && (
                            <video
                              src={message.video} // Cloudinary URL will be stored directly
                              className="w-full max-w-xs rounded-lg mb-2"
                              controls
                            />
                          )}
                          {/* Text Content */}
                          {message.text && (
                            <p className="leading-relaxed">{message.text}</p>
                          )}
                        </div>
                        <div className="chat-footer opacity-50 text-xs mt-1">
                          {formatMessageTime(message.createdAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <UserCircleIcon className="w-20 h-20 text-base-content/20 mb-4" />
                  <h3 className="text-xl font-bold text-base-content/60 mb-2">
                    No messages yet
                  </h3>
                  <p className="text-base-content/40">
                    Start the conversation with {selectedUser.name}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Message Input */}
            <div className="p-6 bg-base-200 border-t border-base-300">
              {mediaPreview.url && (
                <div className="mb-4 relative inline-block">
                  <div className="relative group">
                    {mediaPreview.type === "image" ? (
                      <img
                        src={mediaPreview.url}
                        alt="Preview"
                        className="max-h-32 rounded-lg"
                      />
                    ) : (
                      <video
                        src={mediaPreview.url}
                        className="max-h-32 rounded-lg"
                        controls
                      />
                    )}
                    <button
                      onClick={clearMediaPreview}
                      className="btn btn-circle btn-sm absolute -top-2 -right-2 bg-base-100"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMediaMenu(!showMediaMenu)}
                    className="btn btn-circle btn-ghost"
                  >
                    <PlusIcon className="w-6 h-6" />
                  </button>

                  {showMediaMenu && (
                    <div className="absolute bottom-16 left-0 bg-base-200 rounded-box shadow-lg p-2 flex flex-col gap-2 border border-base-300">
                      <label
                        htmlFor="photo-upload-desktop"
                        className="btn btn-ghost gap-2 cursor-pointer"
                      >
                        <PhotoIcon className="w-5 h-5" />
                        Photo
                      </label>
                      <input
                        type="file"
                        id="photo-upload-desktop"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleMediaSelect(e, "image")}
                      />

                      <label
                        htmlFor="video-upload-desktop"
                        className="btn btn-ghost gap-2 cursor-pointer"
                      >
                        <VideoCameraIcon className="w-5 h-5" />
                        Video
                      </label>
                      <input
                        type="file"
                        id="video-upload-desktop"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleMediaSelect(e, "video")}
                      />
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Type a message..."
                  className="input input-bordered flex-1 bg-base-100"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  autoComplete="off"
                />

                <button
                  type="submit"
                  className="btn btn-circle btn-primary"
                  disabled={isMessageEmpty}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-base-100 px-4 text-center">
            <div className="space-y-4">
              <UserCircleIcon className="w-24 h-24 mx-auto text-base-300" />
              <h3 className="text-2xl font-bold text-base-content">
                Welcome to ChatApp
              </h3>
              <p className="text-base-content/60 max-w-md">
                Select a conversation to start chatting with your contacts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopChat;
