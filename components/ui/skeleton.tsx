/**
 * Skeleton Component
 * 
 * @description Loading skeleton component for content placeholders.
 * Displays animated pulse effect while content is loading.
 * 
 * @features
 * - Pulse animation for loading effect
 * - Customizable dimensions via className
 * - Rounded corners styling
 * - Light background color
 * 
 * @props
 * - className: Additional CSS classes for sizing and spacing
 * - ...props: All standard HTML div attributes
 * 
 * @usage
 * <Skeleton className="h-12 w-full" />
 * <Skeleton className="h-4 w-[250px]" />
 */
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
