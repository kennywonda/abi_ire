/**
 * Header Component
 *
 * Top navigation header displaying brand logo and main navigation links.
 * Includes brand identity (logo + name) and primary navigation menu.
 *
 * Features:
 * - Brand logo and name
 * - Primary navigation (Products, About Us, Our Store)
 * - User action icons (Search, Shopping Bag, User)
 * - Responsive layout (mobile-friendly)
 * - Sticky header positioning
 *
 * @component
 */

import { ShoppingBag, Search, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xl">+</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Abi Ire</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">
            Products
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            About Us
          </Link>
          <Link
            href="/store"
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Our Store
          </Link>
          <Link
            href="/delivery"
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Delivery
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
