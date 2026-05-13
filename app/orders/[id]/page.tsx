/**
 * Order Details Page
 *
 * @description Customer-facing order details page showing complete order information.
 * Displays order status, items, shipping details, and tracking information.
 *
 * @route /orders/[id]
 *
 * @features
 * - Order details display (order number, date, status)
 * - Order items list with pricing
 * - Shipping address information
 * - Order status timeline
 * - Total price breakdown
 * - User authentication check
 * - Order ownership validation
 *
 * @params
 * - id: Order unique identifier
 *
 * @authentication Required - redirects to login if not authenticated
 */
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import { OrderService } from "@/lib/services/orderService";
import { auth } from "@/lib/auth";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  let order;
  try {
    order = await OrderService.getOrderById(id, session.user.id);
    if (!order) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/orders"
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
                className={`mt-4 md:mt-0 inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status)}
                <span className="font-bold capitalize">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Status
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                <div className="relative flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      order.status === "pending" ||
                      order.status === "processing" ||
                      order.status === "shipped" ||
                      order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-semibold text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      order.status === "processing" ||
                      order.status === "shipped" ||
                      order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-semibold text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">
                      {order.status === "pending"
                        ? "Waiting to be processed"
                        : "Order is being prepared"}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      order.status === "shipped" || order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-semibold text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-600">
                      {order.trackingNumber
                        ? `Tracking: ${order.trackingNumber}`
                        : "Not yet shipped"}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">
                      {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleDateString(
                            "en-GB",
                          )
                        : "Not yet delivered"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b last:border-b-0"
                >
                  <Link href={`/product/${item.product}`} className="shrink-0">
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
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product}`}
                      className="font-semibold text-gray-900 hover:text-gray-700"
                    >
                      {item.name}
                    </Link>
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

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Shipping Address
              </h2>
            </div>
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

          {/* Payment Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Payment Information
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
