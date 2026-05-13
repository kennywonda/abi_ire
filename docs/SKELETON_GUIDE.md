# Skeleton Loaders & 404 Page

## 🎨 What's Included

### Skeleton Components
All skeleton loaders are in `components/skeletons/`:
- **`skeleton.tsx`** - Base Skeleton UI component
- **`page-skeleton.tsx`** - Full page loading skeleton
- **`hero-skeleton.tsx`** - Hero section loading state
- **`products-skeleton.tsx`** - Products grid loading state
- **`card-skeletons.tsx`** - Reusable card skeletons

### 404 Page
- **`app/not-found.tsx`** - Custom 404 error page with "Go Home" and "Go Back" buttons

### Loading States
- **`app/loading.tsx`** - Automatic loading state for page transitions

---

## 🚀 How to Use

### Automatic Page Loading
Next.js automatically shows `app/loading.tsx` during page transitions. No code needed!

### Using with Suspense (for specific components)

```tsx
import { Suspense } from "react"
import ProductsSkeleton from "@/components/skeletons/products-skeleton"
import Products from "@/components/products"

export default function Page() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <Products />
    </Suspense>
  )
}
```

### Using Individual Card Skeletons

```tsx
import { ProductCardSkeleton } from "@/components/skeletons/card-skeletons"

export default function ProductsGrid({ loading, products }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
```

### Using Base Skeleton Component

```tsx
import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-12 w-64" />
<Skeleton className="h-8 w-full rounded-full" />
```

---

## 🔗 404 Page

Visit any non-existent route (e.g., `/this-page-does-not-exist`) to see the 404 page.

Features:
- Clean design with brand logo
- "Go Home" button
- "Go Back" button
- Responsive layout

---

## 🎯 When to Use

### Use `loading.tsx` for:
- Entire page loading states
- Route transitions
- Initial page load

### Use `Suspense` + Component Skeletons for:
- Specific sections that load data
- Images that take time to load
- Dynamic content sections

### Use Card Skeletons for:
- Lists of items
- Grid layouts
- Multiple similar components

---

## 💡 Tips

1. **Match the skeleton to your actual content** - Keep skeleton dimensions similar to final content
2. **Use appropriate animation** - The `animate-pulse` class creates a subtle loading effect
3. **Show meaningful placeholders** - Help users understand what's loading
4. **Don't overuse** - Only use skeletons for content that takes >200ms to load

---

## 🎨 Customization

Change skeleton colors in `components/ui/skeleton.tsx`:

```tsx
// Current: gray
className="animate-pulse rounded-md bg-gray-200"

// Lighter
className="animate-pulse rounded-md bg-gray-100"

// Darker
className="animate-pulse rounded-md bg-gray-300"
```

---

Enjoy your smooth loading states! ✨
