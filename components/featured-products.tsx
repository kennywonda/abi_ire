/**
 * Featured Products Component
 * 
 * Displays featured products fetched from API with cart integration.
 * Client component that shows highlighted products on the homepage.
 * 
 * Features:
 * - Fetches featured products from API
 * - Star rating display
 * - Discount badge for compareAtPrice
 * - "Add to Cart" functionality with Zustand
 * - Loading state handling
 * - Product grid with responsive layout
 * - Links to individual product pages
 * - Stock availability display
 * - Sold count and rating indicators
 * 
 * @component
 */

"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";

interface Product {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: {
    _id: string;
    name: string;
  };
  images: string[];
  rating: number;
  sold: number;
  stock: number;
  featured: boolean;
}

export default function FeaturedProducts() {
  const { addItem, openCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/products?featured=true&limit=4&isActive=true",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch featured products");
        }

        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-linear-to-b from-white via-beige-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded w-56 animate-pulse" />
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="bg-gray-200 rounded-3xl aspect-square animate-pulse" />
                  <div className="space-y-3 px-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 bg-linear-to-b from-white via-beige-50/30 to-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-beige-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-beige-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <span className="inline-block px-4 py-2 bg-beige-100 text-beige-700 rounded-full text-sm font-semibold mb-3">
                New Collection
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                New Arrival
              </h2>
              <p className="text-gray-600 mt-2">
                Discover our latest fashion pieces
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-full bg-white border-2 border-beige-200 hover:bg-beige-600 hover:border-beige-600 hover:text-white transition-all shadow-md flex items-center justify-center group">
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-beige-600 text-white hover:bg-beige-700 transition-all shadow-lg flex items-center justify-center group">
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Featured Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative hover:translate-y--2 transition-transform duration-300">
                  {/* New Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-beige-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                    New
                  </div>

                  {/* Product Image */}
                  <div className="relative bg-linear-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden aspect-square mb-4 group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <p className="text-sm">No Image</p>
                      </div>
                    )}

                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            productId: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0] || "",
                            stock: product.stock,
                          });
                          openCart();
                        }}
                        className="w-full rounded-full bg-white text-beige-700 hover:bg-beige-700 hover:text-white font-semibold shadow-xl border-2 border-beige-700"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>

                    {/* Discount Badge */}
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          -
                          {Math.round(
                            ((product.compareAtPrice - product.price) /
                              product.compareAtPrice) *
                              100,
                          )}
                          %
                        </div>
                      )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3 px-2">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1 font-medium">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-beige-700 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-beige-700">
                        £{product.price.toLocaleString()}
                      </p>
                      {product.compareAtPrice &&
                        product.compareAtPrice > product.price && (
                          <p className="text-sm text-gray-400 line-through">
                            £{product.compareAtPrice.toLocaleString()}
                          </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs font-medium text-beige-600 bg-beige-50 px-2 py-1 rounded-full">
                        {product.category.name}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {product.sold > 1000
                          ? `${(product.sold / 1000).toFixed(1)}k`
                          : product.sold}{" "}
                        sold
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-10 py-6 text-base font-semibold border-2 border-beige-700 text-beige-700 hover:bg-beige-700 hover:text-white transition-all shadow-md hover:shadow-xl group"
              >
                View All Products
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

