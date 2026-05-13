/**
 * Product Model
 * 
 * This module defines the Product schema for the e-commerce platform.
 * It handles product information, inventory management, reviews, and ratings.
 * 
 * Features:
 * - Product variants (colors, sizes)
 * - Inventory tracking (stock, sold count)
 * - Customer reviews and ratings
 * - Featured products functionality
 * - Image gallery support
 * - Discount pricing with compareAtPrice
 * - Category relationships
 * - Full-text search capability
 * - Product tags for filtering
 * 
 * @module lib/models/Product
 */

import mongoose, { Schema, model, models, Document } from 'mongoose';

/**
 * Review subdocument interface
 * Defines the structure for customer product reviews
 */
export interface IReview {
  user: mongoose.Types.ObjectId; // Reference to User who wrote review
  userName: string; // Cached username for display
  rating: number; // Star rating (1-5)
  comment: string; // Review text content
  createdAt: Date; // Review submission timestamp
}

/**
 * Product document interface
 * Defines complete product structure with all e-commerce features
 */
export interface IProduct extends Document {
  name: string; // Product display name
  description: string; // Detailed product description
  price: number; // Current selling price
  compareAtPrice?: number; // Original price for showing discounts
  category: mongoose.Types.ObjectId; // Reference to product category
  images: string[]; // Array of product image URLs
  colors: string[]; // Available color variants (names or hex codes)
  sizes: string[]; // Available size options (e.g., S, M, L, XL)
  stock: number; // Current inventory quantity
  sold: number; // Total units sold (for popularity)
  featured: boolean; // Whether to show on homepage/featured section
  rating: number; // Average customer rating (0-5)
  reviews: IReview[]; // Array of customer reviews
  tags?: string[]; // Product tags for filtering (e.g., 'new-arrival', 'sale')
  isActive: boolean; // Whether product is visible to customers
  createdAt: Date; // Product creation timestamp
  updatedAt: Date; // Last modification timestamp
}

/**
 * Review subdocument schema
 * Nested within Product to store all customer reviews
 */
const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Link to user who wrote review
      required: true,
    },
    userName: {
      type: String,
      required: true, // Cache username to avoid extra lookups
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Minimum star rating
      max: 5, // Maximum star rating
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, // Limit review length
    },
  },
  {
    timestamps: true, // Auto-add createdAt for review date
  }
);

/**
 * Main Product schema definition
 * 
 * Schema Features:
 * - Comprehensive validation rules
 * - Multiple indexes for search and filtering
 * - Support for variants (colors/sizes)
 * - Inventory management fields
 * - Customer review system
 * - Featured product capability
 */
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'], // SEO title length
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'], // Detailed product info
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'], // Prevent invalid prices
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price cannot be negative'], // Original price for discount display
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // Link to category document
      required: [true, 'Category is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0; // Ensure at least one product image
        },
        message: 'At least one image is required',
      },
    },
    colors: {
      type: [String],
      default: [], // Available color options
    },
    sizes: {
      type: [String],
      default: [], // Available size options
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'], // Prevent negative inventory
      default: 0,
    },
    sold: {
      type: Number,
      default: 0, // Track total sales
      min: [0, 'Sold count cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false, // Show in featured products section
    },
    rating: {
      type: Number,
      default: 0, // Calculated average from reviews
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviews: {
      type: [ReviewSchema], //  Embedded review documents
      default: [],
    },
    tags: {
      type: [String],
      default: [], // Keywords for filtering (e.g., 'sale', 'new-arrival')
    },
    isActive: {
      type: Boolean,
      default: true, // Products active by default
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Indexes for optimized query performance
ProductSchema.index({ name: 'text', description: 'text' }); // Full-text search on name and description
ProductSchema.index({ category: 1, isActive: 1 }); // Filter products by category
ProductSchema.index({ featured: 1, isActive: 1 }); // Quick access to featured products
ProductSchema.index({ createdAt: -1 }); // Sort by newest products

/**
 * Instance method to recalculate average product rating
 * Called after reviews are added/updated/removed
 * 
 * Updates the rating field based on all review ratings
 */
ProductSchema.methods.updateRating = function () {
  if (this.reviews.length > 0) {
    // Calculate average of all review ratings
    const totalRating = this.reviews.reduce((sum: number, review: IReview) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
  } else {
    // No reviews = 0 rating
    this.rating = 0;
  }
};

/**
 * Product model export
 * Uses existing model if available (prevents recompilation)
 */
const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
