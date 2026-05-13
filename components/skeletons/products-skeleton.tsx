/**
 * Products Skeleton Component
 * 
 * @description Loading skeleton for products section with grid layout.
 * Displays placeholder for product catalog while data loads.
 * 
 * @features
 * - Section title skeleton
 * - Category filter skeletons
 * - Product grid layout (responsive)
 * - Multiple product card skeletons
 * - Maintains grid spacing
 * - Pulse animation
 * 
 * @usage
 * Used in Suspense fallback for products section or catalog pages
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Skeleton className="h-12 w-96 mx-auto mb-8" />

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <Skeleton className="h-64 w-full" />
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
