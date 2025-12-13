import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    images: { type: [String], default: [] },
    size: { type: String, default: "" },
  },
  { timestamps: true }
);

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;




