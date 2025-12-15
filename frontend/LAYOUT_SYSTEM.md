# Layout System - Premium E-commerce Design

## 🎯 Design Tokens

### Container System
```css
/* Container Widths */
Container: max-w-7xl (1280px)
Container Padding:
  - Mobile: px-4 (16px)
  - Tablet: sm:px-6 (24px)
  - Desktop: lg:px-8 (32px)

/* Tailwind Classes */
.container-base {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Grid System
```css
/* Desktop (lg+) */
- 12 columns: grid-cols-12
- Product grid: grid-cols-5 (5 items per row)
- Collection grid: grid-cols-4 (4 items per row)
- Related products: grid-cols-4

/* Tablet (md) */
- 4 columns: grid-cols-4
- Product grid: grid-cols-3

/* Mobile (sm) */
- 2 columns: grid-cols-2
- Product grid: grid-cols-2

/* Tailwind Classes */
.grid-product-desktop {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5;
}

.grid-product-collection {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4;
}

.grid-content {
  @apply grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8;
}
```

### Spacing Scale (8px System)
```css
/* Section Spacing */
Section Vertical:
  - Small: py-12 (48px)
  - Medium: py-16 (64px)
  - Large: py-24 (96px)
  - XL: py-32 (128px)

Section Horizontal:
  - Standard: px-4 sm:px-6 lg:px-8

/* Component Spacing */
Gap between items:
  - Tight: gap-4 (16px)
  - Standard: gap-6 (24px)
  - Loose: gap-8 (32px)
  - XL: gap-12 (48px)

Margin between sections:
  - Small: mb-8 (32px)
  - Medium: mb-12 (48px)
  - Large: mb-16 (64px)
  - XL: mb-24 (96px)

/* Tailwind Classes */
.section-spacing-sm {
  @apply py-12 sm:py-16;
}

.section-spacing-md {
  @apply py-16 sm:py-20 lg:py-24;
}

.section-spacing-lg {
  @apply py-24 sm:py-32 lg:py-40;
}

.content-gap {
  @apply gap-6 lg:gap-8;
}
```

### Typography Scale
```css
/* Headings */
H1 (Page Title):
  - Mobile: text-2xl (24px)
  - Tablet: sm:text-3xl (30px)
  - Desktop: lg:text-4xl (36px)
  - Class: font-light uppercase tracking-wider

H2 (Section Title):
  - Mobile: text-xl (20px)
  - Tablet: sm:text-2xl (24px)
  - Desktop: lg:text-3xl (30px)
  - Class: font-light uppercase tracking-wider

H3 (Subsection):
  - Mobile: text-lg (18px)
  - Tablet: sm:text-xl (20px)
  - Class: font-light uppercase tracking-wide

/* Body Text */
Body Large:
  - text-base (16px)
  - leading-relaxed

Body Standard:
  - text-sm (14px)
  - leading-relaxed

Body Small:
  - text-xs (12px)
  - leading-snug

Caption:
  - text-[10px] (10px)
  - uppercase tracking-wider

/* Tailwind Classes */
.heading-page {
  @apply text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-wider text-[#111111];
}

.heading-section {
  @apply text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-wider text-[#111111];
}

.heading-subsection {
  @apply text-lg sm:text-xl font-light uppercase tracking-wide text-[#111111];
}

.body-large {
  @apply text-base font-light leading-relaxed text-[#222222];
}

.body-standard {
  @apply text-sm font-light leading-relaxed text-[#222222];
}

.body-small {
  @apply text-xs font-light leading-snug text-[#222222];
}
```

### Color System
```css
Primary: #111111 (Black)
Background: #FFFFFF (White)
Border: #e5e5e5 (Light Gray)
Text Secondary: #222222 (Dark Gray)
Accent: #F5C842 (Gold - only for price/sale/badge)

/* Tailwind Classes */
.text-primary {
  @apply text-[#111111];
}

.text-secondary {
  @apply text-[#222222];
}

.text-accent {
  @apply text-[#F5C842];
}

.bg-primary {
  @apply bg-[#111111];
}

.bg-secondary {
  @apply bg-[#FFFFFF];
}

.border-base {
  @apply border-[#e5e5e5];
}
```

### Animation System
```css
/* Durations */
Fast: 200ms (duration-200)
Medium: 300ms (duration-300)
Slow: 400ms (duration-400)

/* Easing */
Default: ease-out
Smooth: ease-in-out

/* Tailwind Classes */
.transition-base {
  @apply transition-all duration-300 ease-out;
}

.transition-fast {
  @apply transition-all duration-200 ease-out;
}

.transition-smooth {
  @apply transition-all duration-400 ease-in-out;
}
```

---

## 📐 Page Structure Template

### Standard Page Layout
```
┌─────────────────────────────────────┐
│         Page Header                  │
│  (Title + Subtitle + Breadcrumb)     │
│  py-12 sm:py-16 lg:py-20            │
├─────────────────────────────────────┤
│         Toolbar (Optional)          │
│  (Search/Sort/Filter/Actions)        │
│  border-b border-[#e5e5e5] pb-4     │
├─────────────────────────────────────┤
│                                     │
│         Main Content                 │
│  (Grid/List/Cards)                  │
│  py-8 sm:py-12                      │
│                                     │
├─────────────────────────────────────┤
│      Secondary Content (Optional)    │
│  (Recommendations/FAQ/Trust)        │
│  py-12 sm:py-16                     │
├─────────────────────────────────────┤
│         Footer CTA (Optional)       │
│  (Newsletter/Benefits)              │
│  py-16 sm:py-24                     │
└─────────────────────────────────────┘
```

### Two-Column Layout (Desktop)
```
┌─────────────────────────────────────┐
│         Page Header                 │
├──────────────┬──────────────────────┤
│              │                      │
│   Sidebar    │    Main Content      │
│   (Filter/   │    (Grid/List)       │
│   Summary)   │                      │
│              │                      │
│   w-64       │    flex-1            │
│   sticky     │                      │
│   top-24     │                      │
└──────────────┴──────────────────────┘
```

---

## 🎨 Section Separation

### Visual Hierarchy
```css
/* Section Divider */
.section-divider {
  @apply border-t border-[#e5e5e5] pt-12 sm:pt-16 lg:pt-20;
}

/* Section with Background */
.section-alt {
  @apply bg-[#f9f9f9] py-12 sm:py-16 lg:py-24;
}

/* Card Container */
.card-container {
  @apply bg-white border border-[#e5e5e5] p-6 sm:p-8;
}

/* Subtle Shadow */
.shadow-subtle {
  @apply shadow-sm;
}
```

---

## 📱 Responsive Breakpoints

```css
Mobile: < 640px (sm)
Tablet: 640px - 1024px (sm to lg)
Desktop: > 1024px (lg+)

/* Usage */
Mobile-first approach:
- Base: Mobile styles
- sm: Tablet styles
- lg: Desktop styles
```

---

## 🎯 Layout Utilities

### Flexbox Utilities
```css
.flex-center {
  @apply flex items-center justify-center;
}

.flex-between {
  @apply flex items-center justify-between;
}

.flex-start {
  @apply flex items-start;
}
```

### Grid Utilities
```css
.grid-auto-fit {
  @apply grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))];
}

.grid-auto-fill {
  @apply grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))];
}
```

### Spacing Utilities
```css
.space-section {
  @apply space-y-12 sm:space-y-16 lg:space-y-24;
}

.space-content {
  @apply space-y-6 lg:space-y-8;
}
```

---

*Last Updated: 2024*


