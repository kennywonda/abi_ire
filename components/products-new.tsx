/**
 * Products New Component - Alternative Product Grid
 * 
 * @description Alternative product listing with enhanced filtering.
 * Features search, category filtering, and wishlist integration.
 * 
 * @features
 * - Product search functionality
 * - Category filtering
 * - Wishlist/favorite toggle
 * - Product grid layout
 * - Add to cart functionality
 * - Loading states
 * - Real-time filtering
 * - Zustand cart integration
 * 
 * @usage
 * Alternative to default products component for homepage/catalog
 */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";

interface Product {
  _id: string;
  name: string;
  price: number;
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

interface Category {
  _id: string;
  name: string;
}

export default function ProductsNew() {
  const { addItem, openCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products with search and category filters
  const fetchProducts = useCallback(
    async (search: string = "", category: string = "All") => {
      try {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams({
          page: "1",
          limit: "12",
          isActive: "true",
        });

        if (search) {
          params.append("search", search);
        }

        if (category !== "All") {
          // Find category ID by name
          const categoryData = categories.find((cat) => cat.name === category);
          if (categoryData) {
            params.append("category", categoryData._id);
          }
        }

        const productsRes = await fetch(`/api/products?${params.toString()}`);

        if (!productsRes.ok) {
          throw new Error("Failed to fetch products");
        }

        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      } finally {
        setLoading(false);
      }
    },
    [categories],
  );

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch categories first
        const categoriesRes = await fetch("/api/categories");

        if (!categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch products when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts(searchQuery, activeCategory);
    }
  }, [categories, fetchProducts, searchQuery, activeCategory]);

  // Debounced search
  useEffect(() => {
    if (categories.length === 0) return;

    const timeoutId = setTimeout(() => {
      fetchProducts(searchQuery, activeCategory);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchProducts, activeCategory, categories]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Our Signature Collections
          </h2>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-8 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeCategory === "All"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.name)}
                className={`px-8 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeCategory === category.name
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="bg-gray-200 rounded-3xl aspect-square animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? `No products found for "${searchQuery}".`
                  : activeCategory === "All"
                    ? "No products available at the moment."
                    : `No products found in ${activeCategory} category.`}
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative bg-gray-100 rounded-3xl overflow-hidden aspect-square mb-4 group-hover:shadow-lg transition-shadow">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <p className="text-sm">No Image</p>
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Add to wishlist
                        }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick Add to Cart */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        disabled={product.stock === 0}
                        className="w-full rounded-full bg-white text-beige-700 hover:bg-beige-700 hover:text-white font-semibold shadow-xl border-2 border-beige-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </div>
                    )}

                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900">
                        £{product.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>⭐ {product.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span>
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
          )}
        </div>
      </div>
    </section>
  );
}
