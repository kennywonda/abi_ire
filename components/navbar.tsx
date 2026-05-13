/**
 * Navbar Component
 * 
 * Main navigation bar with shopping cart integration and user actions.
 * Client component that uses Zustand store for cart state management.
 * 
 * Features:
 * - Shopping cart icon with item count badge
 * - User account and wishlist icons
 * - Search functionality
 * - Language and location selectors
 * - Responsive navigation menu
 * - Real-time cart count updates
 * - Hydration-safe rendering
 * 
 * @component
 */

"use client";

import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Globe,
  MapPin,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { openCart, itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-20 h-10 bg-beige-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Àbí íre</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <button className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">English</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </Button>

            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className="hover:bg-gray-100 relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </Button>

            {/* User Profile */}
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full"
                aria-label="User Account"
              >
                <div className="w-8 h-8 bg-beige-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Category Menu */}
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-beige-600 transition-colors">
                Men
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-beige-600 transition-colors">
                Women
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-beige-600 transition-colors">
                Apparel
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-beige-600 transition-colors">
                Footwear
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Location Selector */}
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-beige-600 transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">Deliver to</span>
              <span className="font-medium">UK, Indonesia</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
