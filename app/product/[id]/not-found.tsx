/**
 * Product Not Found Page
 *
 * @description Custom 404 page for missing or unavailable products.
 * Provides user-friendly message and navigation options.
 *
 * @route /product/[id]/not-found
 *
 * @features
 * - Clear 404 error message
 * - Helpful explanation text
 * - Navigation back to homepage
 * - Navigation to product catalog
 * - Branded error page design
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the product you're looking for. It may have
          been removed or is no longer available.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </Link>
          <Link href="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
