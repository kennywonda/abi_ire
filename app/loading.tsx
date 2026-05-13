/**
 * Loading UI
 * 
 * Global loading state displayed during page transitions.
 * Shows skeleton UI while content loads.
 * 
 * Features:
 * - PageSkeleton component for loading state
 * - Automatic display during async data fetching
 * - Improves perceived performance
 * - Prevents layout shift
 * 
 * @page
 */

import PageSkeleton from "@/components/skeletons/page-skeleton";

export default function Loading() {
  return <PageSkeleton />;
}
