// MobileChat.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import { format } from "date-fns";
import {
  UserCircleIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
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

const MobileChat = ({
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
  const [mobileView, setMobileView] = useState("contacts"); // 'contacts' or 'chat'

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

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

  const isMessageEmpty = !messageText.trim() && !mediaPreview.file;
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  const handleUserSelect = (user) => {
    selectUser(user);
    setMobileView("chat");
  };

  const handleBackToContacts = () => {
    setMobileView("contacts");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isMessageEmpty) {
      sendMessage(messageText.trim(), mediaPreview.file);
      clearMediaPreview();
      setMessageText("");
    }
  };

  // Add the same profile image helper function
  const getProfileImage = (user) => {
    if (user.profile) {
      return user.profile;
    }
    return "/user.png";
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-base-100">
      {/* Mobile Contacts View */}
      {mobileView === "contacts" && (
        <div className="w-full h-full bg-base-200 overflow-y-auto">
          <div className="p-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-base-content">Chats</h1>
              <div className="badge badge-primary badge-outline">
                {users.length} contacts
              </div>
            </div>

            {/* Search */}
            <div className="form-control mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="input input-bordered w-full pr-10 bg-base-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
                    onClick={() => setSearchQuery("")}
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Users List */}
            {isLoadingUsers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-4 hover:bg-base-100 active:bg-base-300 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-base-300"
                      onClick={() => handleUserSelect(user)}
                    >
                      {/* For user list */}
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
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-base text-base-content truncate">
                            {user.name}
                          </p>
                          <ChevronLeftIcon className="w-5 h-5 rotate-180 text-base-content/40 flex-shrink-0" />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-base-content/60">
                            {isUserOnline(user._id) ? "Active now" : "Offline"}
                          </p>
                          {isUserOnline(user._id) && (
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <UserCircleIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/60 text-lg">
                      No users found
                    </p>
                    <p className="text-base-content/40 text-sm mt-1">
                      Try adjusting your search
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Chat View */}
      {mobileView === "chat" && selectedUser && (
        <div className="w-full h-full flex flex-col bg-base-100">
          {/* Mobile Chat Header */}
          <div className="navbar bg-base-200 border-b border-base-300 min-h-16 px-3">
            <div className="flex-none">
              <button
                className="btn btn-ghost btn-circle"
                onClick={handleBackToContacts}
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex items-center gap-3 ml-2">
              {/* For chat header */}
              <div className="avatar relative flex-shrink-0">
                <div className="w-10 rounded-full">
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
                  ${
                    isUserOnline(selectedUser._id) ? "bg-success" : "bg-error"
                  }`}
                ></div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base truncate">
                  {selectedUser.name}
                </div>
                <div className="text-xs opacity-60">
                  {isUserOnline(selectedUser._id) ? "Active now" : "Offline"}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-base-100 to-base-50">
            {isLoadingMessages ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : messages.length > 0 ? (
              messages.map((message) => {
                const isSender = message.senderId === authState.id;
                return (
                  <div
                    key={message._id}
                    className={`chat ${isSender ? "chat-end" : "chat-start"}`}
                  >
                    {/* For message avatars */}
                    <div ref={messagesEndRef} className="chat-image avatar">
                      <div className="w-8 rounded-full">
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
                    <div
                      className={`chat-bubble max-w-[85%] break-words text-sm ${
                        isSender
                          ? "chat-bubble-primary"
                          : "chat-bubble-secondary"
                      }`}
                    >
                      {/* Media Content */}
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Shared"
                          className="w-full max-w-[200px] rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            // Image viewer modal logic
                          }}
                        />
                      )}
                      {message.video && (
                        <video
                          src={message.video}
                          className="w-full max-w-[200px] rounded-lg mb-2"
                          controls
                          playsInline
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
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                  <UserCircleIcon className="w-10 h-10 text-base-content/40" />
                </div>
                <p className="text-base-content/60 mb-2">No messages yet</p>
                <p className="text-base-content/40 text-sm">
                  Send a message to start the conversation
                </p>
              </div>
            )}
          </div>

          {/* Mobile Message Input */}
          <div className="p-3 bg-base-200 border-t border-base-300">
            {/* Media Preview */}
            {mediaPreview.url && (
              <div className="mb-3 relative inline-block">
                <div className="relative group">
                  {mediaPreview.type === "image" ? (
                    <img
                      src={mediaPreview.url}
                      alt="Preview"
                      className="max-h-20 rounded-lg"
                    />
                  ) : (
                    <video
                      src={mediaPreview.url}
                      className="max-h-20 rounded-lg"
                      controls
                      playsInline
                    />
                  )}
                  <button
                    onClick={clearMediaPreview}
                    className="btn btn-circle btn-xs absolute -top-1 -right-1 bg-error text-error-content hover:bg-error/80"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
              {/* Media Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMediaMenu(!showMediaMenu)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>

                {/* Mini Menu */}
                {showMediaMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMediaMenu(false)}
                    ></div>
                    <div className="absolute bottom-12 left-0 bg-base-100 rounded-box shadow-xl p-3 flex flex-col gap-2 border border-base-300 z-20 min-w-[120px]">
                      <label
                        htmlFor="photo-upload-mobile"
                        className="btn btn-ghost btn-sm gap-2 cursor-pointer justify-start"
                      >
                        <PhotoIcon className="w-4 h-4 text-primary" />
                        Photo
                      </label>
                      <input
                        type="file"
                        id="photo-upload-mobile"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleMediaSelect(e, "image")}
                      />

                      <label
                        htmlFor="video-upload-mobile"
                        className="btn btn-ghost btn-sm gap-2 cursor-pointer justify-start"
                      >
                        <VideoCameraIcon className="w-4 h-4 text-secondary" />
                        Video
                      </label>
                      <input
                        type="file"
                        id="video-upload-mobile"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleMediaSelect(e, "video")}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Message Input */}
              <input
                type="text"
                name="message"
                placeholder="Type a message..."
                className="input input-bordered flex-1 input-sm bg-base-100 focus:bg-base-100"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                autoComplete="off"
              />

              {/* Send Button */}
              <button
                type="submit"
                className={`btn btn-circle btn-sm transition-all duration-200 ${
                  isMessageEmpty
                    ? "btn-disabled"
                    : "btn-primary hover:scale-105 active:scale-95"
                }`}
                disabled={isMessageEmpty}
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileChat;
