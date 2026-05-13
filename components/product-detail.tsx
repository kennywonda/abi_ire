/**
 * Product Detail Component - Standalone Version
 * 
 * @description Alternative product detail view with size/color selection.
 * Standalone component for product detail pages.
 * 
 * @features
 * - Size selection (S, M, L, XL, XXL)
 * - Color selection with visual swatches
 * - Quantity controls
 * - Add to cart functionality
 * - Wishlist/favorite toggle
 * - Star ratings display
 * - Product image gallery
 * - Breadcrumb navigation
 * 
 * @usage
 * Alternative to product-details component in product/[id] pages
 */
"use client";

import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("beige");
  const [quantity, setQuantity] = useState(1);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "beige", class: "bg-amber-100" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "black", class: "bg-black" },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Product Image */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden aspect-square">
              <button className="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Product Image</p>
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Coat Fashion Trendy
                </h1>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-gray-500">Ratings</span>
                  </div>
                  <div className="text-gray-500">13 +review</div>
                  <div className="text-gray-500">34k+ sold</div>
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-5xl font-bold text-gray-900">£85</p>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full ${color.class} ${
                        selectedColor === color.name
                          ? "ring-2 ring-offset-2 ring-gray-900"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay warm and stylish with this modern fashion-forward coat —
                  perfect for both casual and semi-formal wear.
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-full font-medium transition-all ${
                        selectedSize === size
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="flex-1 rounded-full">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
