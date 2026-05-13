/**
 * Shopping Cart Model
 * 
 * This module defines the Cart schema for managing user shopping carts.
 * Each user has one cart that persists across sessions.
 * 
 * Features:
 * - One cart per user (unique constraint)
 * - Multiple items with variants (size/color)
 * - Quantity management
 * - Persistent storage across sessions
 * - Product variant support
 * 
 * @module lib/models/Cart
 */

import mongoose, { Schema, model, models, Document } from 'mongoose';

/**
 * Cart item interface
 * Represents a single product in the shopping cart
 */
export interface ICartItem {
  product: mongoose.Types.ObjectId; // Reference to Product document
  quantity: number; // Number of units in cart
  size?: string; // Selected size variant (if applicable)
  color?: string; // Selected color variant (if applicable)
}

/**
 * Cart document interface
 * Represents a user's complete shopping cart
 */
export interface ICart extends Document {
  user: mongoose.Types.ObjectId; // Cart owner (one cart per user)
  items: ICartItem[]; // Array of products in cart
  createdAt: Date; // Cart creation timestamp
  updatedAt: Date; // Last modification timestamp
}

/**
 * Cart item subdocument schema
 * Defines structure for individual items in the cart
 */
const CartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Link to Product document
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'], // Prevent zero/negative quantities
    default: 1,
  },
  size: {
    type: String, // Optional size selection
  },
  color: {
    type: String, // Optional color selection
  },
});

/**
 * Main Cart schema definition
 * 
 * Schema Features:
 * - One-to-one relationship with User (unique constraint)
 * - Embedded cart items as subdocuments
 * - Automatic timestamping
 * - Indexed user field for fast lookups
 */
const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Link to cart owner
      required: true,
      unique: true, // Ensures one cart per user
    },
    items: {
      type: [CartItemSchema], // Embedded cart items
      default: [], // Empty cart by default
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Index for fast user cart lookup
CartSchema.index({ user: 1 });

/**
 * Cart model export
 * Uses existing model if available (prevents recompilation)
 */
const Cart = models.Cart || model<ICart>('Cart', CartSchema);

export default Cart;
