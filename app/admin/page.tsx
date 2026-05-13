/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard displaying overview statistics.
 * Protected admin-only page.
 * 
 * Features:
 * - Total products count card
 * - Categories count card
 * - Orders count card
 * - Customers count card
 * - Quick links to admin sections
 * - Icon-based stat display
 * - Responsive grid layout
 * - Welcome header
 * 
 * @page
 * @protected Admin only
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, FolderTree, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Products",
      value: "0",
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Categories",
      value: "0",
      icon: FolderTree,
      href: "/admin/categories",
    },
    { label: "Orders", value: "0", icon: ShoppingCart, href: "/admin/orders" },
    { label: "Customers", value: "0", icon: Users, href: "/admin/customers" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products/new">
            <Button className="w-full bg-black hover:bg-gray-800">
              Add New Product
            </Button>
          </Link>
          <Link href="/admin/categories/new">
            <Button className="w-full" variant="outline">
              Add Category
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button className="w-full" variant="outline">
              View Orders
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button className="w-full" variant="outline">
              Manage Customers
            </Button>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Getting Started
        </h3>
        <p className="text-blue-800 mb-4">
          Set up your store by adding products and categories
        </p>
        <ol className="list-decimal list-inside space-y-2 text-blue-900">
          <li>Create product categories</li>
          <li>Add your first products with images</li>
          <li>Configure store settings</li>
          <li>Start receiving orders!</li>
        </ol>
      </div>
    </div>
  );
}
