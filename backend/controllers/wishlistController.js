import userModel from "../models/userModel.js";

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Vui lòng cung cấp productId" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Check if product already in wishlist
    if (user.wishlist && user.wishlist.includes(productId)) {
      return res.json({ success: true, message: "Sản phẩm đã có trong wishlist", wishlist: user.wishlist });
    }

    // Add product to wishlist
    if (!user.wishlist) {
      user.wishlist = [];
    }
    user.wishlist.push(productId);
    await user.save();

    res.json({ success: true, message: "Đã thêm vào wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Vui lòng cung cấp productId" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Remove product from wishlist
    if (user.wishlist && user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
      await user.save();
    }

    res.json({ success: true, message: "Đã xóa khỏi wishlist", wishlist: user.wishlist || [] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select("wishlist");
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToWishlist, removeFromWishlist, getWishlist };







