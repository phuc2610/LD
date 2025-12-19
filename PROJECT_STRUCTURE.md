# Cấu Trúc Dự Án TLookShop

## 📁 Tổng Quan

Dự án được tổ chức theo kiến trúc **Monorepo** với 3 ứng dụng chính:

```
LD/
├── frontend/     # Ứng dụng web cho khách hàng
├── backend/      # API server (Node.js + Express)
└── admin/        # Ứng dụng quản trị
```

---

## 🎨 Frontend (Customer Portal)

### Cấu Trúc Thư Mục

```
frontend/
├── public/              # Static assets
│   └── vite.svg
├── src/
│   ├── assets/         # Hình ảnh, icons (117 files)
│   │   ├── *.webp      # 81 files
│   │   ├── *.png       # 21 files
│   │   └── *.jpg       # 14 files
│   │
│   ├── components/     # React components tái sử dụng
│   │   ├── BestSeller.jsx
│   │   ├── CartTotal.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── LatestCollection.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   ├── NewsletterBox.jsx
│   │   ├── OurPolicy.jsx
│   │   ├── PageTransition.jsx
│   │   ├── ProductItem.jsx
│   │   ├── ProtectedRoute.jsx    # Bảo vệ routes cần đăng nhập
│   │   ├── QuickAddModal.jsx
│   │   ├── RelatedProducts.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SectionHeader.jsx
│   │   └── Title.jsx
│   │
│   ├── context/         # React Context API
│   │   └── ShopContext.jsx    # Global state management
│   │
│   ├── pages/           # Route pages
│   │   ├── About.jsx
│   │   ├── Cart.jsx
│   │   ├── Collection.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   ├── PlaceOrder.jsx     # Trang đặt hàng
│   │   ├── Product.jsx
│   │   ├── Profile.jsx
│   │   ├── Verify.jsx
│   │   └── Wishlist.jsx
│   │
│   ├── App.jsx          # Main app component với routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
│
├── index.html
├── package.json
├── vite.config.js        # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── vercel.json           # Vercel deployment config
```

### Công Nghệ Sử Dụng

- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 7.6.1
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.10.0
- **State Management**: React Context API
- **Notifications**: React Toastify 11.0.5
- **Form Handling**: @formspree/react 3.0.0

### Chức Năng Chính

1. **Trang Chủ** (`Home.jsx`)
   - Hero section
   - Best seller products
   - Latest collection
   - Newsletter subscription

2. **Sản Phẩm** (`Collection.jsx`, `Product.jsx`)
   - Danh sách sản phẩm
   - Chi tiết sản phẩm
   - Filter & search
   - Related products

3. **Giỏ Hàng** (`Cart.jsx`)
   - Quản lý giỏ hàng
   - Cập nhật số lượng
   - Xóa sản phẩm

4. **Đặt Hàng** (`PlaceOrder.jsx`)
   - Form thông tin giao hàng
   - Chọn phương thức thanh toán (COD, Stripe, Razorpay)
   - Validation form

5. **Đơn Hàng** (`Orders.jsx`)
   - Xem lịch sử đơn hàng
   - Theo dõi trạng thái
   - Đánh giá sản phẩm

6. **Yêu Thích** (`Wishlist.jsx`)
   - Danh sách sản phẩm yêu thích
   - Thêm/xóa yêu thích

7. **Tài Khoản** (`Profile.jsx`, `Login.jsx`)
   - Đăng nhập/Đăng ký
   - Quản lý thông tin cá nhân

### Context API (`ShopContext.jsx`)

Quản lý global state:
- `products`: Danh sách sản phẩm
- `cartItems`: Giỏ hàng
- `wishlist`: Danh sách yêu thích
- `token`: JWT token
- `user`: Thông tin user
- `search`: Tìm kiếm
- Functions: `addToCart`, `updateQuantity`, `getCartAmount`, `toggleWishlist`, etc.

---

## ⚙️ Backend (API Server)

### Cấu Trúc Thư Mục

