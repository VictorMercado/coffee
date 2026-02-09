# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Orbit Coffee is a retro-futuristic coffee shop website built with Next.js 16, featuring a space-themed design with atomic orange accents and deep espresso brown backgrounds. The site showcases a coffee menu with filtering, a shopping cart, and themed sections.

## Commands

```bash
# Development
pnpm dev              # Start dev server on localhost:3000

# Build
pnpm build           # Create production build
pnpm start           # Start production server

# Code Quality
pnpm lint            # Run ESLint
```

## Architecture

### State Management - Zustand

The app uses Zustand for global state management. The cart store (`lib/cart-store.ts`) is the primary store:

- **Cart Store**: Manages shopping cart state with items, quantities, sizes, and totals
- Items are uniquely identified by `id` + `size` combination
- Store provides methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `total()`, `itemCount()`

### Data Structure

**Menu System** (`lib/menu-data.ts`):
- Menu items have categories: "signature", "classic", "cold", "pastry"
- Pricing uses `basePrice` + `priceModifier` based on size (SM/MD/LG)
- Categories and sizes are exported as const arrays for consistency

### Component Architecture

**Page Structure** (`app/page.tsx`):
- Client component with local state for cart drawer and active category
- Filters menu items based on selected category
- Single-page application with sections: Hero, Menu, About, CTA

**Key Components**:
- `Header`: Navigation with cart button that triggers drawer
- `CartDrawer`: Sliding drawer with cart contents (uses Zustand store)
- `CategoryTabs`: Category filter UI
- `MenuItemCard`: Individual menu item display with size selection
- `HeroSection`, `Footer`: Static content sections

### Styling System

**Tailwind CSS v4** with custom theme:
- Uses CSS variables with `oklch` color space for better color consistency
- Retro-futuristic palette: Deep espresso browns, atomic orange primary, teal accents
- Monospace font (Orbitron) for headers, Space Grotesk for body text
- Zero border radius (`--radius: 0rem`) for brutalist aesthetic
- Custom CSS variables defined in `app/globals.css`

**shadcn/ui Components**:
- Using "new-york" style variant
- All UI components in `components/ui/`
- Path aliases configured: `@/components`, `@/lib`, `@/hooks`
- Imports use `lucide-react` for icons

### Image References

Menu items reference images in `/public/images/` directory. Images follow naming pattern: `{item-id}.jpg` (e.g., `/images/nebula-latte.jpg`).

### TypeScript Configuration

- Path alias `@/*` maps to root directory
- Target: ES6
- TypeScript errors ignored in build (`ignoreBuildErrors: true`)
- Images unoptimized in Next.js config

## Key Patterns

1. **Size-Based Pricing**: Calculate final price as `item.basePrice + size.priceModifier`
2. **Cart Item Identity**: Items differentiated by `(id, size)` tuple, not just id
3. **Category Filtering**: Menu items filtered client-side by category state
4. **Client Components**: Main page is client component due to interactive state
5. **Monospace Typography**: Use `font-mono` class for headers/labels to maintain retro-futuristic aesthetic
