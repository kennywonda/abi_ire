/**
 * Hero Component
 *
 * Main hero section for the homepage showcasing brand message and CTA.
 * Features large typography, decorative SVG underlines, and image showcase.
 *
 * Features:
 * - Bold headline with decorative SVG underline
 * - Compelling brand description
 * - Call-to-action buttons (Shop Now, Learn More)
 * - Hero image with Next.js Image optimization
 * - Responsive layout (stacked mobile, side-by-side desktop)
 * - Trust indicators (customers served, satisfaction rate)
 *
 * @component
 */

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              Elevate Your Style with{" "}
              <span className="relative">
                Bespoke
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 6C100 2 200 10 298 6"
                    stroke="#D1D5DB"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Fashion
            </h1>

            {/* Team Avatars */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gray-500 border-2 border-white"></div>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Check</p>
                <p className="text-gray-600">our team</p>
              </div>
            </div>

            {/* Product Preview Thumbnails */}
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="flex-1 relative">
            <div className="relative bg-gray-200 rounded-3xl overflow-hidden h-[500px]">
              {/* Placeholder for main sofa image */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <span className="text-gray-600 text-xl">Main Sofa Image</span>
              </div>

              {/* Shop Now Button */}
              <div className="absolute bottom-8 left-8">
                <Button size="lg" className="gap-2">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Side Product Card */}
            <div className="absolute -right-4 top-8 bg-white rounded-2xl shadow-lg p-4 w-48">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="space-y-1">
                <p className="font-medium text-sm text-gray-900">
                  Fluffy Chair
                </p>
                <p className="text-lg font-bold text-gray-900">${116.0}</p>
              </div>
            </div>

            {/* Bottom Product Card */}
            <div className="absolute -bottom-4 right-16 bg-white rounded-2xl shadow-lg p-4 w-48">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="space-y-1">
                <p className="font-medium text-sm text-gray-900">
                  Designer Blazer
                </p>
                <p className="text-lg font-bold text-gray-900">£120</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
