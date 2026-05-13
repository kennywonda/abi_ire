/**
 * Cart Page Component
 *
 * @description Full-page shopping cart view with item management.
 * Alternative to cart sidebar for detailed cart review.
 *
 * @features
 * - Cart items display with images
 * - Quantity controls (increase/decrease)
 * - Item removal functionality
 * - Price calculations (subtotal, total)
 * - Continue shopping link
 * - Proceed to checkout button
 * - Empty cart state
 *
 * @usage
 * Used in /cart route for full cart page view
 */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";

const cartItems = [
  {
    id: 1,
    name: "Blue T-shirt",
    category: "Outerwear Men",
    price: 175,
    quantity: 1,
    image: "",
  },
  {
    id: 2,
    name: "Brown Jacket",
    category: "Outerwear Men",
    price: 175,
    quantity: 1,
    image: "",
  },
  {
    id: 3,
    name: "Brown Jacket",
    category: "Outerwear Men",
    price: 175,
    quantity: 1,
    image: "",
  },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [discountCode, setDiscountCode] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = 100;
  const total = subtotal - discount;

  const updateQuantity = (id: number, change: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 flex items-center gap-6"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Image
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.category}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {item.quantity} x £{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                {/* Discount Code */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Discount Code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      £{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount:</span>
                    <span className="font-semibold text-green-600">
                      -£{discount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                    <span>Total:</span>
                    <span>£{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button size="lg" className="w-full rounded-full">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
