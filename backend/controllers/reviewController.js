import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Kiểm tra user đã mua và đơn hoàn thành chưa
const userCanReview = async (userId, productId) => {
  // status coi là hoàn thành: "Đã giao hàng" hoặc "completed" hoặc "delivered"
  const completedStatuses = ["Đã giao hàng", "completed", "delivered"];
  const order = await orderModel.findOne({
    userId,
    status: { $in: completedStatuses },
    "items._id": productId,
  });
  return order || null;
};

const addReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, rating, comment, size } = req.body;
    const imagesFiles = req.files || [];

    if (!productId || !rating) {
      return res.status(400).json({ success: false, message: "Thiếu productId hoặc rating" });
    }

    const existing = await reviewModel.findOne({ userId, productId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    const order = await userCanReview(userId, productId);
    if (!order) {
      return res.status(403).json({
        success: false,
        message: "Chỉ khách đã mua và đơn hàng đã hoàn thành mới được đánh giá sản phẩm",
      });
    }

    let imagesUrl = [];
    if (imagesFiles.length > 0) {
      imagesUrl = await Promise.all(
        imagesFiles.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
          return result.secure_url;
        })
      );
    }

    const review = new reviewModel({
      productId,
      userId,
      orderId: order._id,
      rating: Number(rating),
      comment: comment || "",
      images: imagesUrl.filter(Boolean),
      size: size || "",
    });

    await review.save();

    res.json({ success: true, message: "Đã thêm đánh giá", review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    let userId = req.userId;
    // Nếu không qua auth middleware, thử đọc token header
    if (!userId && req.headers?.token) {
      try {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        userId = null;
      }
    }

    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "name email" })
      .lean();

    let canReview = false;
    if (userId) {
      const existing = await reviewModel.findOne({ userId, productId });
      if (!existing) {
        const order = await userCanReview(userId, productId);
        canReview = !!order;
      }
    }

    res.json({ success: true, reviews, canReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get rating summary for a product (avgRating and reviewCount)
const getRatingSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.json({
        success: true,
        avgRating: 0,
        reviewCount: 0
      });
    }

    const result = await reviewModel.aggregate([
      {
        $match: { productId: new mongoose.Types.ObjectId(productId) }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        success: true,
        avgRating: 0,
        reviewCount: 0
      });
    }

    const avgRating = Math.round(result[0].avgRating * 10) / 10; // Round to 1 decimal place

    res.json({
      success: true,
      avgRating: avgRating || 0,
      reviewCount: result[0].reviewCount || 0
    });
  } catch (error) {
    console.log(error);
    // Return default values on error instead of error response
    res.json({
      success: true,
      avgRating: 0,
      reviewCount: 0
    });
  }
};

// Get all reviews (for admin)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, productId, userId } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let query = {};
    if (productId) query.productId = productId;
    if (userId) query.userId = userId;

    const reviews = await reviewModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate({ path: "userId", select: "name email" })
      .populate({ path: "productId", select: "name image price" })
      .lean();

    const total = await reviewModel.countDocuments(query);

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin reply to review
const adminReplyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.json({ success: false, message: "Vui lòng nhập nội dung phản hồi" });
    }

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: "Không tìm thấy đánh giá" });
    }

    review.adminReply = reply.trim();
    review.adminReplyAt = new Date();
    await review.save();

    res.json({ success: true, message: "Đã phản hồi đánh giá", review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addReview, listProductReviews, getRatingSummary, getAllReviews, adminReplyToReview };

