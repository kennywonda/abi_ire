/**
 * 404 Not Found Page
 * 
 * Error page displayed when user navigates to non-existent route.
 * Client component with navigation options.
 * 
 * Features:
 * - Large 404 number display
 * - Clear error message
 * - "Go Home" button
 * - "Go Back" button
 * - Centered layout
 * - Responsive design
 * - User-friendly error messaging
 * 
 * @page
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Decorative Element */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">+</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Abi Ire</span>
        </div>
      </div>
    </div>
  );
}
