/**
 * Hero Skeleton Component
 *
 * @description Loading skeleton for hero section on homepage.
 * Displays placeholder content while hero section loads.
 *
 * @features
 * - Full hero section layout placeholder
 * - Text content skeletons
 * - Avatar group skeleton
 * - CTA button skeletons
 * - Responsive layout (desktop/mobile)
 * - Matches actual hero dimensions
 *
 * @usage
 * Used in loading.tsx or Suspense fallback for hero section
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <Skeleton className="h-16 w-full max-w-lg" />
            <Skeleton className="h-16 w-3/4" />

            {/* Team Avatars */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>

            {/* Product Preview Thumbnails */}
            <div className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="flex-1 relative">
            <Skeleton className="rounded-3xl h-[500px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
