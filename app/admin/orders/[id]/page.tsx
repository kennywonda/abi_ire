/**
 * Admin Order Details Page
 *
 * @description Detailed view of a single order for admin management.
 * Allows viewing complete order information and updating order status.
 *
 * @route /admin/orders/[id]
 *
 * @features
 * - Complete order details display
 * - Customer information
 * - Order items with pricing
 * - Shipping address
 * - Order status timeline
 * - Status update functionality
 * - Order total calculations
 *
 * @access Admin users only
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";

interface OrderDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminOrderDetailPage({ params }: OrderDetailProps) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  // Order status and tracking
  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/login");
    } else if (
      sessionStatus === "authenticated" &&
      session?.user?.role !== "admin"
    ) {
      router.push("/");
    }
  }, [session, sessionStatus, router]);

  // Get order ID from params
  useEffect(() => {
    params.then((p) => {
      setOrderId(p.id);
    });
  }, [params]);

  // Fetch order details
  useEffect(() => {
    if (session?.user?.role === "admin" && orderId) {
      fetchOrder();
    }
  }, [session, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const result = await response.json();

      if (result.success && result.data) {
        setOrder(result.data);
        setStatus(result.data.status);
        setTrackingNumber(result.data.trackingNumber || "");
        setNotes(result.data.notes || "");
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber || undefined,
          notes: notes || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Order status updated successfully!");
        fetchOrder();
      } else {
        alert(result.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case "processing":
        return <Package className="w-6 h-6 text-blue-600" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-beige-600" />;
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Package className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-beige-100 text-beige-800 border-beige-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin" || !order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order {order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div
                className={`mt-4 md:mt-0 inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${getStatusColor(
                  order.status,
                )}`}
              >
                {getStatusIcon(order.status)}
                <span className="font-bold capitalize">{order.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">
                        {order.user.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {order.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>
                <div className="space-y-1 text-gray-600">
                  <p className="font-semibold text-gray-900">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.selectedColor && `${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && " • "}
                            {item.selectedSize && `${item.selectedSize}`}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          £{item.price.toLocaleString()} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          £{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>£{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>£{order.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>£{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Update Status */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Update Order Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>
                    <Input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this order..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="w-full rounded-full"
                  >
                    {updating ? "Updating..." : "Update Order"}
                  </Button>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {order.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium capitalize ${
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid At:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(order.paidAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Order Timeline
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  {order.deliveredAt && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-gray-600">Delivered</p>
                        <p className="font-medium text-gray-900">
                          {new Date(order.deliveredAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
