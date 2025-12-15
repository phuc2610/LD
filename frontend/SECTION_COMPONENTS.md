# Section Components - Reusable Layout Elements

## 📋 Component Checklist

### 1. PageHeader
**Purpose**: Standard page header with title, subtitle, breadcrumb

**Props**:
- `title` (string, required)
- `subtitle` (string, optional)
- `breadcrumb` (array, optional)
- `action` (ReactNode, optional)

**Tailwind Classes**:
```jsx
<div className="py-12 sm:py-16 lg:py-20 bg-white border-b border-[#e5e5e5]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Breadcrumb */}
    {breadcrumb && (
      <nav className="mb-4 text-xs font-light uppercase tracking-wide text-[#222222]">
        {breadcrumb.map((item, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-2">/</span>}
            {item.link ? (
              <a href={item.link} className="hover:text-[#111111] transition-colors">
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    )}
    
    {/* Title */}
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-wider text-[#111111] mb-2">
      {title}
    </h1>
    
    {/* Subtitle */}
    {subtitle && (
      <p className="text-sm font-light text-[#222222]">
        {subtitle}
      </p>
    )}
    
    {/* Action */}
    {action && (
      <div className="mt-4">
        {action}
      </div>
    )}
  </div>
</div>
```

---

### 2. SectionHeader
**Purpose**: Section title with optional "View All" link

**Props**:
- `title` (string, required)
- `subtitle` (string, optional)
- `viewAllLink` (string, optional)
- `viewAllText` (string, default: "Xem tất cả")

**Tailwind Classes**:
```jsx
<div className="flex items-center justify-between mb-8 sm:mb-12 lg:mb-16">
  <div>
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-wider text-[#111111]">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-2 text-sm font-light text-[#222222]">
        {subtitle}
      </p>
    )}
  </div>
  
  {viewAllLink && (
    <a 
      href={viewAllLink}
      className="text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] hover:opacity-60 transition-opacity duration-300 flex items-center gap-2"
    >
      {viewAllText}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  )}
</div>
```

---

### 3. Toolbar
**Purpose**: Search, sort, filter toolbar

**Props**:
- `filters` (array, optional)
- `sortOptions` (array, optional)
- `onFilterChange` (function, optional)
- `onSortChange` (function, optional)
- `activeFilters` (array, optional)

**Tailwind Classes**:
```jsx
<div className="border-b border-[#e5e5e5] pb-4 mb-8">
  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
    {/* Active Filters */}
    {activeFilters && activeFilters.length > 0 && (
      <div className="flex flex-wrap items-center gap-2 w-full mb-4">
        {activeFilters.map((filter, index) => (
          <button
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors duration-300"
          >
            {filter.label}
            <span>×</span>
          </button>
        ))}
        <button className="text-xs font-light uppercase tracking-wide text-[#222222] hover:text-[#111111] transition-colors">
          Xóa tất cả
        </button>
      </div>
    )}
    
    {/* Filter Buttons */}
    <div className="flex flex-wrap items-center gap-4">
      {/* Filter Components */}
    </div>
    
    {/* Spacer */}
    <div className="flex-1"></div>
    
    {/* Sort */}
    {sortOptions && (
      <div className="relative">
        <select className="appearance-none bg-transparent border-none text-xs sm:text-sm text-[#111111] font-light uppercase tracking-wide cursor-pointer focus:outline-none pr-6">
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
</div>
```

---

### 4. ContentGrid
**Purpose**: Responsive product/content grid

**Props**:
- `items` (array, required)
- `columns` (object, optional) - {mobile: 2, tablet: 3, desktop: 4}
- `gap` (string, optional) - default: "gap-4 sm:gap-6"
- `renderItem` (function, required)

**Tailwind Classes**:
```jsx
<div className={`grid grid-cols-${columns.mobile} sm:grid-cols-${columns.tablet} md:grid-cols-${columns.desktop} ${gap || 'gap-4 sm:gap-6'}`}>
  {items.map((item, index) => (
    <div key={index}>
      {renderItem(item, index)}
    </div>
  ))}
</div>
```

**Usage**:
```jsx
<ContentGrid
  items={products}
  columns={{mobile: 2, tablet: 3, desktop: 5}}
  gap="gap-4 sm:gap-6"
  renderItem={(product) => <ProductItem {...product} />}
/>
```

---

### 5. Sidebar / FilterDrawer
**Purpose**: Filter sidebar (desktop) or drawer (mobile)

**Props**:
- `isOpen` (boolean, required)
- `onClose` (function, required)
- `filters` (array, required)
- `onFilterChange` (function, required)

**Desktop Sidebar Classes**:
```jsx
<aside className="hidden lg:block lg:col-span-3">
  <div className="sticky top-24 space-y-6">
    {/* Filter Sections */}
    {filters.map((filter, index) => (
      <div key={index} className="border-b border-[#e5e5e5] pb-6">
        <h3 className="text-xs font-light uppercase tracking-wider text-[#111111] mb-4">
          {filter.label}
        </h3>
        <div className="space-y-2">
          {/* Filter Options */}
        </div>
      </div>
    ))}
  </div>
</aside>
```

