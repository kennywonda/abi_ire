/**
 * Checkout Page
 *
 * Order checkout and payment page with shipping address form.
 * Protected client component requiring authentication.
 *
 * Features:
 * - Session-based authentication check
 * - Shipping address form with validation
 * - Cart summary display
 * - Order total calculation
 * - Multiple payment methods (COD, Card, Bank Transfer)
 * - Zod validation for shipping address
 * - Loading state during order processing
 * - Success redirect after order creation
 * - Cart clearing on successful checkout
 * - Error handling and toast notifications
 *
 * @page
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Lock,
  Package,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { shippingAddressSchema } from "@/lib/validations/order";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United Kingdom",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && status === "authenticated") {
      router.push("/");
    }
  }, [items.length, status, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      shippingAddressSchema.parse({
        fullName: formData.fullName,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: any = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod as
          | "cash_on_delivery"
          | "card"
          | "bank_transfer",
        notes: formData.notes,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to place order");
      }

      // Clear cart and redirect to confirmation
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${result.data._id}/confirmation`);
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const shippingFee = 0;
  const tax = 0;
  const total = subtotal() + shippingFee + tax;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent">
                  Secure Checkout
                </h1>
                <p className="text-slate-600 mt-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Your payment information is secure
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Shipping Address
                    </h2>
                    <p className="text-sm text-slate-600">
                      Where should we deliver your order?
                    </p>
                  </div>
                  <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    Step 1 of 2
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`transition-all duration-200 ${errors.fullName ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}`}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+44 20 1234 5678"
                        className={`transition-all duration-200 ${errors.phone ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span className="font-medium">{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address Line 1 *
                    </label>
                    <Input
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Street address, P.O. box"
                      className={`transition-all duration-200 ${errors.addressLine1 ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}`}
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address Line 2
                    </label>
                    <Input
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City *
                      </label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="London"
                        className={`transition-all duration-200 ${errors.city ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        State/Region *
                      </label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="England"
                        className={`transition-all duration-200 ${errors.state ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}`}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Postal Code *
                      </label>
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="SW1A 1AA"
                        className={`transition-all duration-200 ${errors.postalCode ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}`}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Country *
                    </label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United Kingdom"
                      className={`transition-all duration-200 ${errors.country ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}`}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-linear-to-br from-rose-500 to-pink-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-rose-500/30">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Payment Method
                    </h2>
                    <p className="text-sm text-slate-600">
                      Choose how you want to pay
                    </p>
                  </div>
                  <div className="text-xs font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    Step 2 of 2
                  </div>
                </div>

                <div className="space-y-4">
                  <label
                    className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      formData.paymentMethod === "cash_on_delivery"
                        ? "border-emerald-500 bg-linear-to-br from-emerald-50 to-teal-50 shadow-md"
                        : "border-slate-200 hover:border-emerald-300 hover:shadow-md"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === "cash_on_delivery"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-slate-600">
                        Pay when you receive your order
                      </p>
                    </div>
                    {formData.paymentMethod === "cash_on_delivery" && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    )}
                  </label>

                  <label className="flex items-center gap-4 p-5 border-2 border-slate-200 rounded-2xl cursor-not-allowed opacity-60 transition-all duration-300">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                      className="w-5 h-5"
                    />
                    <div className="w-10 h-10 bg-linear-to-br from-slate-400 to-slate-500 text-white rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        Card Payment
                      </p>
                      <p className="text-sm text-slate-600">Coming soon</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                  placeholder="Special delivery instructions, gift message, etc."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100/50 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent">
                    Order Summary
                  </h2>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-slate-100">
                  {items.map((item) => {
                    const itemKey = `${item.productId}-${item.selectedColor || ""}-${item.selectedSize || ""}`;
                    return (
                      <div
                        key={itemKey}
                        className="flex gap-4 p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 line-clamp-2">
                            {item.name}
                          </p>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                              {item.selectedColor && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded">
                                  {item.selectedColor}
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded">
                                  {item.selectedSize}
                                </span>
                              )}
                            </p>
                          )}
                          <p className="text-sm text-slate-600 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900 self-center">
                          £{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-slate-100 pt-6 space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">
                      £{subtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600">Shipping</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Tax</span>
                    <span className="font-semibold">£0</span>
                  </div>
                  <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      £{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold rounded-2xl mt-8 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Secure SSL Encrypted Payment</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Free Shipping • 2-3 Day Delivery</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
