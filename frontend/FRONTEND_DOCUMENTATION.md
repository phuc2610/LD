# TLookShop 前端文档

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [核心架构](#核心架构)
5. [组件详细分析](#组件详细分析)
6. [页面详细分析](#页面详细分析)
7. [状态管理](#状态管理)
8. [路由配置](#路由配置)
9. [API集成](#api集成)
10. [样式系统](#样式系统)
11. [用户体验特性](#用户体验特性)
12. [环境配置](#环境配置)

---

## 项目概述

TLookShop 是一个现代化的电商前端应用，专注于羽毛球拍销售。前端采用 React 19 + Vite 构建，使用 Tailwind CSS 进行样式设计，提供流畅的用户体验和响应式设计。

### 主要特性
- 🛒 完整的购物车功能
- 🔐 用户认证系统
- 📦 订单管理
- 🔍 产品搜索和筛选
- 💳 多种支付方式支持
- 📱 完全响应式设计
- 🎨 现代化UI设计

---

## 技术栈

### 核心框架
- **React 19.1.0** - 用户界面库
- **React Router DOM 7.6.1** - 路由管理
- **Vite 6.3.5** - 构建工具和开发服务器

### 样式框架
- **Tailwind CSS 3.4.17** - 实用优先的CSS框架
- **PostCSS 8.5.4** - CSS后处理器
- **Autoprefixer 10.4.21** - 自动添加浏览器前缀

### HTTP客户端
- **Axios 1.10.0** - 用于API请求

### UI/UX库
- **React Toastify 11.0.5** - 通知提示组件
- **@formspree/react 3.0.0** - 表单处理（用于联系表单）

### 开发工具
- **ESLint 9.25.0** - 代码质量检查
- **TypeScript类型定义** - 提供类型提示

---

## 项目结构

```
frontend/
├── public/                 # 静态资源
│   └── vite.svg
├── src/
│   ├── assets/           # 图片、图标等资源文件
│   │   ├── assets.js     # 资源导出文件
│   │   └── [109 files]   # 图片资源（81 webp, 19 png, 8 jpg）
│   ├── components/       # 可复用组件
│   │   ├── BestSeller.jsx
│   │   ├── CartTotal.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── LatestCollection.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   ├── NewsletterBox.jsx
│   │   ├── OurPolicy.jsx
│   │   ├── ProductItem.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── QuickAddModal.jsx
│   │   ├── RelatedProducts.jsx
│   │   ├── SearchBar.jsx
│   │   └── Title.jsx
│   ├── context/          # 状态管理
│   │   └── ShopContext.jsx
│   ├── pages/            # 页面组件
│   │   ├── About.jsx
│   │   ├── Cart.jsx
│   │   ├── Collection.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   ├── PlaceOrder.jsx
│   │   ├── Product.jsx
│   │   ├── Profile.jsx
│   │   └── Verify.jsx
│   ├── App.jsx           # 主应用组件
│   ├── main.jsx          # 应用入口
│   └── index.css         # 全局样式
├── index.html            # HTML模板
├── package.json          # 项目依赖
├── vite.config.js        # Vite配置
├── tailwind.config.js    # Tailwind配置
├── postcss.config.js     # PostCSS配置
└── eslint.config.js      # ESLint配置
```

---

## 核心架构

### 应用入口 (`main.jsx`)

应用使用以下结构初始化：

```1:14:frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ShopContextProvider>
     <App />
  </ShopContextProvider>
  </BrowserRouter>,
)
```

**架构特点：**
- 使用 `BrowserRouter` 提供路由功能
- `ShopContextProvider` 包裹整个应用，提供全局状态
- 采用函数式组件和Hooks

### 主应用组件 (`App.jsx`)

```20:51:frontend/src/App.jsx
const App = () => {

 
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};
```

**设计模式：**
- 布局组件（Navbar, Footer）在所有页面共享
- SearchBar 条件渲染（仅在collection页面显示）
- 使用 `ProtectedRoute` 保护需要认证的页面
- 响应式容器宽度设计

---

## 组件详细分析

### 1. Navbar（导航栏）

**位置：** `src/components/Navbar.jsx`

**功能：**
- 网站导航菜单
- 用户认证状态显示
- 购物车图标和数量显示
- 搜索功能触发
- 移动端响应式菜单

**关键特性：**
- 粘性定位（sticky top-0）
- 用户下拉菜单（个人资料、订单、登出）
- 移动端侧边栏菜单
- 购物车数量徽章显示

**状态管理：**
- 使用 `ShopContext` 获取用户信息、购物车数量
- 本地状态管理移动菜单显示

### 2. SearchBar（搜索栏）

**位置：** `src/components/SearchBar.jsx`

**功能：**
- 产品搜索输入框
- 仅在 `/collection` 页面显示
- 实时搜索过滤

**实现逻辑：**
```1:30:frontend/src/components/SearchBar.jsx
import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';
const SearchBar = () => {

    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible,setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(location.pathname.includes('collection')){
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    },[location])


  return showSearch && visible  ? (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 p-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 '>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className='flex-1 outline-none bg-inherrit text-sm' type="text" placeholder='Search' />
            <img className='w-4' src={assets.search_icon} alt="" />
        </div>
        <img onClick={() => setShowSearch(false)} className='inline w-3 cursor-pointer' src={assets.cross_icon} alt="" />
    </div>
  ) : null
}
```

### 3. ProductItem（产品卡片）

**位置：** `src/components/ProductItem.jsx`

**功能：**
- 产品信息展示卡片
- 产品图片、名称、价格显示
- 悬停效果和动画
- 链接到产品详情页

**特性：**
- 图片懒加载骨架屏
- 悬停时显示"Chi tiết"覆盖层
- 星级评分显示
- 响应式设计

### 4. ProtectedRoute（路由保护）

**位置：** `src/components/ProtectedRoute.jsx`

**功能：**
- 保护需要认证的页面
- 未登录用户重定向到登录页

```1:16:frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { token, navigate } = useContext(ShopContext);

  if (!token) {
    navigate("/login");
    return null;
  }

  return children;
};
```

### 5. CartTotal（购物车总计）

**位置：** `src/components/CartTotal.jsx`

**功能：**
- 显示购物车总金额
- 计算运费
- 显示最终总价

```1:34:frontend/src/components/CartTotal.jsx
import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {currency , delivery_fee , getCartAmount} = useContext(ShopContext);


  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'Tổng tiền'} text2={'giỏ hàng'} />
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Tạm tính</p>
                <p>{getCartAmount().toLocaleString('vi-VN')}{currency}</p>
            </div>
            <hr/>
            <div className='flex justify-between'>
                <p>Phí giao hàng</p>
                <p>{delivery_fee.toLocaleString('vi-VN')}{currency}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Tổng tiền</b>
                <b>{getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee).toLocaleString('vi-VN')}{currency}</b>
            </div>
        </div>
    </div>
  )
}
```

### 6. Hero（首页横幅）

**位置：** `src/components/Hero.jsx`

**功能：**
- 首页主视觉区域
- 品牌展示和营销信息
- 渐变背景和动画效果

### 7. Footer（页脚）

**位置：** `src/components/Footer.jsx`

**功能：**
- 网站页脚信息
- 链接和联系方式

### 其他组件
- **BestSeller** - 畅销产品展示
- **LatestCollection** - 最新产品集合
- **OurPolicy** - 政策说明
- **NewsletterBox** - 订阅邮件
- **RelatedProducts** - 相关产品推荐
- **Title** - 标题组件（带装饰线）
- **Loading** - 加载状态组件
- **QuickAddModal** - 快速添加到购物车模态框

---

## 页面详细分析

### 1. Home（首页）

**位置：** `src/pages/Home.jsx`

**功能：**
- 网站首页
- 组合多个展示组件

**组件结构：**
```8:18:frontend/src/pages/Home.jsx
const Home = () => {
  return (
    <div className='bg-white'>
      <Hero />
      <LatestCollection/>
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}
```

### 2. Collection（产品集合页）

**位置：** `src/pages/Collection.jsx`

**功能：**
- 显示所有产品
- 产品筛选（品牌、风格）
- 产品排序（价格）
- 搜索功能集成

**关键功能：**

**筛选逻辑：**
```35:50:frontend/src/pages/Collection.jsx
  const applyFilter =() => {
    let productsCopy = products.slice();

    if(showSearch && search.length ){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if(category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if(subCategory.length > 0){
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  }
```

**排序功能：**
```52:66:frontend/src/pages/Collection.jsx
  const sortProduct = () =>{
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;
      
      default:
        applyFilter();
        break;
    }
  }
```

**筛选选项：**
- 品牌：Yonex, Victor, Lining
- 风格：Tấn công (攻击), Phòng thủ (防守), Công thủ toàn diện (全面)

### 3. Product（产品详情页）

**位置：** `src/pages/Product.jsx`

**功能：**
- 产品详细信息展示
- 多图片展示和切换
- 尺寸选择
- 添加到购物车
- 相关产品推荐

**关键实现：**
```30:42:frontend/src/pages/Product.jsx
  const fetchProductData = async () => {
    if (products && products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);
```

**产品信息显示：**
- 产品名称、价格、描述
- 星级评分
- 尺寸选择器
- 添加到购物车按钮
- 产品详情和评价标签页

### 4. Cart（购物车页）

**位置：** `src/pages/Cart.jsx`

**功能：**
- 显示购物车中的所有商品
- 修改商品数量
- 删除商品
- 显示总价
- 跳转到结算页面

**数据结构：**
购物车使用嵌套对象结构：
```javascript
cartItems = {
  "productId1": {
    "S": 2,  // 尺寸S，数量2
    "M": 1   // 尺寸M，数量1
  },
  "productId2": {
    "L": 3
  }
}
```

**购物车数据处理：**
```13:30:frontend/src/pages/Cart.jsx
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems]);
```

### 5. Login（登录/注册页）

**位置：** `src/pages/Login.jsx`

**功能：**
- 用户登录
- 用户注册
- 表单验证
- 自动重定向（已登录用户）

**状态切换：**
```11:11:frontend/src/pages/Login.jsx
  const [currentState , setCurrentState] = useState('Đăng nhập');
```

**登录逻辑：**
```36:44:frontend/src/pages/Login.jsx
        const response  = await axios.post(backendUrl + '/api/user/login' , {email,password});
        if(response.data.success){
          setToken(response.data.token);
          setUser(response.data.user);
          localStorage.setItem('token' , response.data.token);
          localStorage.setItem('user' , JSON.stringify(response.data.user));
        } else {
          toast.error(response.data.message);
        }
```

### 6. PlaceOrder（下单页）

**位置：** `src/pages/PlaceOrder.jsx`

**功能：**
- 收集配送信息
- 选择支付方式
- 提交订单

**支付方式：**
- COD（货到付款）
- Stripe（在线支付）
- Razorpay（在线支付）

**订单数据结构：**
```51:55:frontend/src/pages/PlaceOrder.jsx
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
```

**表单字段：**
- 姓名（firstName, lastName）
- 邮箱（email）
- 地址（street, city, state, zipcode, country）
- 电话（phone）

### 7. Orders（订单页）

**位置：** `src/pages/Orders.jsx`

**功能：**
- 显示用户所有订单
- 订单状态显示
- 订单跟踪

**订单数据处理：**
```14:41:frontend/src/pages/Orders.jsx
  const loadOrderData = async () => {
    try {
      if(!token){
          return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}});
      if (response.data.success){
        let allOrdersItem = []
        response.data.orders.map((order) => {
            order.items.map((item)=>{
              item['status'] = order.status
              item['payment'] = order.payment
              item['paymentMethod'] = order.paymentMethod
              item['createdAt'] = order.createdAt
              // item['date'] = order.date
              allOrdersItem.push(item)
            })
        })
        setorderData(allOrdersItem.reverse());
        
      }
      

    } catch (error) {
      
    }
  }
```

### 8. Profile（个人资料页）

**位置：** `src/pages/Profile.jsx`

**功能：**
- 查看和编辑个人信息
- 修改密码
- 用户头像显示

**个人信息字段：**
- 姓名（name）
- 邮箱（email）
- 电话（phone_number）
- 性别（gender）
- 地址（address）

**密码修改：**
- 当前密码验证
- 新密码确认
- 密码强度要求（最少8个字符）

### 9. About（关于页）

**位置：** `src/pages/About.jsx`

**功能：**
- 公司/品牌介绍
- 品牌故事展示

### 10. Contact（联系页）

**位置：** `src/pages/Contact.jsx`

**功能：**
- 联系表单
- 使用 Formspree 处理表单提交

### 11. Verify（验证页）

**位置：** `src/pages/Verify.jsx`

**功能：**
- 邮箱验证
- 账户激活

---

## 状态管理

### ShopContext（全局状态管理）

**位置：** `src/context/ShopContext.jsx`

**提供的状态和方法：**

#### 状态变量
```13:18:frontend/src/context/ShopContext.jsx
    const [search,setSearch] = useState('');
    const [showSearch , setShowSearch] = useState(false);
    const[cartItems , setCartItems] = useState({});
    const [products , setProducts] = useState([]);
    const [token ,setToken] = useState('');
    const [user , setUser] = useState(null);
```

#### 常量
```10:11:frontend/src/context/ShopContext.jsx
    const currency = ' đ';
    const delivery_fee = 30000;
```

#### 核心方法

**1. addToCart - 添加到购物车**
```24:61:frontend/src/context/ShopContext.jsx
    const addToCart = async(itemId , size) =>{

        if(!size){
            toast.error('Vui lòng chọn size sản phẩm !');
            return;
        } else {
            toast.success('Sản phẩm đã được thêm vào giỏ hàng');
        }


        let cartData = structuredClone(cartItems);
        
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] +=1;
            }
            else{
                cartData[itemId][size] =1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if(token) {
            try {

                await axios.post(backendUrl + '/api/cart/add' , {itemId,size} , {headers:{token}});

            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }

    }
```

**2. getCartCount - 获取购物车商品总数**
```63:79:frontend/src/context/ShopContext.jsx
    const getCartCount = () =>{
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                    
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
        return totalCount;
    }
```

**3. updateQuantity - 更新商品数量**
```81:94:frontend/src/context/ShopContext.jsx
    const updateQuantity = async(itemId ,size ,quantity) =>{
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if(token) {
            try {
                await axios.post(backendUrl + '/api/cart/update' , {itemId,size,quantity} , {headers:{token}});
            } catch (error) {
                
            }
        }
    }
```

**4. getCartAmount - 计算购物车总金额**
```96:111:frontend/src/context/ShopContext.jsx
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }
```

**5. getProductsData - 获取产品列表**
```113:128:frontend/src/context/ShopContext.jsx
    const getProductsData = async () =>{
      
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setProducts(response.data.products);
                
            } else {
                toast.error(response.data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
```

**6. getUserCart - 获取用户购物车（已登录）**
```130:140:frontend/src/context/ShopContext.jsx
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get' , {} , {headers:{token}});
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
```

**初始化逻辑：**
```142:154:frontend/src/context/ShopContext.jsx
    useEffect(() => {
        getProductsData();
    },[])

    useEffect(() =>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
         if(!user && localStorage.getItem('user')){
            setUser(JSON.parse(localStorage.getItem('user')));
        }
    },[])
```

**Context值导出：**
```156:163:frontend/src/context/ShopContext.jsx
    const value = {
        products , currency , delivery_fee,
        search, setSearch,showSearch, setShowSearch,
        cartItems , addToCart , setCartItems ,
        getCartCount , updateQuantity ,
        getCartAmount, navigate , backendUrl,
        setToken,token , user , setUser,
    }
```

---

## 路由配置

### 路由结构

```28:47:frontend/src/App.jsx
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
```

### 路由说明

| 路径 | 组件 | 说明 | 需要认证 |
|------|------|------|----------|
| `/` | Home | 首页 | ❌ |
| `/collection` | Collection | 产品集合页 | ❌ |
| `/about` | About | 关于页 | ❌ |
| `/contact` | Contact | 联系页 | ❌ |
| `/product/:productId` | Product | 产品详情页 | ❌ |
| `/cart` | Cart | 购物车页 | ❌ |
| `/login` | Login | 登录/注册页 | ❌ |
| `/place-order` | PlaceOrder | 下单页 | ❌ |
| `/orders` | Orders | 订单列表页 | ❌ |
| `/verify` | Verify | 验证页 | ❌ |
| `/profile` | Profile | 个人资料页 | ✅ |

---

## API集成

### API基础配置

**后端URL：**
```12:12:frontend/src/context/ShopContext.jsx
    const backendUrl = import.meta.env.VITE_BACKEND_URL
```

使用环境变量 `VITE_BACKEND_URL` 配置后端API地址。

### API端点

#### 用户相关
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息/密码

#### 产品相关
- `GET /api/product/list` - 获取产品列表

#### 购物车相关
- `POST /api/cart/add` - 添加商品到购物车
- `POST /api/cart/update` - 更新购物车商品数量
- `POST /api/cart/get` - 获取用户购物车

#### 订单相关
- `POST /api/order/place` - 创建订单（COD）
- `POST /api/order/stripe` - 创建订单（Stripe支付）
- `POST /api/order/userorders` - 获取用户订单列表

### 请求头配置

所有需要认证的请求都包含token：
```javascript
headers: { token }
```

### 错误处理

使用 `react-toastify` 显示错误和成功消息：
```javascript
toast.error(error.message);
toast.success('操作成功');
```

---

## 样式系统

### Tailwind CSS配置

**配置文件：** `tailwind.config.js`

**自定义主题：**
```1:52:frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'display': ['Prata', 'serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#faf5ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slideInUp': 'slideInUp 0.5s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
```

### 全局样式

**文件：** `src/index.css`

**主要特性：**
- Google Fonts集成（Roboto, Prata）
- 自定义滚动条样式
- 渐变背景
- 动画定义
- 响应式工具类

**关键样式：**
```1:46:frontend/src/index.css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Prata&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2563eb, #7c3aed);
}

/* Base styles */
* {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Vietnamese font support */
html {
  font-feature-settings: "kern" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 设计系统

**颜色方案：**
- 主色：蓝色系（#3b82f6, #2563eb）
- 次色：紫色系（#8b5cf6, #7c3aed）
- 强调色：红色（#e8002d）用于价格
- 背景：渐变灰色系

**字体：**
- 正文：Roboto（无衬线）
- 标题：Prata（衬线）

**间距系统：**
使用Tailwind默认间距系统（4px基准）

**响应式断点：**
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

---

## 用户体验特性

### 1. 响应式设计
- 移动端优先设计
- 断点适配（sm, md, lg）
- 触摸友好的交互元素

### 2. 加载状态
- 图片懒加载骨架屏
- 加载动画
- 异步数据加载处理

### 3. 用户反馈
- Toast通知（成功/错误）
- 表单验证提示
- 操作确认

### 4. 动画效果
- 悬停效果
- 页面过渡
- 微交互

### 5. 无障碍性
- 语义化HTML
- ARIA标签
- 键盘导航支持

### 6. 性能优化
- 代码分割（路由级别）
- 图片优化（WebP格式）
- 懒加载

---

## 环境配置

### Vite配置

**文件：** `vite.config.js`

```1:8:frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173}
})
```

**开发服务器：**
- 端口：5173
- 热模块替换（HMR）支持

### 环境变量

需要在项目根目录创建 `.env` 文件：

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 构建命令

```json
{
  "scripts": {
    "dev": "vite",           // 开发服务器
    "build": "vite build",   // 生产构建
    "lint": "eslint .",      // 代码检查
    "preview": "vite preview" // 预览构建
  }
}
```

---

## 数据流

### 购物车数据流

1. **添加商品：**
   - 用户选择商品和尺寸
   - 调用 `addToCart(itemId, size)`
   - 更新本地 `cartItems` 状态
   - 如果已登录，同步到后端

2. **更新数量：**
   - 用户在购物车页面修改数量
   - 调用 `updateQuantity(itemId, size, quantity)`
   - 更新本地状态
   - 同步到后端

3. **计算总价：**
   - `getCartAmount()` 遍历购物车
   - 根据产品价格和数量计算
   - 实时更新显示

### 用户认证流程

1. **登录：**
   - 用户输入邮箱和密码
   - 调用 `/api/user/login`
   - 保存token和用户信息到localStorage
   - 更新Context状态
   - 获取用户购物车数据

2. **注册：**
   - 用户填写注册信息
   - 调用 `/api/user/register`
   - 切换到登录状态

3. **登出：**
   - 清除localStorage
   - 重置Context状态
   - 重定向到登录页

### 产品数据流

1. **初始化：**
   - 应用启动时调用 `getProductsData()`
   - 获取所有产品数据
   - 存储到Context

2. **筛选和搜索：**
   - 用户在Collection页面操作
   - 本地过滤产品数组
   - 实时更新显示

---

## 安全考虑

### 1. 认证
- Token存储在localStorage
- 所有需要认证的请求包含token头
- ProtectedRoute保护敏感页面

### 2. 数据验证
- 表单客户端验证
- 后端API验证（服务器端）

### 3. XSS防护
- React自动转义
- 避免使用dangerouslySetInnerHTML

---

## 已知问题和改进建议

### 潜在问题

1. **购物车同步：**
   - 未登录用户的购物车数据仅存储在本地
   - 建议：使用sessionStorage或IndexedDB

2. **错误处理：**
   - 部分API调用缺少完整的错误处理
   - 建议：统一错误处理中间件

3. **性能优化：**
   - 产品列表可能很大时，考虑分页或虚拟滚动
   - 图片优化可以进一步改进

### 改进建议

1. **状态管理：**
   - 考虑使用Redux或Zustand处理复杂状态
   - Context可能在大应用中性能不佳

2. **代码分割：**
   - 实现路由级别的代码分割
   - 懒加载非关键组件

3. **测试：**
   - 添加单元测试（Jest + React Testing Library）
   - 添加E2E测试（Cypress或Playwright）

4. **TypeScript：**
   - 迁移到TypeScript提高类型安全

5. **国际化：**
   - 考虑添加i18n支持多语言

---

## 总结

TLookShop前端是一个功能完整、设计现代的电商应用。它采用了React 19的最新特性，使用Tailwind CSS实现响应式设计，通过Context API管理全局状态。应用提供了完整的购物流程，包括产品浏览、购物车管理、订单处理和用户认证等功能。

**核心优势：**
- ✅ 现代化技术栈
- ✅ 响应式设计
- ✅ 良好的用户体验
- ✅ 模块化组件结构
- ✅ 清晰的代码组织

**技术亮点：**
- React Hooks和Context API
- Tailwind CSS实用优先设计
- Vite快速开发体验
- 完整的购物车逻辑
- 多支付方式支持

---

*文档最后更新：2024年*