```
backend/
├── config/              # Configuration files
│   ├── cloudinary.js    # Cloudinary image upload config
│   └── mongodb.js       # MongoDB connection
│
├── controllers/         # Business logic
│   ├── cartController.js
│   ├── orderController.js
│   ├── productController.js
│   ├── reviewController.js
│   ├── statisticsController.js
│   ├── userController.js
│   └── wishlistController.js
│
├── middleware/          # Express middleware
│   ├── adminAuth.js     # Admin authentication
│   ├── auth.js          # User authentication
│   └── multer.js        # File upload handling
│
├── models/              # Mongoose models
│   ├── couponModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── reviewModel.js
│   └── userModel.js
│
├── routes/              # API routes
│   ├── cartRoute.js
│   ├── orderRoute.js
│   ├── productRoute.js
│   ├── reviewRoute.js
│   ├── statisticsRoute.js
│   ├── userRoute.js
│   └── wishlistRoute.js
│
├── server.js            # Entry point
└── vercel.json          # Vercel deployment config
```

### Công Nghệ Sử Dụng

- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: MongoDB (Mongoose 8.16.0)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.0.1
- **Image Storage**: Cloudinary 2.6.1
- **Payment**: 
  - Stripe 18.2.1
  - Razorpay 2.9.6
- **Validation**: validator 13.15.15

### API Endpoints

#### User Routes (`/api/user`)
- `POST /register` - Đăng ký
- `POST /login` - Đăng nhập
- `GET /verify` - Xác thực email

#### Product Routes (`/api/product`)
- `GET /list` - Danh sách sản phẩm
- `GET /:id` - Chi tiết sản phẩm

#### Cart Routes (`/api/cart`)
- `POST /add` - Thêm vào giỏ hàng
- `POST /update` - Cập nhật số lượng
- `POST /get` - Lấy giỏ hàng

#### Order Routes (`/api/order`)
- `POST /place` - Đặt hàng (COD)
- `POST /stripe` - Thanh toán Stripe
- `POST /razorpay` - Thanh toán Razorpay
- `POST /userorders` - Lịch sử đơn hàng

#### Wishlist Routes (`/api/wishlist`)
- `GET /get` - Lấy danh sách yêu thích
- `POST /add` - Thêm yêu thích
- `POST /remove` - Xóa yêu thích

#### Review Routes (`/api/review`)
- `POST /add` - Thêm đánh giá

---

## 👨‍💼 Admin (Admin Portal)

### Cấu Trúc Thư Mục

