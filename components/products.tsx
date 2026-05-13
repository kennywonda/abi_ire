/**
 * Products Component
 * 
 * Product listing with category filtering for showcasing collections.
 * Client component that allows users to filter products by category.
 * 
 * Features:
 * - Category filter tabs (All, Chair, Cabinet, Sofa, Bed)
 * - Product grid display
 * - "Add to Cart" buttons
 * - Product cards with image, name, and price
 * - Responsive grid layout
 * - Active category highlighting
 * - Filtered product display
 * 
 * @component
 */

"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Chair", "Cabinet", "Sofa", "Bed"];

const products = [
  { id: 1, name: "Easy Sofa", price: 266.0, category: "Sofa", image: "" },
  { id: 2, name: "Easy Sofa", price: 126.0, category: "Chair", image: "" },
  { id: 3, name: "Cabinet", price: 138.0, category: "Cabinet", image: "" },
  { id: 4, name: "Ramps Chair", price: 92.0, category: "Chair", image: "" },
  { id: 5, name: "Ramp Tut", price: 88.0, category: "Chair", image: "" },
  { id: 6, name: "Helmat", price: 212.0, category: "Cabinet", image: "" },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Our Signature Collections
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="min-w-[80px]"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <Button size="icon" className="rounded-full">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
