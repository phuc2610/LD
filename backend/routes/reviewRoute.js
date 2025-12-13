import express from "express";
import { addReview, listProductReviews } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const reviewRouter = express.Router();

// Public list reviews; nếu có header token, controller tự đọc để trả canReview
reviewRouter.get("/product/:productId", listProductReviews);

// Thêm review, yêu cầu đã mua và đơn hoàn thành
reviewRouter.post(
  "/add",
  authUser,
  upload.array("images", 5),
  addReview
);

export default reviewRouter;

