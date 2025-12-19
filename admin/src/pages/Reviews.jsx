import React, { useState, useEffect, useCallback } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reviews = ({ token }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/review/admin/all`, {
        headers: { token },
        params: { page, limit: 20 },
      });
      if (res.data.success) {
        setReviews(res.data.reviews || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    if (token) {
      loadReviews();
    }
  }, [token, page, loadReviews]);

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi");
      return;
    }

    setReplying(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/review/admin/reply/${reviewId}`,
        { reply: replyText },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Đã phản hồi đánh giá");
        setReplyText("");
        setSelectedReview(null);
        loadReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể gửi phản hồi");
    } finally {
      setReplying(false);
    }
  };

  const handleChatWithUser = (userId) => {
    navigate(`/chat?userId=${userId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Đánh giá</h1>
        <p className="text-gray-600 mt-2">Xem và phản hồi đánh giá của khách hàng</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đánh giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phản hồi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        Chưa có đánh giá nào
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {review.productId?.image?.[0] && (
                              <img
                                src={review.productId.image[0]}
                                alt={review.productId?.name}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {review.productId?.name || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {review.productId?.price?.toLocaleString("vi-VN")} đ
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900">
                            {review.userId?.name || "Khách hàng"}
                          </p>
                          <p className="text-xs text-gray-500">{review.userId?.email}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 max-w-xs truncate">
                            {review.comment || "Không có nhận xét"}
                          </p>
                          {review.images && review.images.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {review.images.length} ảnh
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(review.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {review.adminReply ? (
                            <div>
                              <p className="text-sm text-blue-600 max-w-xs truncate">
                                {review.adminReply}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(review.adminReplyAt)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Chưa phản hồi</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedReview(review._id);
                                setReplyText(review.adminReply || "");
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {review.adminReply ? "Sửa phản hồi" : "Phản hồi"}
                            </button>
                            <button
                              onClick={() => handleChatWithUser(review.userId?._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Chat
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Phản hồi đánh giá</h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Nhập phản hồi của bạn..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 min-h-[100px] focus:outline-none focus:border-blue-500"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setReplyText("");
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleReply(selectedReview)}
                disabled={replying || !replyText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {replying ? "Đang gửi..." : "Gửi phản hồi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;

