/**
 * Product Details Component
 *
 * @description Comprehensive product information display with interactive features.
 * Shows product details, images, pricing, and purchase options.
 *
 * @features
 * - Product image gallery
 * - Product name, description, and pricing
 * - Stock availability indicator
 * - Quantity selector
 * - Add to cart functionality
 * - Product reviews and ratings
 * - Product specifications
 * - Shipping and return information
 * - Social sharing options
 *
 * @props
 * - product: Complete product object with all details
 *
 * @usage
 * Used in product detail page to display full product information.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Check,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import Link from "next/link";

interface ProductDetailsProps {
  product: any;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem, openCart } = useCartStore();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined,
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
  );
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image:
        product.images && product.images.length > 0 ? product.images[0] : "",
      stock: product.stock,
      selectedColor,
      selectedSize,
    });

    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      openCart();
    }, 500);
  };

  return (
    <>
      {/* Title & Rating */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">
            {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {product.sold > 1000
              ? `${(product.sold / 1000).toFixed(1)}k`
              : product.sold}{" "}
            sold
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-bold text-gray-900">
          £{product.price.toLocaleString()}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="text-2xl text-gray-400 line-through">
              £{product.compareAtPrice.toLocaleString()}
            </span>
            <span className="text-green-600 font-semibold">
              Save{" "}
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100,
              )}
              %
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <div className="border-t border-b border-gray-200 py-6">
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Select Color</h3>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedColor === color
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Select Size</h3>
          <div className="flex gap-3 flex-wrap">
            {product.sizes.map((size: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSize === size
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border border-gray-300 text-gray-900 hover:border-gray-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div
        className={`flex items-center gap-2 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
      >
        <div
          className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-600" : "bg-red-600"}`}
        />
        <span className="font-medium">
          {product.stock > 0
            ? `In Stock (${product.stock} available)`
            : "Out of Stock"}
        </span>
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-4">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addedToCart}
          className="flex-1 h-14 text-lg rounded-full"
        >
          {addedToCart ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </Button>
        <Button variant="outline" className="h-14 w-14 rounded-full">
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 pt-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6 text-gray-700" />
          </div>
          <span className="text-sm text-gray-600">Free Delivery</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-gray-700" />
          </div>
          <span className="text-sm text-gray-600">Easy Returns</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-gray-700" />
          </div>
          <span className="text-sm text-gray-600">Secure Payment</span>
        </div>
      </div>

      {/* Category & Tags */}
      {(product.category || (product.tags && product.tags.length > 0)) && (
        <div className="border-t border-gray-200 pt-6 space-y-3">
          {product.category && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Category:</span>
              <Link
                href={`/?category=${(product.category as any)._id}`}
                className="text-gray-900 hover:underline"
              >
                {(product.category as any).name || "Uncategorized"}
              </Link>
            </div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-gray-600 font-medium">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
