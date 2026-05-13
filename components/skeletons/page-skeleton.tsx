/**
 * Page Skeleton Component
 *
 * @description Full page loading skeleton including navbar and content areas.
 * Provides complete page structure placeholder during initial load.
 *
 * @features
 * - Navbar skeleton with logo and navigation items
 * - Content area placeholders
 * - Footer skeleton
 * - Responsive design
 * - Full page layout maintenance
 * - Smooth loading experience
 *
 * @usage
 * Used in app loading.tsx for full page loading states
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Navbar Skeleton */}
      <nav className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-gray-700" />
          <div className="hidden md:flex items-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20 bg-gray-700" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-10 w-10 rounded-full bg-gray-700"
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Skeleton className="h-16 w-full max-w-lg" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-20 w-full max-w-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="rounded-3xl h-[500px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-12 w-32 mx-auto mb-4" />
                <Skeleton className="h-16 w-full max-w-xs mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-96 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <Skeleton className="h-64 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
