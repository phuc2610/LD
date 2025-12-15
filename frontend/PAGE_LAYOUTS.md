# Page Layouts - Premium Redesign

## 🏠 A. Home Page Layout

### Wireframe
```
┌─────────────────────────────────────────┐
│              HERO SECTION                │
│  ┌──────────────────────────────────┐  │
│  │ Tag (NEW COLLECTION)             │  │
│  │ H1 (Main Headline)                │  │
│  │ CTA Button                        │  │
│  │ Trust Badges (4 items)            │  │
│  └──────────────────────────────────┘  │
│  py-24 sm:py-32 lg:py-40              │
├─────────────────────────────────────────┤
│         BEST SELLERS SECTION            │
│  ┌──────────────────────────────────┐  │
│  │ Section Header                   │  │
│  │  - Title: "Sản phẩm bán chạy"    │  │
│  │  - View All Link (right)         │  │
│  │                                  │  │
│  │ Product Grid (5 cols desktop)    │  │
│  │ gap-4 sm:gap-6                   │  │
│  └──────────────────────────────────┘  │
│  py-16 sm:py-20 lg:py-24              │
├─────────────────────────────────────────┤
│         NEW ARRIVALS SECTION            │
│  ┌──────────────────────────────────┐  │
│  │ Section Header                   │  │
│  │  - Title: "Bộ sưu tập mới nhất"  │  │
│  │  - View All Link                 │  │
│  │                                  │  │
│  │ Product Grid (5 cols desktop)    │  │
│  └──────────────────────────────────┘  │
│  py-16 sm:py-20 lg:py-24              │
├─────────────────────────────────────────┤
│         BRAND STORY SECTION             │
│  ┌──────────────────────────────────┐  │
│  │ Image + Text (2 cols desktop)    │  │
│  │  - Left: Image                  │  │
│  │  - Right: Heading + Description  │  │
│  └──────────────────────────────────┘  │
│  py-20 sm:py-24 lg:py-32              │
├─────────────────────────────────────────┤
│         POLICY SECTION                  │
│  ┌──────────────────────────────────┐  │
│  │ 4 Column Grid (desktop)          │  │
│  │  - Free Shipping                 │  │
│  │  - Easy Returns                  │  │
│  │  - Secure Payment                │  │
│  │  - 24/7 Support                  │  │
│  └──────────────────────────────────┘  │
│  py-16 sm:py-20                        │
├─────────────────────────────────────────┤
│         NEWSLETTER SECTION              │
│  ┌──────────────────────────────────┐  │
│  │ Centered Content                 │  │
│  │  - Heading                       │  │
│  │  - Description                   │  │
│  │  - Input + Button                │  │
│  └──────────────────────────────────┘  │
│  py-20 sm:py-24 lg:py-32              │
└─────────────────────────────────────────┘
```

### Tailwind Classes
```jsx
// Hero Section
<div className="relative w-full bg-white overflow-hidden">
  <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9]">
    {/* Hero Image */}
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="absolute inset-0 flex items-center justify-center sm:justify-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-md">
          <p className="text-xs sm:text-sm font-light uppercase tracking-[0.2em] text-white mb-4">
            Tag Text
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-wider text-white mb-6 leading-tight">
            Main Headline
          </h1>
          <button className="bg-[#111111] text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300">
            CTA Button
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

// Section with Header
<section className="py-16 sm:py-20 lg:py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Header */}
    <div className="flex items-center justify-between mb-12 lg:mb-16">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-wider text-[#111111]">
        Section Title
      </h2>
      <a href="/collection" className="text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] hover:opacity-60 transition-opacity duration-300">
        Xem tất cả →
      </a>
    </div>
    
    {/* Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {/* Product Items */}
    </div>
  </div>
</section>
```

### Mobile Considerations
- Hero: Full width, centered text
- Sections: 2 columns for products
- Headers: Stack title + link vertically
- Spacing: Reduce padding on mobile (py-12 → py-16)

---

## 📦 B. Collection / Listing Page Layout

