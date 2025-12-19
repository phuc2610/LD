import express from "express";
import { addReview, listProductReviews, getRatingSummary, getAllReviews, adminReplyToReview } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const reviewRouter = express.Router();

// Public list reviews; nếu có header token, controller tự đọc để trả canReview
reviewRouter.get("/product/:productId", listProductReviews);

// Get rating summary (avgRating and reviewCount) for a product
reviewRouter.get("/summary/:productId", getRatingSummary);

// Thêm review, yêu cầu đã mua và đơn hoàn thành
reviewRouter.post(
  "/add",
  authUser,
  upload.array("images", 5),
  addReview
);

// Admin routes
reviewRouter.get("/admin/all", adminAuth, getAllReviews);
reviewRouter.post("/admin/reply/:reviewId", adminAuth, adminReplyToReview);

export default reviewRouter;

