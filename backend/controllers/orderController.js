import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";

// global variables
const currency = "usd";
const deliveryCharge = 30000;

//  gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// helper: kiểm tra tồn kho
const checkStockAvailable = async (items) => {
  for (const item of items) {
    const product = await productModel.findById(item._id);
    if (!product) throw new Error("Sản phẩm không tồn tại");
    const sizeKey = item.size || "";
    const currentStock = product.stockBySize?.[sizeKey] ?? 0;
    if (currentStock < item.quantity) {
      throw new Error(`Không đủ tồn kho size ${sizeKey} cho sản phẩm ${product.name}`);
    }
  }
};

// helper: trừ tồn kho sau khi đã kiểm tra
const decreaseStock = async (items) => {
  for (const item of items) {
    const sizeKey = item.size || "";
    await productModel.findByIdAndUpdate(item._id, {
      $inc: { [`stockBySize.${sizeKey}`]: -item.quantity },
    });
  }
};

// Placing orders using COD Method

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      // date: Date.now()
    };

    await checkStockAvailable(items);
    await decreaseStock(items);

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Đã đặt hàng" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//  Placing orders using Stripe Payment
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const userId = req.userId;

    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    // chưa trừ tồn kho cho stripe, trừ khi verify thành công
    // kiểm tra tồn kho trước khi tạo session stripe
    await checkStockAvailable(items);
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const VND_TO_USD = 27110; // tỷ giá mẫu, thay bằng tỷ giá thực tế
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round((item.price / VND_TO_USD) * 100),
        // unit_amount: item.price *100
        //  Math.round(item.price / VND_TO_USD * 100) nếu giá là VND, chia cho tỷ giá và nhân 100 để chuyển sang cents
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Phí giao hàng",
        },
        unit_amount: Math.round((deliveryCharge / VND_TO_USD) * 100),
        // unit_amount: deliveryCharge  * 100
        //  Math.round(deliveryCharge / VND_TO_USD * 100) nếu giá là VND, chia cho tỷ giá và nhân 100 để chuyển sang cents
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// verify Stripe

const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
    const userId = req.userId;
  try {
    if (success === "true") {
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
      }

      await decreaseStock(order.items);
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Đặt hàng thành công" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Đặt hàng thất bại" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//  Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

// All Orders Data for Admin page
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 }).lean();
    
    // Populate product images for each order item
    for (const order of orders) {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item._id) {
            try {
              const product = await productModel.findById(item._id).select('image name').lean();
              if (product) {
                // Update item with product image if not already present
                if (!item.image || !item.image[0]) {
                  item.image = product.image || [];
                }
                // Ensure product name is correct
                if (!item.name && product.name) {
                  item.name = product.name;
                }
              }
            } catch (err) {
              console.log(`Error fetching product ${item._id}:`, err);
            }
          }
        }
      }
    }
    
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Orders Data for fontEnd
const userOrders = async (req, res) => {
  try {
    const userId = req.userId; 
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin page
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (status === "Đã giao hàng") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
    }
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Trạng thái đã cập nhật" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get orders by userId (for admin to view customer orders)
const getUserOrdersByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 }).lean();
    
    // Populate product images for each order item
    for (const order of orders) {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item._id) {
            try {
              const product = await productModel.findById(item._id).select('image name').lean();
              if (product) {
                // Update item with product image if not already present
                if (!item.image || !item.image[0]) {
                  item.image = product.image || [];
                }
                // Ensure product name is correct
                if (!item.name && product.name) {
                  item.name = product.name;
                }
              }
            } catch (err) {
              console.log(`Error fetching product ${item._id}:`, err);
            }
          }
        }
      }
    }
    
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  getUserOrdersByAdmin,
};