### Wireframe
```
┌─────────────────────────────────────────┐
│           PAGE HEADER                   │
│  ┌──────────────────────────────────┐  │
│  │ H1: "Tất cả sản phẩm"           │  │
│  │ Subtitle: "X kết quả"           │  │
│  │ Breadcrumb (optional)            │  │
│  └──────────────────────────────────┘  │
│  py-12 sm:py-16 lg:py-20              │
├─────────────────────────────────────────┤
│           TOOLBAR                       │
│  ┌──────────────────────────────────┐  │
│  │ Desktop:                         │  │
│  │  [Filter Chips] [Sort] [View]   │  │
│  │                                  │  │
│  │ Mobile:                         │  │
│  │  [Filter Button] [Sort Button]  │  │
│  └──────────────────────────────────┘  │
│  border-b border-[#e5e5e5] pb-4     │
├──────────────┬─────────────────────────┤
│              │                         │
│   SIDEBAR    │    MAIN CONTENT         │
│   (Desktop)  │                         │
│              │    ┌─────────────────┐  │
│   - Filter   │    │ Active Filters  │  │
│   - Price    │    │ [Chip] [Chip]   │  │
│   - Size     │    │ [Clear All]     │  │
│   - Color    │    └─────────────────┘  │
│   - Brand    │                         │
│              │    ┌─────────────────┐  │
│   w-64       │    │ Product Grid     │  │
│   sticky     │    │ (4 cols desktop)│  │
│   top-24     │    │ gap-4 sm:gap-6  │  │
│              │    └─────────────────┘  │
│              │                         │
│              │    ┌─────────────────┐  │
│              │    │ Pagination       │  │
│              │    └─────────────────┘  │
│              │                         │
└──────────────┴─────────────────────────┘
```

### Tailwind Classes
```jsx
// Page Header
<div className="py-12 sm:py-16 lg:py-20 bg-white border-b border-[#e5e5e5]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-wider text-[#111111] mb-2">
      Tất cả sản phẩm
    </h1>
    <p className="text-sm font-light text-[#222222]">
      {filterProducts.length} kết quả
    </p>
  </div>
</div>

// Main Layout (Desktop 2 columns)
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
    {/* Sidebar (Desktop) */}
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-24 space-y-6">
        {/* Filter Sections */}
      </div>
    </aside>
    
    {/* Main Content */}
    <main className="lg:col-span-9">
      {/* Active Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Filter Chips */}
        <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors">
          Filter Name
          <span>×</span>
        </button>
        <button className="text-xs font-light uppercase tracking-wide text-[#222222] hover:text-[#111111] transition-colors">
          Xóa tất cả
        </button>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Product Items */}
      </div>
      
      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        {/* Pagination Component */}
      </div>
    </main>
  </div>
</div>

// Mobile Filter Drawer
<div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
  <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-[#e5e5e5] animate-slideInRight">
    {/* Filter Content */}
  </div>
</div>
```

### Mobile Considerations
- Sidebar: Hidden, use drawer instead
- Toolbar: Stack buttons vertically
- Grid: 2 columns
- Filter: Drawer from right
- Active filters: Horizontal scroll

---

## 🛍️ C. Product Detail Page Layout

### Wireframe
```
┌─────────────────────────────────────────┐
│           BREADCRUMB (Optional)         │
│  Home > Category > Product Name         │
│  py-4 sm:py-6                           │
├─────────────────────────────────────────┤
│         PRODUCT MAIN SECTION            │
│  ┌──────────────┬──────────────────┐  │
│  │              │                  │  │
│  │   GALLERY    │   PRODUCT INFO   │  │
│  │              │                  │  │
│  │  - Main      │  - Title         │  │
│  │    Image     │  - Rating        │  │
│  │  - Thumbnail │  - Price         │  │
│  │    Strip     │  - Description   │  │
│  │              │  - Size Select   │  │
│  │  flex-1      │  - Add to Cart   │  │
│  │              │  - Trust Info    │  │
│  │              │                  │  │
│  │              │  flex-1          │  │
│  │              │  lg:max-w-md     │  │
│  │              │  lg:sticky       │  │
│  │              │  top-24          │  │
│  └──────────────┴──────────────────┘  │
│  gap-8 sm:gap-12 lg:gap-16            │
│  mb-16 sm:mb-20                       │
├─────────────────────────────────────────┤
│         TABS SECTION                    │
│  ┌──────────────────────────────────┐  │
│  │ [Description] [Reviews] [Size]   │  │
│  │                                  │  │
│  │ Tab Content                      │  │
│  │  - Description Text             │  │
│  │  - Reviews List                  │  │
│  │  - Size Guide                    │  │
│  └──────────────────────────────────┘  │
│  border-t border-[#e5e5e5] pt-12    │
│  mb-16 sm:mb-20                       │
├─────────────────────────────────────────┤
│         RELATED PRODUCTS                 │
│  ┌──────────────────────────────────┐  │
│  │ Section Header                   │  │
│  │  - Title: "Sản phẩm liên quan"   │  │
│  │                                  │  │
│  │ Product Grid (4 cols desktop)    │  │
│  └──────────────────────────────────┘  │
│  py-16 sm:py-20                       │
└─────────────────────────────────────────┘
```

