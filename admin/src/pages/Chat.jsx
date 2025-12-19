import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const Chat = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const messagesEndRef = useRef(null);

  const loadUserInfoIfNeeded = async (userId) => {
    if (!userId || !token) {
      console.log("loadUserInfoIfNeeded: Missing userId or token", { userId, hasToken: !!token });
      return;
    }
    
    // Check if user is in conversations list
    const inConversations = conversations.some(
      (conv) => String(conv.userId) === String(userId)
    );

    console.log("loadUserInfoIfNeeded:", { userId, inConversations, conversationsCount: conversations.length });

    // If not in conversations, load user info
    if (!inConversations) {
      try {
        // First try the message API
        console.log("Trying message API for user info:", userId);
        const res = await axios.get(`${backendUrl}/api/message/admin/user-info/${userId}`, {
          headers: { token },
        });
        console.log("Message API response:", res.data);
        if (res.data.success && res.data.user) {
          const userData = {
            name: res.data.user.name || null,
            email: res.data.user.email || null,
            _id: res.data.user._id || userId
          };
          console.log("Setting userInfo from message API:", userData);
          setUserInfo(userData);
          return;
        }
      } catch (error) {
        console.log("Message API error:", error.response?.data || error.message);
      }
      
      // Fallback: try user API
      try {
        console.log("Trying user API for user info:", userId);
        const userRes = await axios.get(`${backendUrl}/api/user/admin/users/${userId}`, {
          headers: { token },
        });
        console.log("User API response:", userRes.data);
        if (userRes.data.success && userRes.data.user) {
          const userData = {
            name: userRes.data.user.name || null,
            email: userRes.data.user.email || null,
            _id: userRes.data.user._id || userId
          };
          console.log("Setting userInfo from user API:", userData);
          setUserInfo(userData);
        } else {
          console.log("User API returned no user data");
          setUserInfo(null);
        }
      } catch (userError) {
        console.log("User API error:", userError.response?.data || userError.message);
        setUserInfo(null);
      }
    } else {
      // User is in conversations, but check if conversation has user info
      const conv = conversations.find(
        (c) => String(c.userId) === String(userId)
      );
      if (conv && (!conv.userName || !conv.userEmail)) {
        // Conversation exists but missing user info, load it
        console.log("User in conversations but missing user info, loading...");
        try {
          // Try to get user info from user API
          const userRes = await axios.get(`${backendUrl}/api/user/admin/users/${userId}`, {
            headers: { token },
          });
          if (userRes.data.success && userRes.data.user) {
            const userData = {
              name: userRes.data.user.name || null,
              email: userRes.data.user.email || null,
              _id: userRes.data.user._id || userId
            };
            console.log("Setting userInfo for user in conversations:", userData);
            setUserInfo(userData);
          } else {
            setUserInfo(null);
          }
        } catch (userError) {
          console.log("User API error:", userError.response?.data || userError.message);
          setUserInfo(null);
        }
      } else {
        console.log("User is in conversations with user info, clearing userInfo");
        setUserInfo(null); // Clear userInfo if user is in conversations and has user info
      }
    }
  };

  // Check for userId in URL params
  useEffect(() => {
    const userIdFromUrl = searchParams.get("userId");
    if (userIdFromUrl) {
      const userIdStr = userIdFromUrl ? String(userIdFromUrl) : null;
      setSelectedUser(userIdStr);
      if (userIdStr) {
        setSearchParams({ userId: userIdStr });
      }
      loadMessages(userIdStr);
      // Load user info immediately when coming from URL (with delay to ensure token is ready)
      if (token) {
        setTimeout(() => {
          console.log("Loading user info from URL param");
          loadUserInfoIfNeeded(userIdStr);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, token]);

  useEffect(() => {
    if (token) {
      loadConversations();
      const interval = setInterval(() => {
        loadConversations();
        if (selectedUser) {
          loadMessages(selectedUser);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedUser]);

  // Load user info when conversations change and selectedUser is set
  useEffect(() => {
    if (selectedUser && token) {
      // Use a delay to ensure conversations state is updated
      const timer = setTimeout(() => {
        console.log("Effect: Loading user info for selectedUser:", selectedUser);
        loadUserInfoIfNeeded(selectedUser);
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, selectedUser, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/message/admin/conversations`, {
        headers: { token },
      });
      if (res.data.success) {
        const newConversations = res.data.conversations || [];
        setConversations(newConversations);
        // After loading conversations, check if selectedUser needs user info
        if (selectedUser) {
          const conv = newConversations.find(
            (c) => String(c.userId) === String(selectedUser)
          );
          // If conversation exists but doesn't have user info, load it
          if (conv && (!conv.userName || !conv.userEmail)) {
            console.log("Conversation exists but missing user info, loading...");
            loadUserInfoIfNeeded(selectedUser);
          } else if (conv && conv.userName && conv.userEmail) {
            // Conversation has user info, clear userInfo state
            setUserInfo(null);
          } else if (!conv) {
            // User not in conversations yet, load user info
            loadUserInfoIfNeeded(selectedUser);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await axios.get(`${backendUrl}/api/message/admin/user/${userId}`, {
        headers: { token },
      });
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectUser = (userId) => {
    // Ensure userId is stored as string for consistent comparison
    const userIdStr = userId ? String(userId) : null;
    setSelectedUser(userIdStr);
    loadMessages(userIdStr);
    setShowOrders(false); // Reset orders view when switching users
    // Update URL params
    if (userIdStr) {
      setSearchParams({ userId: userIdStr });
    } else {
      setSearchParams({});
    }
  };

  const loadUserOrders = async (userId) => {
    if (!userId) return;
    setLoadingOrders(true);
    try {
      const res = await axios.get(`${backendUrl}/api/order/admin/user/${userId}`, {
        headers: { token },
      });
      if (res.data.success) {
        setUserOrders(res.data.orders || []);
        setShowOrders(true);
        setShowReviews(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải đơn hàng");
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadUserReviews = async (userId) => {
    if (!userId) return;
    setLoadingReviews(true);
    try {
      const res = await axios.get(`${backendUrl}/api/review/admin/all`, {
        headers: { token },
        params: { userId, limit: 100 },
      });
      if (res.data.success) {
        setUserReviews(res.data.reviews || []);
        setShowReviews(true);
        setShowOrders(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải đánh giá");
    } finally {
      setLoadingReviews(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/message/admin/send`,
        { userId: selectedUser, message: newMessage },
        { headers: { token } }
      );
      if (res.data.success) {
        setNewMessage("");
        // Load messages and conversations immediately
        await Promise.all([
          loadMessages(selectedUser),
          loadConversations()
        ]);
        // After loading conversations, check if we need to load user info
        // This ensures user info is available even if conversation list doesn't have it
        setTimeout(() => {
          (async () => {
            try {
              const updatedRes = await axios.get(`${backendUrl}/api/message/admin/conversations`, {
                headers: { token },
              });
              if (updatedRes.data.success) {
                const updatedConversations = updatedRes.data.conversations || [];
                const conv = updatedConversations.find(
                  (c) => String(c.userId) === String(selectedUser)
                );
                // If conversation exists but doesn't have user info, load it
                if (conv && (!conv.userName || !conv.userEmail)) {
                  console.log("Conversation missing user info after sending message, loading...");
                  // Try to get user info from user API
                  try {
                    const userRes = await axios.get(`${backendUrl}/api/user/admin/users/${selectedUser}`, {
                      headers: { token },
                    });
                    if (userRes.data.success && userRes.data.user) {
                      const userData = {
                        name: userRes.data.user.name || null,
                        email: userRes.data.user.email || null,
                        _id: userRes.data.user._id || selectedUser
                      };
                      console.log("Setting userInfo after sending message:", userData);
                      setUserInfo(userData);
                    }
                  } catch (userError) {
                    console.log("Error loading user info after sending message:", userError);
                  }
                } else if (conv && conv.userName && conv.userEmail) {
                  // Conversation has user info, clear userInfo state
                  setUserInfo(null);
                }
              }
            } catch (error) {
              console.log("Error checking conversations after sending message:", error);
            }
          })();
        }, 500);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  const selectedConversation = conversations.find((c) => {
    const cUserId = c.userId ? String(c.userId) : null;
    const selectedUserId = selectedUser ? String(selectedUser) : null;
    return cUserId === selectedUserId;
  });

  // Get user info from conversation or from userInfo state
  const displayUserInfo = useMemo(() => {
    try {
      console.log("Computing displayUserInfo:", { 
        hasSelectedConversation: !!selectedConversation, 
        hasUserInfo: !!userInfo, 
        selectedUser,
        userInfo 
      });
      
      // If we have selectedConversation, check if it has user info
      if (selectedConversation) {
        console.log("Using selectedConversation:", selectedConversation);
        // If selectedConversation has user info, use it
        if (selectedConversation.userName || selectedConversation.userEmail) {
          return selectedConversation;
        }
        // If selectedConversation doesn't have user info, try to use userInfo state
        if (userInfo && selectedUser) {
          const userName = userInfo.name || userInfo.userName || null;
          const userEmail = userInfo.email || userInfo.userEmail || null;
          if (userName || userEmail) {
            console.log("selectedConversation missing user info, using userInfo:", { userName, userEmail });
            return {
              ...selectedConversation,
              userName: userName,
              userEmail: userEmail
            };
          }
        }
        // Return selectedConversation even if it doesn't have user info
        return selectedConversation;
      }
      if (userInfo && selectedUser) {
        // Ensure we have valid user info
        const userName = userInfo.name || userInfo.userName || null;
        const userEmail = userInfo.email || userInfo.userEmail || null;
        console.log("Using userInfo:", { userName, userEmail, userInfo });
        if (userName || userEmail) {
          const result = {
            userId: selectedUser,
            userName: userName,
            userEmail: userEmail
          };
          console.log("Returning displayUserInfo:", result);
          return result;
        }
      }
      console.log("No user info available, returning null");
      return null;
    } catch (error) {
      console.error("Error computing displayUserInfo:", error);
      return null;
    }
  }, [selectedConversation, userInfo, selectedUser]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Chat</h1>
        <p className="text-gray-600 mt-2">Trò chuyện với khách hàng</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Danh sách khách hàng</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Chưa có cuộc trò chuyện nào
                </div>
              ) : (
                conversations.map((conv, index) => {
                  // Ensure userId is a string for key
                  const userIdStr = conv.userId ? String(conv.userId) : `conv-${index}`;
                  return (
                  <button
                    key={userIdStr}
                    onClick={() => handleSelectUser(conv.userId)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      (selectedUser && String(selectedUser) === userIdStr) ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {conv.userName || conv.userEmail || "Khách hàng"}
                        </p>
                        {conv.userEmail && (
                          <p className="text-xs text-gray-500 truncate">{conv.userEmail}</p>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {displayUserInfo?.userName || displayUserInfo?.userEmail || "Khách hàng"}
                    </h3>
                    {displayUserInfo?.userEmail && (
                      <p className="text-sm text-gray-500">{displayUserInfo.userEmail}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadUserOrders(selectedUser)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                      disabled={loadingOrders}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {loadingOrders ? "Đang tải..." : "Đơn hàng"}
                    </button>
                    <button
                      onClick={() => loadUserReviews(selectedUser)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
                      disabled={loadingReviews}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {loadingReviews ? "Đang tải..." : "Đánh giá"}
                    </button>
                  </div>
                </div>

                {/* Orders View, Reviews View or Messages */}
                {showOrders ? (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">Đơn hàng của khách hàng</h4>
                      <button
                        onClick={() => setShowOrders(false)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Quay lại chat
                      </button>
                    </div>
                    {userOrders.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Khách hàng chưa có đơn hàng nào
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userOrders.map((order) => (
                          <div
                            key={order._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  Đơn hàng #{order._id.toString().slice(-8)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.status === "Đã giao hàng"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "Đã đặt hàng"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                                <p className="text-sm font-semibold text-gray-800 mt-2">
                                  {order.amount.toLocaleString("vi-VN")} đ
                                </p>
                              </div>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                              <p className="text-xs text-gray-600 mb-2">
                                <span className="font-semibold">Phương thức:</span> {order.paymentMethod}
                              </p>
                              <p className="text-xs text-gray-600">
                                <span className="font-semibold">Thanh toán:</span>{" "}
                                {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                              </p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-gray-700 mb-1">Sản phẩm:</p>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => {
                                    // Get product image - prioritize item.image, fallback to empty string
                                    const productImage = (item.image && Array.isArray(item.image) && item.image[0]) 
                                      ? item.image[0] 
                                      : (item.image && typeof item.image === 'string' ? item.image : null);
                                    
                                    return (
                                      <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                        {productImage ? (
                                          <img
                                            src={productImage}
                                            alt={item.name || "Sản phẩm"}
                                            className="w-16 h-16 object-cover rounded border border-gray-200"
                                            onError={(e) => {
                                              // Hide image if it fails to load
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                        ) : (
                                          <div className="w-16 h-16 bg-gray-200 rounded border border-gray-200 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                        )}
                                        <div className="flex-1">
                                          <p className="text-xs font-medium text-gray-800">{item.name || "Sản phẩm"}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">x{item.quantity}</span>
                                            {item.size && (
                                              <span className="text-xs text-gray-500">Size: {item.size}</span>
                                            )}
                                            {item.price && (
                                              <span className="text-xs text-gray-600 font-semibold">
                                                {item.price.toLocaleString("vi-VN")} đ
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : showReviews ? (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">Đánh giá của khách hàng</h4>
                      <button
                        onClick={() => setShowReviews(false)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Quay lại chat
                      </button>
                    </div>
                    {userReviews.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Khách hàng chưa có đánh giá nào
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userReviews.map((review) => (
                          <div
                            key={review._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              {review.productId?.image?.[0] && (
                                <img
                                  src={review.productId.image[0]}
                                  alt={review.productId?.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-semibold text-gray-800">
                                    {review.productId?.name || "Sản phẩm"}
                                  </h5>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-sm ${
                                          i < review.rating ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {review.comment && (
                                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                                )}
                                {review.images && review.images.length > 0 && (
                                  <div className="flex gap-2 mb-2">
                                    {review.images.map((img, idx) => (
                                      <img
                                        key={idx}
                                        src={img}
                                        alt="review"
                                        className="w-16 h-16 object-cover rounded border"
                                      />
                                    ))}
                                  </div>
                                )}
                                {review.adminReply && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs font-semibold text-blue-600 mb-1">
                                      Phản hồi từ quản trị viên:
                                    </p>
                                    <p className="text-sm text-gray-700">{review.adminReply}</p>
                                  </div>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(review.createdAt).toLocaleString("vi-VN")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Chưa có tin nhắn nào. Bắt đầu trò chuyện!
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isAdmin = msg.senderRole === "admin";
                        return (
                          <div
                            key={msg._id || `msg-${index}-${msg.createdAt}`}
                            className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                                isAdmin
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-gray-800 border border-gray-200"
                              }`}
                            >
                              {!isAdmin && (
                                <p className="text-xs font-semibold mb-1 opacity-80">
                                  {msg.senderId?.name || "Khách hàng"}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isAdmin ? "text-white/70" : "text-gray-500"
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* Input - Only show when not viewing orders */}
                {!showOrders && (
                  <form
                    onSubmit={sendMessage}
                    className="p-4 border-t border-gray-200 bg-white"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "..." : "Gửi"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Chọn một khách hàng để bắt đầu trò chuyện
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

