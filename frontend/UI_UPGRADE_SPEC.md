# UI Upgrade Specification - Premium Modern Minimal

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: #111111;        /* Main text, buttons, borders */
--background: #FFFFFF;     /* Page background */
--border: #e5e5e5;        /* Subtle borders, dividers */
--text-secondary: #222222; /* Secondary text */

/* Accent (Use Sparingly) */
--accent: #F5C842;        /* Prices, sale badges, highlights ONLY */

/* Semantic Colors */
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

### Typography Scale
```css
/* Headings */
H1: 2.5rem (40px) / font-light / uppercase / tracking-wider / leading-tight
H2: 2rem (32px) / font-light / uppercase / tracking-wider / leading-tight
H3: 1.5rem (24px) / font-light / uppercase / tracking-wider / leading-snug

/* Body */
Body Large: 1rem (16px) / font-light / leading-relaxed
Body: 0.875rem (14px) / font-light / leading-relaxed
Body Small: 0.75rem (12px) / font-light / leading-normal

/* Caption */
Caption: 0.625rem (10px) / font-light / uppercase / tracking-wider
```

### Spacing System (8px base)
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
```

### Shadow System
```css
/* Subtle shadows for depth */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Border Radius
```css
--radius-sm: 0.125rem;  /* 2px */
--radius: 0.25rem;      /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;   /* 8px */
--radius-full: 9999px;
```

---

## 📦 Component Styles

### Button Styles

#### Primary Button
```css
/* Default */
bg-[#111111] text-white 
px-6 py-3 
text-xs sm:text-sm 
font-light uppercase tracking-wider
transition-all duration-300

/* Hover */
hover:bg-[#222222] 
hover:shadow-lg
hover:-translate-y-0.5

/* Active */
active:scale-[0.98]

/* Disabled */
disabled:opacity-40 
disabled:cursor-not-allowed 
disabled:hover:translate-y-0
```

#### Secondary Button
```css
/* Default */
bg-transparent text-[#111111]
border border-[#111111]
px-6 py-3
text-xs sm:text-sm
font-light uppercase tracking-wider
transition-all duration-300

/* Hover */
hover:bg-[#111111] hover:text-white
```

#### Ghost Button
```css
/* Default */
bg-transparent text-[#222222]
px-4 py-2
text-xs font-light uppercase tracking-wide
transition-colors duration-200

/* Hover */
hover:text-[#111111]
```

### Input Styles

#### Text Input (Underline Style)
```css
/* Default */
w-full
px-0 py-3
border-0 border-b border-[#e5e5e5]
bg-transparent
text-sm font-light uppercase tracking-wide
text-[#111111]
placeholder:text-[#222222] placeholder:opacity-40
focus:outline-none focus:border-[#111111]
transition-colors duration-300

/* Error State */
border-b-[#ef4444]
```

#### Input with Label
```css
/* Label */
block text-xs font-light uppercase tracking-wider text-[#111111] mb-2

/* Input */
w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent
text-sm font-light uppercase tracking-wide
focus:outline-none focus:border-[#111111]
transition-colors duration-300

/* Error Message */
text-xs text-[#ef4444] mt-1
```

### Card Styles

#### Product Card
```css
/* Container */
group relative
bg-white
border border-[#e5e5e5]
overflow-hidden
transition-all duration-500 ease-out

/* Hover */
hover:border-[#111111]
hover:shadow-lg
hover:-translate-y-1

/* Image Container */
relative overflow-hidden bg-[#f9f9f9] aspect-square

/* Image */
w-full h-full object-cover
group-hover:scale-105
transition-transform duration-700 ease-out

/* Overlay (on hover) */
absolute inset-0 bg-gradient-to-t from-black/5 to-transparent
opacity-0 group-hover:opacity-100
transition-opacity duration-500

/* Badge */
absolute top-4 left-4
bg-[#F5C842] text-[#111111]
px-2.5 py-1
text-[10px] font-light uppercase tracking-wider
shadow-sm

/* Content */
p-4 sm:p-5
bg-white

/* Title */
text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111]
line-clamp-2 leading-snug mb-2.5

/* Price */
text-sm sm:text-base font-light text-[#F5C842]
```

### Badge Styles

#### New Badge
```css
absolute top-4 left-4
bg-[#F5C842] text-[#111111]
px-2.5 py-1
text-[10px] font-light uppercase tracking-wider
shadow-sm
z-10
```

#### Sale Badge
```css
absolute top-4 right-4
bg-[#111111] text-white
px-2.5 py-1
text-[10px] font-light uppercase tracking-wider
shadow-sm
z-10
```

---

## 🎭 Animation & Transitions

### Transition Durations
```css
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

### Easing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Key Animations
- **Hover Lift**: `translateY(-4px)` with shadow increase
- **Image Zoom**: `scale(1.05)` on product cards
- **Fade In**: `opacity 0 → 1` for overlays
- **Slide In**: `translateX(100%) → 0` for drawers
- **Scale**: `scale(0.98)` for button press

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large */
```

---

## ✨ Micro-interactions

### Hover States
- **Cards**: Lift + shadow + border color change
- **Buttons**: Background change + slight lift
- **Links**: Underline animation from left to right
- **Images**: Subtle zoom (1.02-1.05x)

### Focus States
- **Inputs**: Border color change to black
- **Buttons**: Ring outline (accessibility)
- **Links**: Underline appears

### Loading States
- **Skeleton**: Pulse animation with matching layout
- **Spinner**: Smooth rotation
- **Button**: Disabled state with opacity

### Empty States
- Icon + message + CTA button
- Centered layout
- Subtle background

---

## 🎯 Component Checklist

### ✅ Priority 1 (Core Components)
- [ ] Navbar (sticky, blur, drawer)
- [ ] ProductItem (premium card)
- [ ] Product Detail (gallery, size selector)
- [ ] Cart (quantity controls, mini drawer)
- [ ] Checkout Form (validation, error states)

### ✅ Priority 2 (Supporting Components)
- [ ] Hero Section
- [ ] Collection/Filter
- [ ] Search UI
- [ ] Footer
- [ ] Loading States
- [ ] Empty States
- [ ] Error States

### ✅ Priority 3 (Enhancements)
- [ ] Toast Notifications
- [ ] Modal/Drawer System
- [ ] Image Lightbox
- [ ] Form Validation UI
- [ ] Skeleton Loaders

---

## 📐 Layout Guidelines

### Container Widths
```css
/* Page Container */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

/* Content Container */
max-w-4xl mx-auto

/* Form Container */
max-w-2xl mx-auto
```

### Section Spacing
```css
/* Between Sections */
py-12 sm:py-16 lg:py-24

/* Within Sections */
space-y-6 sm:space-y-8
```

### Grid Systems
```css
/* Product Grid */
grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
gap-4 sm:gap-6

/* Form Grid */
grid grid-cols-1 sm:grid-cols-2 gap-4
```

---

## 🚀 Performance Considerations

1. **Lazy Loading**: Images below fold
2. **Skeleton Screens**: Match final layout
3. **Debounced Inputs**: Search, filters
4. **Optimized Animations**: Use transform/opacity
5. **Code Splitting**: Route-based chunks

---

*Last Updated: 2024*