**Mobile Drawer Classes**:
```jsx
{isOpen && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] lg:hidden animate-fadeIn"
      onClick={onClose}
    />
    
    {/* Drawer */}
    <div className="fixed top-0 right-0 h-full bg-white border-l border-[#e5e5e5] z-[9999] w-80 lg:hidden animate-slideInRight">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
          <h2 className="text-sm font-light uppercase tracking-wider text-[#111111]">
            Bộ lọc
          </h2>
          <button onClick={onClose}>
            {/* Close Icon */}
          </button>
        </div>
        
        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Filters */}
        </div>
        
        {/* Footer */}
        <div className="border-t border-[#e5e5e5] p-6">
          <button className="w-full bg-[#111111] text-white py-3 text-xs font-light uppercase tracking-wider hover:bg-[#222222] transition-colors">
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  </>
)}
```

---

### 6. EmptyState
**Purpose**: Empty state with icon, message, CTA

**Props**:
- `icon` (ReactNode, optional)
- `title` (string, required)
- `description` (string, optional)
- `action` (ReactNode, optional)

**Tailwind Classes**:
```jsx
<div className="flex flex-col items-center justify-center py-24 sm:py-32">
  {/* Icon */}
  {icon && (
    <div className="w-24 h-24 mb-6 text-[#e5e5e5]">
      {icon}
    </div>
  )}
  
  {/* Title */}
  <h2 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-[#111111] mb-4">
    {title}
  </h2>
  
  {/* Description */}
  {description && (
    <p className="text-sm font-light text-[#222222] mb-8 text-center max-w-md">
      {description}
    </p>
  )}
  
  {/* Action */}
  {action && (
    <div>
      {action}
    </div>
  )}
</div>
```

---

### 7. LoadingSkeleton
**Purpose**: Loading skeleton matching layout

**Props**:
- `type` (string) - "card" | "list" | "grid"
- `count` (number, default: 1)

**Tailwind Classes**:
```jsx
// Product Card Skeleton
<div className="bg-white border border-[#e5e5e5] overflow-hidden">
  <div className="relative overflow-hidden bg-[#f9f9f9] aspect-square">
    <div className="absolute inset-0 bg-gradient-to-br from-[#e5e5e5] via-[#f5f5f5] to-[#e5e5e5] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  </div>
  <div className="p-4 sm:p-5 bg-white">
    <div className="h-4 bg-[#e5e5e5] rounded mb-2 animate-pulse"></div>
    <div className="h-4 bg-[#e5e5e5] rounded w-3/4 mb-2.5 animate-pulse"></div>
    <div className="h-5 bg-[#F5C842] rounded w-1/2 animate-pulse"></div>
  </div>
</div>

// Grid Skeleton
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
  {[...Array(count)].map((_, index) => (
    <LoadingSkeleton key={index} type="card" />
  ))}
</div>
```

---

### 8. ErrorState
**Purpose**: Error state with message and retry

**Props**:
- `title` (string, required)
- `message` (string, optional)
- `onRetry` (function, optional)

**Tailwind Classes**:
```jsx
<div className="flex flex-col items-center justify-center py-24 sm:py-32">
  <div className="w-24 h-24 mb-6 text-[#ef4444]">
    {/* Error Icon */}
  </div>
  <h2 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-[#111111] mb-4">
    {title}
  </h2>
  {message && (
    <p className="text-sm font-light text-[#222222] mb-8 text-center max-w-md">
      {message}
    </p>
  )}
  {onRetry && (
    <button 
      onClick={onRetry}
      className="bg-[#111111] text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300"
    >
      Thử lại
    </button>
  )}
</div>
```

---

### 9. StickySummary
**Purpose**: Sticky summary for cart/checkout

**Props**:
- `children` (ReactNode, required)
- `offset` (string, optional) - default: "top-24"

**Tailwind Classes**:
```jsx
<div className={`lg:sticky ${offset || 'lg:top-24'}`}>
  <div className="bg-white border border-[#e5e5e5] p-6">
    {children}
  </div>
</div>
```

---

### 10. Toast / Modal / Drawer
**Purpose**: Overlay components

**Toast Classes** (using react-toastify):
```jsx
// Already implemented via react-toastify
// Customize in toast config
```

**Modal Classes**:
```jsx
{isOpen && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] animate-fadeIn"
      onClick={onClose}
    />
    
    {/* Modal */}
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white border border-[#e5e5e5] max-w-md w-full p-6 sm:p-8 animate-fadeIn">
        {/* Modal Content */}
      </div>
    </div>
  </>
)}
```

**Drawer Classes** (already in Navbar):
```jsx
// See Navbar component for drawer implementation
```

---

## 🎨 Component Usage Examples

### Complete Section Example
```jsx
<section className="py-16 sm:py-20 lg:py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Header */}
    <SectionHeader 
      title="Sản phẩm bán chạy"
      subtitle="Những sản phẩm được yêu thích nhất"
      viewAllLink="/collection"
    />
    
    {/* Content Grid */}
    <ContentGrid
      items={products}
      columns={{mobile: 2, tablet: 3, desktop: 5}}
      renderItem={(product) => <ProductItem {...product} />}
    />
  </div>
</section>
```

---

*Last Updated: 2024*


