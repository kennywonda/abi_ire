/**
 * Order Confirmation Page
 *
 * @description Post-checkout confirmation page with order summary.
 * Displays successful order placement message and order details.
 *
 * @route /orders/[id]/confirmation
 *
 * @features
 * - Order confirmation message
 * - Order summary display
 * - Order number and tracking info
 * - Estimated delivery information
 * - Next steps guidance
 * - Navigation to order details
 * - Navigation to continue shopping
 *
 * @params
 * - id: Order unique identifier
 *
 * @authentication Required - redirects to login if not authenticated
 */
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Home, FileText } from "lucide-react";
import { OrderService } from "@/lib/services/orderService";
import { auth } from "@/lib/auth";

interface ConfirmationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
            <div className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full">
              <span className="text-sm text-gray-600">Order Number:</span>
              <span className="text-lg font-bold text-gray-900">
                {order.orderNumber}
              </span>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Details
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
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
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-sm text-gray-600">
                        {item.selectedColor && `${item.selectedColor}`}
                        {item.selectedColor && item.selectedSize && " • "}
                        {item.selectedSize && `${item.selectedSize}`}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
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
            <div className="border-t border-gray-200 pt-4 space-y-2">
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
          <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
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

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Payment Method
            </h2>
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-600">
                  Pay when you receive your order
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white mb-8">
            <h2 className="text-xl font-bold mb-6">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Order Confirmation</p>
                  <p className="text-sm text-gray-300">
                    You'll receive an email confirmation with your order details
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Order Processing</p>
                  <p className="text-sm text-gray-300">
                    We'll prepare your items and get them ready for shipping
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">On The Way</p>
                  <p className="text-sm text-gray-300">
                    Track your order status and delivery progress
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full h-12 rounded-full">
                <Package className="w-5 h-5 mr-2" />
                View All Orders
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full h-12 rounded-full">
                <Home className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
