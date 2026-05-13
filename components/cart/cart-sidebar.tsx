/**
 * Cart Sidebar Component
 *
 * @description Sliding sidebar displaying shopping cart contents.
 * Provides cart management functionality with real-time updates.
 *
 * @features
 * - Cart items display with images and details
 * - Quantity adjustment controls
 * - Item removal functionality
 * - Cart total calculation
 * - Checkout button
 * - Empty cart state
 * - Slide-in animation
 * - Zustand state management integration
 *
 * @usage
 * Triggered by cart icon in header, slides in from right side.
 */
"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    itemCount,
    subtotal,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                {itemCount()}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some products to get started!
              </p>
              <Button onClick={closeCart} className="rounded-full">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => {
                  const itemKey = `${item.productId}-${item.selectedColor || ""}-${item.selectedSize || ""}`;

                  return (
                    <div
                      key={itemKey}
                      className="flex gap-4 pb-4 border-b last:border-b-0"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={closeCart}
                        className="shrink-0"
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.productId}`}
                          onClick={closeCart}
                          className="font-semibold text-gray-900 hover:text-gray-700 line-clamp-2 mb-1"
                        >
                          {item.name}
                        </Link>

                        {/* Variants */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex gap-2 text-xs text-gray-600 mb-2">
                            {item.selectedColor && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.selectedColor,
                                  item.selectedSize,
                                )
                              }
                              className="p-1 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 font-medium text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.selectedColor,
                                  item.selectedSize,
                                )
                              }
                              className="p-1 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-bold text-gray-900">
                            £{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        {/* Stock Warning */}
                        {item.quantity >= item.stock && (
                          <p className="text-xs text-red-600 mt-1">
                            Max stock reached
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          removeItem(
                            item.productId,
                            item.selectedColor,
                            item.selectedSize,
                          )
                        }
                        className="shrink-0 p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-700">Subtotal:</span>
                  <span className="font-bold text-gray-900">
                    £{subtotal().toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full h-12 rounded-full text-lg">
                    Checkout
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Button
                  variant="outline"
                  onClick={closeCart}
                  className="w-full rounded-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