### Tailwind Classes
```jsx
// Product Main Section
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 mb-16 sm:mb-20">
    {/* Gallery */}
    <div className="flex-1 flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] sm:w-[18%]">
        {/* Thumbnail Images */}
      </div>
      {/* Main Image */}
      <div className="w-full sm:w-[82%]">
        <img className="w-full h-auto object-cover" src={image} alt={name} />
      </div>
    </div>
    
    {/* Product Info - Sticky on Desktop */}
    <div className="flex-1 lg:max-w-md">
      <div className="lg:sticky lg:top-24 space-y-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-wider text-[#111111]">
          {name}
        </h1>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          {/* Stars */}
        </div>
        
        {/* Price */}
        <p className="text-2xl sm:text-3xl font-light text-[#F5C842]">
          {price}
        </p>
        
        {/* Description */}
        <p className="text-sm text-[#222222] font-light leading-relaxed">
          {description}
        </p>
        
        {/* Size Selector */}
        <div>
          <p className="text-xs font-light uppercase tracking-wider text-[#111111] mb-3">
            Chọn size
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Size Buttons */}
          </div>
        </div>
        
        {/* Add to Cart */}
        <button className="w-full bg-[#111111] text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300">
          Thêm vào giỏ hàng
        </button>
        
        {/* Trust Info */}
        <div className="border-t border-[#e5e5e5] pt-6">
          {/* Trust Points */}
        </div>
      </div>
    </div>
  </div>
  
  {/* Tabs Section */}
  <div className="border-t border-[#e5e5e5] pt-12 mb-16 sm:mb-20">
    <div className="flex border-b border-[#e5e5e5]">
      {/* Tab Buttons */}
    </div>
    <div className="py-8">
      {/* Tab Content */}
    </div>
  </div>
</div>
```

### Mobile Considerations
- Gallery: Thumbnails horizontal scroll
- Info: Not sticky, full width
- Tabs: Scroll horizontally if needed
- Add to Cart: Sticky bottom bar (optional)

---

## 🛒 D. Cart Page Layout

### Wireframe
```
┌─────────────────────────────────────────┐
│           PAGE HEADER                   │
│  H1: "Giỏ hàng của bạn"                │
│  py-12 sm:py-16                        │
├──────────────┬─────────────────────────┤
│              │                         │
│   CART       │    SUMMARY              │
│   ITEMS      │    (Sticky Desktop)     │
│              │                         │
│  ┌────────┐ │    ┌─────────────────┐ │
│  │ Item 1 │ │    │ Subtotal         │ │
│  │ [img]  │ │    │ Shipping         │ │
│  │ [info] │ │    │ Total             │ │
│  │ [qty]  │ │    │                   │ │
│  └────────┘ │    │ [Checkout Button]│ │
│              │    └─────────────────┘ │
│  ┌────────┐ │                         │
│  │ Item 2 │ │    w-full sm:w-[400px] │
│  └────────┘ │    sticky top-24        │
│              │                         │
│  flex-1      │                         │
│              │                         │
└──────────────┴─────────────────────────┘

Empty State:
┌─────────────────────────────────────────┐
│         EMPTY STATE                    │
│  ┌──────────────────────────────────┐  │
│  │        [Icon/Illustration]       │  │
│  │                                  │  │
│  │    "Giỏ hàng của bạn trống"      │  │
│  │                                  │  │
│  │    [Continue Shopping Button]    │  │
│  └──────────────────────────────────┘  │
│  py-24 sm:py-32                       │
└─────────────────────────────────────────┘
```

### Tailwind Classes
```jsx
// Cart Layout
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  <div className="mb-8 lg:mb-12">
    <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-wider text-[#111111]">
      Giỏ hàng của bạn
    </h1>
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
    {/* Cart Items */}
    <div className="lg:col-span-8">
      <div className="space-y-0 border-t border-[#e5e5e5]">
        {/* Cart Items List */}
      </div>
    </div>
    
    {/* Summary - Sticky on Desktop */}
    <div className="lg:col-span-4">
      <div className="lg:sticky lg:top-24">
        <div className="bg-white border border-[#e5e5e5] p-6">
          {/* Cart Total Component */}
          <CartTotal />
          <button className="w-full mt-6 bg-[#111111] text-white text-xs sm:text-sm font-light uppercase tracking-wider py-3 hover:bg-[#222222] transition-colors duration-300">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

// Empty State
<div className="flex flex-col items-center justify-center py-24 sm:py-32">
  <div className="w-24 h-24 mb-6 text-[#e5e5e5]">
    {/* Empty Cart Icon */}
  </div>
  <h2 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-[#111111] mb-4">
    Giỏ hàng của bạn trống
  </h2>
  <p className="text-sm font-light text-[#222222] mb-8">
    Hãy thêm sản phẩm vào giỏ hàng
  </p>
  <button className="bg-[#111111] text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300">
    Tiếp tục mua sắm
  </button>
</div>
```

