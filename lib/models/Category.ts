/**
 * Category Model
 * 
 * This module defines the Category schema for organizing products
 * in the e-commerce system. Supports hierarchical categories with
 * parent-child relationships for better product organization.
 * 
 * Features:
 * - Hierarchical category structure (parent/child)
 * - Automatic slug generation from name
 * - Display ordering for custom arrangement
 * - Active/inactive status toggle
 * - SEO-friendly slugs
 * - Category images for visual appeal
 * 
 * @module lib/models/Category
 */

import mongoose, { Schema, model, models, Document } from 'mongoose';

/**
 * Category document interface
 * Defines the structure for product categorization
 */
export interface ICategory extends Document {
  name: string; // Display name of the category
  slug: string; // URL-friendly identifier
  description?: string; // Optional category description for SEO
  image?: string; // Category banner/thumbnail image
  parent?: mongoose.Types.ObjectId; // Reference to parent category for nesting
  isActive: boolean; // Whether category is visible to customers
  displayOrder: number; // Custom ordering for category display
  createdAt: Date; // Auto-generated creation timestamp
  updatedAt: Date; // Auto-generated update timestamp
}

/**
 * Mongoose schema definition for Category collection
 * 
 * Schema Configuration:
 * - Unique name and slug constraints
 * - Parent reference for hierarchical structure
 * - Display order for custom sorting
 * - Multiple indexes for optimized queries
 * - Auto-slug generation via pre-save hook
 */
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true, // Prevent duplicate category names
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true, // Ensure unique URLs
      lowercase: true, // Standardize for SEO
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'], // SEO meta description
    },
    image: {
      type: String, // URL to category image
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // Self-reference for nested categories
      default: null, // null means top-level category
    },
    isActive: {
      type: Boolean,
      default: true, // Categories are active by default
    },
    displayOrder: {
      type: Number,
      default: 0, // Lower numbers display first
    },
  },
  {
    timestamps: true, // Auto-add createdAt and updatedAt
  }
);

// Indexes for optimized query performance
CategorySchema.index({ slug: 1 }); // Fast category lookup by slug
CategorySchema.index({ parent: 1, isActive: 1 }); // Filter active subcategories
CategorySchema.index({ displayOrder: 1 }); // Sort categories by custom order

/**
 * Pre-save middleware to auto-generate slug from name
 * Converts category name to URL-friendly format
 * 
 * Slug Generation Rules:
 * - Convert to lowercase
 * - Remove special characters
 * - Replace spaces with hyphens
 * - Remove consecutive hyphens
 */
CategorySchema.pre('save', function (this: ICategory) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase() // Convert to lowercase
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Remove consecutive hyphens
      .trim(); // Remove leading/trailing whitespace
  }
});

/**
 * Category model export
 * Uses existing model if available (prevents recompilation)
 */
const Category = models.Category || model<ICategory>('Category', CategorySchema);

export default Category;
