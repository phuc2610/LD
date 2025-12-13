import mongoose from "mongoose";

// Sản phẩm cho mô hình quần áo / streetwear
// Thêm type/colors/sizes để phục vụ filter mới, vẫn giữ các trường cũ để tương thích.
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    bestseller: { type: Boolean },
    category: { type: String, required: true }, // dùng làm brand/nhãn
    subCategory: { type: String, required: true }, // dùng cho style/collection
    // type mới cho streetwear; default ACCESSORIES để không lỗi với dữ liệu cũ
    type: {
      type: String,
      enum: [
        "JEWELRY",
        "MINI POUCH",
        "FLANNEL",
        "PHONE CASES",
        "BOWLER BAGS",
        "JERSEY",
        "BEANIES",
        "POLOS",
        "SHIRTS",
        "TANK TOP",
        "UNDERWEAR",
        "INNERWEAR",
        "SLIDES",
        "SOCKS",
        "CROSSBODY BAGS",
        "CAPS",
        "JEANS",
        "JACKETS",
        "SWEATSHIRTS",
        "PANTS",
        "TOTE BAGS",
        "CARDIGANS",
        "SHORTS",
        "VEST",
        "ACCESSORIES",
        "SHOULDER BAGS",
        "HOODIES",
        "LONGSLEEVES",
        "T-SHIRTS",
        "BACKPACKS",
      ],
      default: "ACCESSORIES",
    },
    sizes: { type: [String], default: [] }, // ví dụ ["S","M","L","XL"]
    colors: { type: [String], default: [] },
    // tồn kho theo size, mặc định 0
    stockBySize: {
      type: Object,
      default: { S: 0, M: 0, L: 0, XL: 0 },
    },
    // date: { type:Number , required:true },
  },
  { timestamps: true }
);


const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel