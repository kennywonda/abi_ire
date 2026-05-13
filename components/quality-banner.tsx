/**
 * Quality Banner Component
 * 
 * Full-width promotional banner highlighting quality commitment.
 * Features gradient background and call-to-action button.
 * 
 * Features:
 * - Large heading with quality message
 * - Gradient background (gray-700 to gray-800)
 * - "View Collections" CTA button
 * - Decorative background elements
 * - "Book an appointment" badge
 * - Product image placeholder
 * - Responsive text sizing
 * - Centered content layout
 * 
 * @component
 */

import { Button } from "@/components/ui/button";

export default function QualityBanner() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-r from-gray-700 to-gray-800 rounded-3xl overflow-hidden h-[400px]">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gray-600 rounded-l-full"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl">
              When We Design Fashion, We Strive For The Finest Quality.
            </h2>
            <Button size="lg" className="mt-6">
              View Collections
            </Button>
          </div>

          {/* Product Image Placeholder */}
          <div className="absolute bottom-0 right-12 w-64 h-64 opacity-60">
            {/* Fashion illustration would go here */}
          </div>

          {/* Book Appointment Badge */}
          <div className="absolute top-8 right-8 bg-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg">
            <span className="text-sm font-medium">Book an appointment</span>
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
