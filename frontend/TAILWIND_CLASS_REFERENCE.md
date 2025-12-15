# Tailwind Class Reference - Premium UI Components

## 🎨 Button Classes

### Primary Button
```jsx
className="bg-[#111111] text-white 
  px-6 py-3 
  text-xs sm:text-sm 
  font-light uppercase tracking-wider
  transition-all duration-300
  hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5
  active:scale-[0.98]
  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
```

### Secondary Button
```jsx
className="bg-transparent text-[#111111]
  border border-[#111111]
  px-6 py-3
  text-xs sm:text-sm
  font-light uppercase tracking-wider
  transition-all duration-300
  hover:bg-[#111111] hover:text-white"
```

### Ghost Button
```jsx
className="bg-transparent text-[#222222]
  px-4 py-2
  text-xs font-light uppercase tracking-wide
  transition-colors duration-200
  hover:text-[#111111]"
```

---

## 📝 Input Classes

### Underline Input (Default)
```jsx
className="w-full px-0 py-3 
  border-0 border-b bg-transparent
  text-sm font-light uppercase tracking-wide text-[#111111]
  placeholder:text-[#222222] placeholder:opacity-40
  focus:outline-none focus:border-[#111111]
  transition-colors duration-300"
```

### Input with Error
```jsx
className="w-full px-0 py-3 
  border-0 border-b bg-transparent
  text-sm font-light uppercase tracking-wide text-[#111111]
  border-[#ef4444]
  focus:outline-none focus:border-[#ef4444]
  transition-colors duration-300"
```

### Input Label
```jsx
className="block text-xs font-light uppercase tracking-wider text-[#111111] mb-2"
```

### Error Message
```jsx
className="text-xs text-[#ef4444] mt-1 animate-fadeIn"
```

---

## 🎴 Card Classes

### Product Card Container
```jsx
className="group relative
  bg-white
  border border-[#e5e5e5]
  overflow-hidden
  transition-all duration-500 ease-out
  hover:border-[#111111] hover:shadow-lg hover:-translate-y-1"
```

### Product Image Container
```jsx
className="relative overflow-hidden bg-[#f9f9f9] aspect-square"
```

### Product Image
```jsx
className="w-full h-full object-cover
  group-hover:scale-105
  transition-transform duration-700 ease-out"
```

### Image Overlay (Hover)
```jsx
className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent
  opacity-0 group-hover:opacity-100
  transition-opacity duration-500 pointer-events-none"
```

### Product Badge
```jsx
className="absolute top-4 left-4
  bg-[#F5C842] text-[#111111]
  px-2.5 py-1
  text-[10px] font-light uppercase tracking-wider
  shadow-sm z-10
  animate-fadeIn"
```

### Product Content
```jsx
className="p-4 sm:p-5 bg-white"
```

### Product Title
```jsx
className="text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111]
  line-clamp-2 leading-snug mb-2.5
  group-hover:text-[#111111] transition-colors duration-300"
```

### Product Price
```jsx
className="text-sm sm:text-base font-light text-[#F5C842]"
```

---

## 🏷️ Badge Classes

### New Badge
```jsx
className="absolute top-4 left-4
  bg-[#F5C842] text-[#111111]
  px-2.5 py-1
  text-[10px] font-light uppercase tracking-wider
  shadow-sm z-10"
```

### Sale Badge
```jsx
className="absolute top-4 right-4
  bg-[#111111] text-white
  px-2.5 py-1
  text-[10px] font-light uppercase tracking-wider
  shadow-sm z-10"
```

---

## 🎭 Navigation Classes

### Nav Link (Desktop)
```jsx
className="relative text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111]
  hover:text-[#111111] transition-colors duration-300
  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111]
  after:transition-all after:duration-300 hover:after:w-full"
```

### Nav Link (Mobile)
```jsx
className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111]
  hover:bg-[#f9f9f9] transition-colors duration-200
  border-l-4 border-transparent hover:border-[#111111]"
```

### Sticky Navbar
```jsx
className={`sticky top-0 z-50 transition-all duration-300 ${
  scrolled 
    ? 'bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] shadow-sm' 
    : 'bg-white border-b border-[#e5e5e5]'
}`}
```

---

## 🎪 Drawer Classes

### Drawer Container
```jsx
className="fixed top-0 right-0 h-full bg-white border-l border-[#e5e5e5] z-[9999] w-80
  animate-slideInRight"
```

### Drawer Backdrop
```jsx
className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]
  animate-fadeIn"
```

---

## 🔍 Search Classes

### Search Input
```jsx
className="w-full px-0 py-2 border-0 border-b border-[#e5e5e5] bg-transparent
  text-sm font-light uppercase tracking-wide text-[#111111]
  placeholder:text-[#222222] placeholder:opacity-40
  focus:outline-none focus:border-[#111111] transition-colors duration-300"
```

### Search Container
```jsx
className="border-t border-[#e5e5e5] bg-white animate-slideInUp"
```

---

## 💳 Payment Method Classes

### Payment Option
```jsx
className={`flex items-center gap-4 border p-4 cursor-pointer transition-all duration-300
  ${selected 
    ? 'border-[#111111] bg-[#f9f9f9]' 
    : 'border-[#e5e5e5] hover:border-[#111111]'
  }`}
```

### Radio Button
```jsx
className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0
  transition-all duration-300
  ${selected ? 'border-[#111111]' : 'border-[#e5e5e5]'}
`}
```

### Radio Dot
```jsx
className="w-2.5 h-2.5 bg-[#111111] rounded-full animate-fadeIn"
```

---

## 📦 Skeleton Classes

### Skeleton Container
```jsx
className="absolute inset-0 bg-gradient-to-br from-[#e5e5e5] via-[#f5f5f5] to-[#e5e5e5] animate-pulse"
```

### Skeleton Shimmer
```jsx
className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
  animate-shimmer"
```

---

## 🎯 Loading States

### Spinner
```jsx
className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
```

### Button with Loading
```jsx
className="... flex items-center justify-center gap-2"
// Inside:
{isLoading ? (
  <>
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    <span>Đang xử lý...</span>
  </>
) : (
  'Submit'
)}
```

---

## 📐 Layout Classes

### Page Container
```jsx
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

### Section Spacing
```jsx
className="py-12 sm:py-16 lg:py-24"
```

### Content Spacing
```jsx
className="space-y-6 sm:space-y-8"
```

### Grid (Products)
```jsx
className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
```

---

## ✨ Animation Classes

### Fade In
```jsx
className="animate-fadeIn"
```

### Slide In Right
```jsx
className="animate-slideInRight"
```

### Slide In Up
```jsx
className="animate-slideInUp"
```

### Pulse
```jsx
className="animate-pulse"
```

### Shimmer
```jsx
className="animate-shimmer"
```

---

## 🎨 Utility Classes

### Text Truncate (2 lines)
```jsx
className="line-clamp-2"
```

### Aspect Ratio (Square)
```jsx
className="aspect-square"
```

### Backdrop Blur
```jsx
className="backdrop-blur-md"
```

### Glass Effect
```jsx
className="bg-white/95 backdrop-blur-md"
```

---

*Last Updated: 2024*


