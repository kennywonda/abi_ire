/**
 * Order Validation Schemas
 * 
 * This module defines Zod validation schemas for order-related operations.
 * Ensures data integrity for order creation, shipping, and status updates.
 * 
 * Features:
 * - Shipping address validation
 * - Order item validation
 * - Order creation validation
 * - Order status update validation
 * - Multiple payment method support
 * 
 * @module lib/validations/order
 */

import { z } from 'zod';

/**
 * Shipping address validation schema
 * Validates complete delivery address for order fulfillment
 */
export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'), // Recipient name
  phone: z.string().min(10, 'Phone number must be at least 10 digits'), // Contact number
  addressLine1: z.string().min(5, 'Address is required'), // Primary address
  addressLine2: z.string().optional(), // Secondary address (apartment, suite, etc.)
  city: z.string().min(2, 'City is required'), // City name
  state: z.string().min(2, 'State/Region is required'), // State/province
  postalCode: z.string().min(3, 'Postal code is required'), // ZIP/postal code
  country: z.string().min(2, 'Country is required'), // Country name
});

/**
 * Order item validation schema
 * Validates individual product items within an order
 */
export const orderItemSchema = z.object({
  product: z.string(), // Product ID reference
  name: z.string(), // Product name (cached for order history)
  price: z.number().positive(), // Price at time of purchase
  quantity: z.number().int().positive(), // Number of units
  image: z.string().optional(), // Product image (cached)
  selectedColor: z.string().optional(), // Color variant if selected
  selectedSize: z.string().optional(), // Size variant if selected
});

/**
 * Create order validation schema
 * Validates complete order creation with all required fields
 */
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'), // Order items
  shippingAddress: shippingAddressSchema, // Delivery address
  paymentMethod: z.enum(['cash_on_delivery', 'card', 'bank_transfer']).default('cash_on_delivery'), // Payment method
  notes: z.string().optional(), // Customer or admin notes
});

/**
 * Update order status validation schema
 * Validates order status changes with optional tracking info
 */
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']), // Order lifecycle status
  trackingNumber: z.string().optional(), // Shipping carrier tracking number
  notes: z.string().optional(), // Status change notes
});

/**
 * TypeScript type exports
 * Infer types from Zod schemas for type-safe usage
 */
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
