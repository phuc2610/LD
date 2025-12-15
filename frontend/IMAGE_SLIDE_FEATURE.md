# Tính Năng Tự Động Chuyển Ảnh Sản Phẩm

## 🎯 Tổng Quan

Tính năng tự động chuyển ảnh khi hover vào product card, tạo trải nghiệm premium và giúp người dùng xem nhiều góc ảnh sản phẩm mà không cần click vào.

---

## ✨ Tính Năng

### 1. Tự Động Chuyển Ảnh
- **Kích hoạt**: Khi hover vào product card
- **Thời gian chờ**: 2 giây sau khi hover
- **Tần suất**: Chuyển ảnh mỗi 2 giây
- **Điều kiện**: Chỉ hoạt động khi sản phẩm có **nhiều hơn 1 ảnh**

### 2. Hiệu Ứng Trượt Mượt
- **Animation**: Slide từ phải sang trái
- **Duration**: 700ms (mượt mà, không quá nhanh)
- **Easing**: `ease-in-out` (tự nhiên)
- **Kết hợp**: Fade + Slide + Scale nhẹ

### 3. Reset Tự Động
- Khi rời chuột khỏi card → Reset về ảnh đầu tiên
- Dừng auto-slide ngay lập tức
- Cleanup intervals để tránh memory leak

---

## 🎨 Hiệu Ứng Visual

### Trạng Thái Ảnh

**Ảnh đang hiển thị (Active):**
```css
opacity: 100%
translate-x: 0
scale: 100% (hover: 105%)
z-index: 10
```

**Ảnh tiếp theo (Next):**
```css
opacity: 0%
translate-x: 100% (bên phải, sẵn sàng slide vào)
scale: 105%
z-index: 0
```

**Ảnh khác:**
```css
opacity: 0%
translate-x: -100% (bên trái)
scale: 105%
z-index: 0
```

### Animation Flow
```
Hover vào card
  ↓
Đợi 2 giây
  ↓
Ảnh 1 → Ảnh 2 (slide từ phải)
  ↓
Đợi 2 giây
  ↓
Ảnh 2 → Ảnh 3 (slide từ phải)
  ↓
... (lặp lại)
  ↓
Rời chuột → Reset về ảnh 1
```

---

## 💻 Implementation Details

### State Management
```jsx
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isHovered, setIsHovered] = useState(false);
const intervalRef = useRef(null);
```

### Auto-Slide Logic
```jsx
useEffect(() => {
  if (isHovered && hasMultipleImages) {
    // Delay 2s trước khi bắt đầu
    const delayTimeout = setTimeout(() => {
      // Chuyển ảnh mỗi 2s
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % image.length);
      }, 2000);
    }, 2000);
    
    return () => {
      clearTimeout(delayTimeout);
      clearInterval(intervalRef.current);
    };
  } else {
    // Reset khi không hover
    setCurrentImageIndex(0);
    clearInterval(intervalRef.current);
  }
}, [isHovered, hasMultipleImages, image?.length]);
```

### Image Rendering
```jsx
{image.map((img, index) => {
  const isActive = index === currentImageIndex;
  const isNext = index === (currentImageIndex + 1) % image.length;
  
  return (
    <img 
      className={`absolute inset-0
        transition-all duration-700 ease-in-out
        ${isActive 
          ? 'opacity-100 translate-x-0 scale-100 z-10' 
          : isNext
          ? 'opacity-0 translate-x-full scale-105 z-0'
          : 'opacity-0 -translate-x-full scale-105 z-0'
        }`}
      src={img}
    />
  );
})}
```

---

## 🎯 User Experience

### Scenarios

**Scenario 1: Sản phẩm có 1 ảnh**
- ❌ Không có auto-slide
- ✅ Vẫn có hover zoom effect

**Scenario 2: Sản phẩm có nhiều ảnh**
- ✅ Hover vào → Đợi 2s → Bắt đầu auto-slide
- ✅ Ảnh chuyển mượt mỗi 2s
- ✅ Rời chuột → Reset về ảnh đầu

**Scenario 3: Hover nhanh (< 2s)**
- ✅ Không có auto-slide (chưa đủ thời gian)
- ✅ Vẫn có hover effects khác

---

## ⚙️ Configuration

### Timing (Có thể tùy chỉnh)

**Delay trước khi bắt đầu:**
```jsx
setTimeout(() => { ... }, 2000); // 2 giây
```

**Thời gian giữa mỗi ảnh:**
```jsx
setInterval(() => { ... }, 2000); // 2 giây
```

**Animation duration:**
```jsx
transition-all duration-700 // 700ms
```

### Để thay đổi timing:
1. Tìm các giá trị `2000` (milliseconds)
2. Thay đổi theo nhu cầu
3. Đảm bảo animation duration (`700ms`) phù hợp

---

## 🚀 Performance

### Optimizations
- ✅ **useRef** cho interval (tránh re-render)
- ✅ **Cleanup** intervals khi unmount
- ✅ **Conditional rendering** - chỉ render khi có nhiều ảnh
- ✅ **GPU-accelerated** - dùng transform thay vì position

### Memory Management
- ✅ Clear timeout/interval khi component unmount
- ✅ Reset state khi không hover
- ✅ Không tạo memory leaks

---

## 🎨 Customization Options

### Thay đổi hướng slide

**Slide từ trái sang phải:**
```jsx
// Thay đổi translate-x direction
isNext ? 'translate-x-full' : '-translate-x-full'
```

**Fade only (không slide):**
```jsx
// Bỏ translate-x, chỉ dùng opacity
${isActive ? 'opacity-100' : 'opacity-0'}
```

**Zoom transition:**
```jsx
// Thêm scale effect
${isActive ? 'scale-100' : 'scale-110'}
```

---

## 🐛 Troubleshooting

### Vấn đề: Ảnh không chuyển
**Giải pháp:**
- Kiểm tra `image.length > 1`
- Kiểm tra `isHovered` state
- Kiểm tra console có lỗi không

### Vấn đề: Animation không mượt
**Giải pháp:**
- Tăng `duration-700` lên `duration-1000`
- Kiểm tra performance với DevTools

### Vấn đề: Memory leak
**Giải pháp:**
- Đảm bảo cleanup trong useEffect
- Kiểm tra interval được clear đúng cách

---

## 📱 Mobile Considerations

### Touch Devices
- ✅ Hoạt động với hover trên tablet (iPad)
- ⚠️ Không hoạt động trên mobile (không có hover)
- 💡 Có thể thêm touch swipe gesture sau

### Performance trên Mobile
- ✅ Animation đã tối ưu (transform/opacity)
- ✅ Không ảnh hưởng scroll performance
- ✅ Lazy load images

---

## 🎯 Best Practices

1. **Số lượng ảnh**: Khuyến nghị 2-4 ảnh để UX tốt nhất
2. **Chất lượng ảnh**: Đảm bảo tất cả ảnh cùng kích thước
3. **Alt text**: Mỗi ảnh có alt text riêng
4. **Loading**: Preload ảnh đầu tiên, lazy load các ảnh khác

---

## 🔮 Future Enhancements

### Có thể thêm:
- [ ] Touch swipe trên mobile
- [ ] Dots indicator (hiển thị ảnh hiện tại)
- [ ] Pause on hover (tạm dừng khi hover vào ảnh)
- [ ] Manual navigation (click để chuyển)
- [ ] Keyboard navigation (arrow keys)

---

*Last Updated: 2024*