```
admin/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/          # Icons, images
│   │   ├── add_icon.png
│   │   ├── delete_icon.png
│   │   ├── dashboard.png
│   │   ├── icon_thongke.png
│   │   ├── list_order_icon.png
│   │   ├── logo.png
│   │   ├── order_icon.png
│   │   ├── parcel_icon.svg
│   │   ├── upload_area.png
│   │   └── user_icon.png
│   │
│   ├── components/      # Reusable components
│   │   ├── ConfirmModal.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── SimpleChart.jsx
│   │
│   ├── pages/           # Admin pages
│   │   ├── Add.jsx      # Thêm sản phẩm
│   │   ├── Dashboard.jsx
│   │   ├── Edit.jsx     # Sửa sản phẩm
│   │   ├── List.jsx     # Danh sách sản phẩm
│   │   ├── Orders.jsx   # Quản lý đơn hàng
│   │   ├── Statistics.jsx
│   │   └── Users.jsx    # Quản lý users
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

### Công Nghệ Sử Dụng

- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.0
- **Routing**: React Router DOM 7.6.2
- **Styling**: Tailwind CSS 4.1.11
- **HTTP Client**: Axios 1.10.0
- **Notifications**: React Toastify 11.0.5

### Chức Năng Chính

1. **Dashboard** (`Dashboard.jsx`)
   - Thống kê tổng quan
   - Charts & graphs

2. **Quản Lý Sản Phẩm** (`List.jsx`, `Add.jsx`, `Edit.jsx`)
   - Xem danh sách
   - Thêm sản phẩm mới
   - Sửa thông tin sản phẩm
   - Xóa sản phẩm
   - Upload hình ảnh

3. **Quản Lý Đơn Hàng** (`Orders.jsx`)
   - Xem tất cả đơn hàng
   - Cập nhật trạng thái đơn hàng

4. **Quản Lý Users** (`Users.jsx`)
   - Danh sách users
   - Quản lý quyền truy cập

5. **Thống Kê** (`Statistics.jsx`)
   - Báo cáo doanh thu
   - Phân tích dữ liệu

---

## 🔐 Authentication & Authorization

### User Authentication
- JWT token-based authentication
- Token lưu trong `localStorage`
- Protected routes sử dụng `ProtectedRoute` component

### Admin Authentication
- Middleware `adminAuth.js` kiểm tra quyền admin
- Tách biệt với user authentication

---

## 📦 Database Models

### User Model
- Thông tin user
- Password (hashed)
- Role (user/admin)

### Product Model
- Thông tin sản phẩm
- Hình ảnh
- Giá, size, số lượng
- Categories

### Order Model
- Thông tin đơn hàng
- Items
- Address
- Payment method
- Status

### Review Model
- Product reviews
- Ratings
- Comments
- Images

### Cart Model
- User cart items
- Stored in database (sync với localStorage)

---

## 🚀 Deployment

### Vercel Configuration
Mỗi ứng dụng có file `vercel.json` riêng:
- `frontend/vercel.json`
- `backend/vercel.json`
- `admin/vercel.json`

### Environment Variables

**Frontend:**
- `VITE_BACKEND_URL` - Backend API URL

**Backend:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLOUDINARY_*` - Cloudinary credentials
- `STRIPE_*` - Stripe API keys
- `RAZORPAY_*` - Razorpay API keys

---

## 📝 Scripts

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Lint code
```

### Backend
```bash
npm start        # Start server
npm run server   # Start with nodemon (dev)
```

### Admin
```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Lint code
```

---

## 🔄 Data Flow

1. **User Action** → Frontend Component
2. **API Call** → Axios request
3. **Backend Route** → Controller
4. **Controller** → Model (Database)
5. **Response** → Frontend
6. **State Update** → Context API
7. **UI Re-render** → React

---

## 🎯 Key Features

### Frontend
- ✅ Responsive design (Mobile-first)
- ✅ Product search & filter
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Order management
- ✅ Product reviews
- ✅ Payment integration (Stripe, Razorpay, COD)
- ✅ Protected routes
- ✅ Form validation
- ✅ Image optimization

### Backend
- ✅ RESTful API
- ✅ JWT authentication
- ✅ File upload (Cloudinary)
- ✅ Payment processing
- ✅ Order management
- ✅ Statistics & analytics

### Admin
- ✅ Product CRUD
- ✅ Order management
- ✅ User management
- ✅ Dashboard & statistics
- ✅ Image upload

---

## 📚 Best Practices

1. **Code Organization**
   - Tách components theo chức năng
   - Reusable components trong `components/`
   - Page components trong `pages/`

2. **State Management**
   - Global state: Context API
   - Local state: useState hook

3. **API Calls**
   - Tập trung trong controllers
   - Error handling với try-catch
   - Toast notifications cho feedback

4. **Security**
   - JWT tokens
   - Password hashing (bcrypt)
   - Protected routes
   - Input validation

5. **Performance**
   - React.memo cho components
   - Lazy loading (nếu cần)
   - Image optimization

---

## 🔧 Development Workflow

1. **Setup**
   ```bash
   # Install dependencies
   cd frontend && npm install
   cd ../backend && npm install
   cd ../admin && npm install
   ```

2. **Development**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run server
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   
   # Terminal 3: Admin
   cd admin && npm run dev
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in required variables

---

## 📞 Support

Để biết thêm chi tiết về từng component, xem:
- `frontend/COMPONENT_UPGRADE_CHECKLIST.md` - Component documentation
- Individual component files có comments inline

---

**Last Updated**: 2024
**Version**: 1.0.0


