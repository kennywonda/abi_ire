/**
 * Order Model
 * 
 * This module defines the Order schema for managing customer orders.
 * It handles the complete order lifecycle from placement to delivery.
 * 
 * Features:
 * - Unique order number generation
 * - Order status tracking (pending → delivered)
 * - Payment status management
 * - Shipping address capture
 * - Multiple payment methods support
 * - Order history with timestamps
 * - Discount code support
 * - Order tracking capability
 * 
 * @module lib/models/Order
 */

import mongoose, { Schema, model, models, Document } from 'mongoose';

/**
 * Order item interface
 * Represents a single product within an order
 * Product details are cached to preserve order history even if product changes
 */
export interface IOrderItem {
  product: mongoose.Types.ObjectId; // Reference to Product
  productName: string; // Cached name (preserves history)
  productImage: string; // Cached image URL
  quantity: number; // Number of units ordered
  price: number; // Price at time of order (not current price)
  size?: string; // Selected size variant
  color?: string; // Selected color variant
}

/**
 * Shipping address interface
 * Complete delivery address for order fulfillment
 */
export interface IShippingAddress {
  fullName: string; // Recipient's full name
  phone: string; // Contact phone number
  street: string; // Street address
  city: string; // City name
  state: string; // State/province
  postalCode: string; // ZIP/postal code
  country: string; // Country name // Country name
}

/**
 * Order document interface
 * Complete order structure with all e-commerce order management features
 */
export interface IOrder extends Document {
  orderNumber: string; // Unique order identifier (e.g., ORD-202605-0001)
  user: mongoose.Types.ObjectId; // Customer who placed the order
  items: IOrderItem[]; // Products in this order
  shippingAddress: IShippingAddress; // Delivery address
  paymentMethod: string; // How customer will/did pay
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'; // Payment state
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Fulfillment state
  subtotal: number; // Sum of item prices before discounts
  discount: number; // Discount amount applied
  shippingFee: number; // Shipping/delivery cost
  total: number; // Final amount (subtotal - discount + shipping)
  discountCode?: string; // Promo/coupon code used
  trackingNumber?: string; // Shipping carrier tracking number
  notes?: string; // Customer or admin notes
  paidAt?: Date; // When payment was confirmed
  shippedAt?: Date; // When order was shipped
  deliveredAt?: Date; // When order was delivered
  cancelledAt?: Date; // When order was cancelled
  createdAt: Date; // Order placement timestamp
  updatedAt: Date; // Last modification timestamp // Last modification timestamp
}

/**
 * Order item subdocument schema
 * Caches product details to preserve order history
 */
const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Link to original product
    required: true,
  },
  productName: {
    type: String,
    required: true, // Cache name to preserve order details
  },
  productImage: {
    type: String,
    required: true, // Cache image for order history
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'], // Minimum order quantity
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'], // Price at time of purchase
  },
  size: {
    type: String, // Product size variant if selected
  },
  color: {
    type: String, // Product color variant if selected
  },
});

/**
 * Shipping address subdocument schema
 * Complete delivery address validation
 */
const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'], // Recipient name
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'], // Delivery contact
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
});

/**
 * Main Order schema definition
 * 
 * Schema Features:
 * - Unique order number for tracking
 * - Dual-status tracking (payment + fulfillment)
 * - Multiple payment method support
 * - Complete pricing breakdown (subtotal, discount, shipping)
 * - Timestamp tracking for order lifecycle events
 * - Embedded subdocuments for items and shipping address
 */
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true, // Unique order identifier
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Link to customer account
      required: true,
    },
    items: {
      type: [OrderItemSchema], // Ordered products
      required: true,
      validate: {
        validator: function (v: IOrderItem[]) {
          return v.length > 0; // Prevent empty orders
        },
        message: 'Order must have at least one item',
      },
    },
    shippingAddress: {
      type: ShippingAddressSchema, // Delivery destination
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'paypal', 'bank_transfer', 'cash_on_delivery'], // Supported payment methods
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'], // Payment lifecycle
      default: 'pending', // New orders await payment
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], // Fulfillment lifecycle
      default: 'pending', // New orders start as pending
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'], // Sum of item prices
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'], // Discount amount applied
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: [0, 'Shipping fee cannot be negative'], // Delivery cost
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'], // Final amount (subtotal - discount + shipping)
    },
    discountCode: {
      type: String, // Promo/coupon code if used
    },
    trackingNumber: {
      type: String, // Shipping carrier tracking number
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'], // Customer or admin notes
    },
    paidAt: {
      type: Date, // Payment confirmation timestamp
    },
    shippedAt: {
      type: Date, // Shipping dispatch timestamp
    },
    deliveredAt: {
      type: Date, // Delivery completion timestamp
    },
    cancelledAt: {
      type: Date, // Cancellation timestamp
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Indexes for optimized query performance
OrderSchema.index({ user: 1, createdAt: -1 }); // User's order history (newest first)
OrderSchema.index({ orderNumber: 1 }); // Fast order lookup
OrderSchema.index({ orderStatus: 1 }); // Filter by fulfillment status
OrderSchema.index({ paymentStatus: 1 }); // Filter by payment status
OrderSchema.index({ createdAt: -1 }); // Sort orders by date

/**
 * Pre-save middleware to auto-generate unique order numbers
 * 
 * Order Number Format: ORD-{timestamp}-{random}
 * Example: ORD-L8X9K2M-4AB7
 * 
 * Components:
 * - Prefix: 'ORD-' for easy identification
 * - Timestamp: Base36 encoded timestamp for chronological ordering
 * - Random: 4-character random string for uniqueness
 * 
 * Only generates if orderNumber is not already set
 */
OrderSchema.pre('save', async function (this: IOrder) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase(); // Current time in base36
    const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // Random 4-char string
    this.orderNumber = `ORD-${timestamp}-${random}`; // Combined unique identifier
  }
});

/**
 * Order model export
 * Uses existing model if available (prevents recompilation)
 */
const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
