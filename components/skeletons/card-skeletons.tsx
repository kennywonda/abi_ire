/**
 * Card Skeleton Components
 *
 * @description Collection of skeleton loaders for card-based UI elements.
 * Provides loading states for product cards and statistics cards.
 *
 * @components
 * - ProductCardSkeleton: Loading state for product card
 * - StatsCardSkeleton: Loading state for statistics card
 *
 * @features
 * - Pulse animation effect
 * - Matches actual card dimensions
 * - Maintains layout during loading
 * - Responsive design
 *
 * @usage
 * <ProductCardSkeleton />
 * <StatsCardSkeleton />
 */
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="text-center">
      <Skeleton className="h-12 w-32 mx-auto mb-4" />
      <Skeleton className="h-16 w-full max-w-xs mx-auto" />
    </div>
  );
}

export function FeatureCardSkeleton() {
  return (
    <div className="border rounded-lg p-6">
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4 mt-2" />
    </div>
  );
}