### Mobile Considerations
- Layout: Stack items + summary
- Summary: Not sticky, at bottom
- Checkout: Sticky bottom bar (optional)

---

## 💳 E. Checkout Page Layout

### Wireframe
```
┌─────────────────────────────────────────┐
│           PAGE HEADER                   │
│  H1: "Thanh toán"                      │
│  py-12 sm:py-16                        │
├──────────────┬─────────────────────────┤
│              │                         │
│   FORM       │    SUMMARY              │
│   SECTION    │    (Sticky Desktop)     │
│              │                         │
│  ┌────────┐ │    ┌─────────────────┐ │
│  │ Step 1 │ │    │ Order Summary    │ │
│  │ Shipping│ │    │ - Items List     │ │
│  │ Info   │ │    │ - Subtotal       │ │
│  │        │ │    │ - Shipping       │ │
│  │ [Fields]│ │    │ - Total          │ │
│  └────────┘ │    │                   │ │
│              │    │ Payment Methods  │ │
│  ┌────────┐ │    │ - Stripe         │ │
│  │ Step 2 │ │    │ - COD            │ │
│  │ Payment│ │    │                   │ │
│  │ Method │ │    │ [Place Order]    │ │
│  └────────┘ │    └─────────────────┘ │
│              │                         │
│  flex-1      │    lg:max-w-md         │
│  lg:max-w-lg │    sticky top-24       │
│              │                         │
└──────────────┴─────────────────────────┘
```

### Tailwind Classes
```jsx
// Checkout Layout (already implemented in PlaceOrder.jsx)
<div className="bg-white py-8 sm:py-16 lg:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <form className="flex flex-col lg:flex-row gap-12 lg:gap-16">
      {/* Form Section */}
      <div className="flex-1 lg:max-w-lg">
        {/* Form Fields */}
      </div>
      
      {/* Summary - Sticky */}
      <div className="flex-1 lg:max-w-md">
        <div className="lg:sticky lg:top-24 space-y-8">
          {/* Order Summary */}
          {/* Payment Methods */}
          {/* Submit Button */}
        </div>
      </div>
    </form>
  </div>
</div>
```

---

## 🔐 F. Auth / Profile / Orders Layout

### Wireframe
```
┌─────────────────────────────────────────┐
│         CENTERED CARD LAYOUT            │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │        [Logo/Icon]               │  │
│  │                                  │  │
│  │        H1: Page Title            │  │
│  │        Subtitle (optional)       │  │
│  │                                  │  │
│  │        ┌────────────────────┐    │  │
│  │        │ Form Fields        │    │  │
│  │        │ - Input 1          │    │  │
│  │        │ - Input 2          │    │  │
│  │        │ - Helper Text      │    │  │
│  │        └────────────────────┘    │  │
│  │                                  │  │
│  │        [Submit Button]           │  │
│  │                                  │  │
│  │        [Link/Footer Text]        │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  max-w-md mx-auto                      │
│  py-16 sm:py-24                       │
└─────────────────────────────────────────┘
```

### Tailwind Classes
```jsx
// Auth/Profile Layout
<div className="min-h-screen flex items-center justify-center py-16 sm:py-24 bg-white">
  <div className="w-full max-w-md mx-auto px-4 sm:px-6">
    <div className="bg-white border border-[#e5e5e5] p-8 sm:p-12">
      {/* Logo/Icon */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-wider text-[#111111] mb-2">
          Page Title
        </h1>
        <p className="text-sm font-light text-[#222222]">
          Subtitle
        </p>
      </div>
      
      {/* Form */}
      <form className="space-y-6">
        {/* Form Fields */}
      </form>
    </div>
  </div>
</div>

// Orders List
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-wider text-[#111111] mb-8">
    Đơn hàng của tôi
  </h1>
  
  {/* Desktop: Table */}
  <div className="hidden md:block">
    <table className="w-full border-collapse">
      {/* Table Headers */}
      {/* Table Rows */}
    </table>
  </div>
  
  {/* Mobile: Card List */}
  <div className="md:hidden space-y-4">
    {/* Order Cards */}
  </div>
</div>
```

---

*Last Updated: 2024*


