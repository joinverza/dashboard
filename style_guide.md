# Verza Design System & Style Guide

## 1. Color Palette

### Primary Colors
- **Verza Emerald**: `#00B050`
  - Used for primary actions, success states, and brand identity.
- **Verza Neon**: `#00FF87`
  - Used for gradients, highlights, and active states.
  - Gradient pair: `#00FF87` → `#00B050`

### Dark Mode System
- **Deep Background**: `#0D0D0D`
  - Primary background color for landing pages and dashboard.
  - Darker than standard `#121212` for better OLED performance and contrast.
- **Surface**: `#1A1A1A`
  - Used for cards, sidebars, and elevated surfaces.
- **Border**: `rgba(255, 255, 255, 0.1)`
  - Subtle borders for separation without visual clutter.

### Typography
- **Primary Text**: `#FFFFFF` (Pure White)
  - Headings and primary content.
- **Secondary Text**: `#9CA3AF` (Gray-400)
  - Descriptions and secondary information.
- **Muted Text**: `#6B7280` (Gray-500)
  - Footers and placeholders.

## 2. Typography System

### Font Families
- **Headings**: Montserrat / Inter
  - Weights: Bold (700), SemiBold (600)
- **Body**: Inter / Sans-serif
  - Weights: Regular (400), Medium (500)

### Scale
- **Display**: 4.5rem (72px) / Line Height 1.1
- **H1**: 3rem (48px)
- **H2**: 2.25rem (36px)
- **H3**: 1.5rem (24px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

## 3. Visual Effects

### Green Burst Gradient
- **Composition**: Radial/Conic gradients combining `#00FF87` and `#00B050`.
- **Blur**: `blur-[100px]` to `blur-[120px]`
- **Animation**:
  - `scale`: 1 → 1.1 → 1 (Breathing effect)
  - `opacity`: 0.3 → 0.5 (Subtle pulse)
  - Duration: 8s (Slow, calm motion)

### Glass Morphism
- **Background**: `bg-white/5` or `bg-black/20`
- **Blur**: `backdrop-blur-xl`
- **Border**: `border-white/10` or `border-white/20`
- **Shadow**: `shadow-lg`

## 4. Layout & Spacing

### Grid System
- **Base Unit**: 4px
- **Standard Spacing**: 24px (`p-6`, `gap-6`)
- **Container Max Width**: 1280px (`max-w-7xl`)

### Responsive Breakpoints
- **Mobile**: < 768px (Single column, stacked)
- **Tablet**: 768px - 1024px (Grid 2 columns)
- **Desktop**: > 1024px (Grid 3 columns, full layouts)

## 5. Accessibility Standards
- **Contrast**: Minimum AA compliance for all text (4.5:1 ratio).
- **Focus States**: Visible focus rings on interactive elements.
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<section>`, `<footer>`.
