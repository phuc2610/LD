# Micro-Interactions Guide

## 🎯 Overview

This document outlines all micro-interactions implemented to enhance the premium feel of the UI.

---

## 1. 🎴 Product Card Interactions

### Hover State
```jsx
// Card lifts with shadow
hover:-translate-y-1 hover:shadow-lg

// Image zooms smoothly
group-hover:scale-105 transition-transform duration-700

// Gradient overlay fades in
opacity-0 group-hover:opacity-100 transition-opacity duration-500
```

**Timing**: 500-700ms for smooth, premium feel

### Click State
```jsx
// Subtle press effect
active:scale-[0.98]
```

---

## 2. 📱 Navbar Interactions

### Scroll Effect
```jsx
// Blur appears on scroll
scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
```

**Trigger**: `window.scrollY > 10`

### Nav Link Hover
```jsx
// Underline animates from left to right
after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px]
after:transition-all after:duration-300 hover:after:w-full
```

**Timing**: 300ms for snappy response

### Search Toggle
```jsx
// Search bar slides down
animate-slideInUp
```

---

## 3. 📝 Form Interactions

### Input Focus
```jsx
// Border color changes
border-[#e5e5e5] focus:border-[#111111]
transition-colors duration-300
```

### Input Error
```jsx
// Red border + error message fades in
border-[#ef4444]
animate-fadeIn
```

### Button Loading
```jsx
// Spinner appears
{isLoading ? (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
) : (
  'Submit'
)}
```

---

## 4. 🎪 Drawer Interactions

### Open Animation
```jsx
// Slides in from right
animate-slideInRight
// Backdrop fades in
animate-fadeIn
```

### Close Animation
```jsx
// Reverse of open
// Handled by React state
```

---

## 5. 🏷️ Badge Interactions

### Fade In
```jsx
// Badge appears smoothly
animate-fadeIn
```

### Pulse (Optional)
```jsx
// For sale badges
animate-pulse
```

---

## 6. 🔍 Search Interactions

### Input Focus
```jsx
// Border animates
focus:border-[#111111] transition-colors duration-300
```

### Results (Future)
```jsx
// Results fade in
animate-fadeIn
```

---

## 7. 💳 Payment Method Selection

### Radio Button
```jsx
// Dot animates in
animate-fadeIn
// Border changes
transition-all duration-300
```

### Card Selection
```jsx
// Background changes
hover:bg-[#f9f9f9] transition-all duration-300
```

---

## 8. 🎨 Loading States

### Skeleton Shimmer
```jsx
// Shimmer effect
animate-shimmer
// Pulse background
animate-pulse
```

### Spinner
```jsx
// Smooth rotation
animate-spin
```

---

## 9. 🎯 Button Interactions

### Primary Button
```jsx
// Hover lift
hover:-translate-y-0.5 hover:shadow-lg
// Active press
active:scale-[0.98]
// Disabled state
disabled:opacity-40 disabled:cursor-not-allowed
```

### Secondary Button
```jsx
// Color inversion
hover:bg-[#111111] hover:text-white
```

---

## 10. 📦 Cart Interactions

### Quantity Change (Future)
```jsx
// Number animates
animate-pulse
```

### Remove Item (Future)
```jsx
// Fade out
animate-fadeOut
```

---

## ⚙️ Animation Timing Guidelines

### Fast (150-200ms)
- Button hover
- Link hover
- Input focus

### Medium (300ms)
- Card hover
- Nav link underline
- Form validation

### Slow (500-700ms)
- Image zoom
- Overlay fade
- Drawer slide

---

## 🎨 Easing Functions

### Default
```css
ease-out /* For most interactions */
```

### Smooth
```css
ease-in-out /* For complex animations */
```

### Snappy
```css
ease-out /* For quick feedback */
```

---

## 📱 Mobile-Specific Interactions

### Touch Feedback
```jsx
// Active state for touch
active:scale-[0.98]
```

### Swipe Gestures (Future)
- Product gallery swipe
- Cart drawer swipe to close

---

## 🚀 Performance Tips

1. **Use Transform/Opacity**: GPU-accelerated
2. **Avoid Layout Changes**: Use transform instead of width/height
3. **Debounce Animations**: Prevent excessive triggers
4. **Will-Change**: For complex animations
   ```jsx
   className="will-change-transform"
   ```

---

## 🎯 Interaction Checklist

### Product Cards
- [x] Hover lift
- [x] Image zoom
- [x] Gradient overlay
- [x] Badge fade in
- [ ] Quick view (future)

### Navigation
- [x] Scroll blur
- [x] Link underline
- [x] Drawer slide
- [x] Search slide
- [ ] Breadcrumb (future)

### Forms
- [x] Input focus
- [x] Error animation
- [x] Loading state
- [x] Success feedback
- [ ] Auto-save (future)

### Buttons
- [x] Hover lift
- [x] Active press
- [x] Loading spinner
- [x] Disabled state
- [ ] Ripple effect (future)

---

## 💡 Future Enhancements

1. **Haptic Feedback**: For mobile interactions
2. **Sound Effects**: Subtle audio feedback (optional)
3. **Gesture Support**: Swipe, pinch, etc.
4. **Parallax**: Subtle scroll effects
5. **Confetti**: Success animations

---

*Last Updated: 2024*


