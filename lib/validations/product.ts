/**
 * Product Validation Schemas
 * 
 * This module defines Zod validation schemas for product-related operations.
 * Includes validation for product CRUD, querying, reviews, and categories.
 * 
 * Features:
 * - Product creation/update validation
 * - Query parameter validation with defaults
 * - Review submission validation
 * - Category management validation
 * - Type-safe transformations for string inputs
 * 
 * @module lib/validations/product
 */

import { z } from 'zod';

/**
 * Product creation/update validation schema
 * Validates all product fields including variants, pricing, and inventory
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters') // Minimum length
    .max(200, 'Product name cannot exceed 200 characters'), // SEO title limit
  description: z
    .string()
    .min(1, 'Product description is required')
    .min(10, 'Description must be at least 10 characters') // Minimum quality requirement
    .max(2000, 'Description cannot exceed 2000 characters'), // Prevent excessive length
  price: z
    .number()
    .min(0, 'Price cannot be negative') // Pricing validation
    .or(z.string().transform((val) => parseFloat(val))), // Accept string input
  compareAtPrice: z
    .number()
    .min(0, 'Compare at price cannot be negative') // Original price for discounts
    .optional()
    .or(z.string().transform((val) => parseFloat(val) || undefined)), // Transform string
  category: z
    .string()
    .min(1, 'Category is required'), // Product must belong to a category
  images: z
    .array(z.string().url('Each image must be a valid URL')) // Validate each URL
    .min(1, 'At least one image is required') // Minimum images
    .max(10, 'Maximum 10 images allowed'), // Prevent excessive uploads
  colors: z
    .array(z.string())
    .default([]), // Available color variants
  sizes: z
    .array(z.string())
    .default([]), // Available size variants
  stock: z
    .number()
    .min(0, 'Stock cannot be negative') // Inventory validation
    .int('Stock must be a whole number') // No fractional inventory
    .or(z.string().transform((val) => parseInt(val, 10))), // Accept string input
  featured: z
    .boolean()
    .default(false), // Featured product flag
  tags: z
    .array(z.string())
    .default([]), // Product tags for filtering
  isActive: z
    .boolean()
    .default(true), // Active/inactive status
});

/**
 * Product filter/query validation schema
 * Validates and transforms URL query parameters for product listing
 */
export const productQuerySchema = z.object({
  page: z
    .number()
    .min(1) // Minimum page number
    .default(1)
    .or(z.string().transform((val) => parseInt(val, 10) || 1)), // Transform string to number
  limit: z
    .number()
    .min(1) // Minimum results per page
    .max(100) // Prevent excessive data fetching
    .default(10) // Default page size
    .or(z.string().transform((val) => {
      const num = parseInt(val, 10);
      return num > 0 && num <= 100 ? num : 10; // Validate and default
    })),
  category: z.string().optional(), // Filter by category ID
  search: z.string().optional(), // Full-text search query
  featured: z
    .boolean()
    .optional()
    .or(z.string().transform((val) => val === 'true')), // Transform string boolean
  isActive: z
    .boolean()
    .optional()
    .or(z.string().transform((val) => val === 'true')), // Transform string boolean
  sortBy: z
    .enum(['createdAt', 'price', 'name', 'sold', 'rating']) // Valid sort fields
    .default('createdAt')
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc']) // Sort direction
    .default('desc') // Newest first by default
    .optional(),
  minPrice: z
    .number()
    .min(0) // Price range filter (minimum)
    .optional()
    .or(z.string().transform((val) => parseFloat(val) || undefined)),
  maxPrice: z
    .number()
    .min(0) // Price range filter (maximum)
    .optional()
    .or(z.string().transform((val) => parseFloat(val) || undefined)),
});

/**
 * Product review validation schema
 * Validates customer product reviews with rating and comment
 */
export const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'), // Product being reviewed
  rating: z
    .number()
    .min(1, 'Rating must be at least 1') // Minimum rating
    .max(5, 'Rating cannot exceed 5') // Maximum rating (5-star system)
    .int('Rating must be a whole number') // No fractional ratings
    .or(z.string().transform((val) => parseInt(val, 10))), // Accept string input
  comment: z
    .string()
    .min(1, 'Comment is required')
    .min(10, 'Comment must be at least 10 characters') // Minimum quality requirement
    .max(500, 'Comment cannot exceed 500 characters'), // Prevent excessive length
});

/**
 * Category validation schema
 * Validates product category creation and updates
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name cannot exceed 100 characters'), // Length limits
  slug: z
    .string()
    .min(1, 'Category slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only') // SEO-friendly slug format
    .optional(), // Auto-generated from name if not provided
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters') // SEO meta description
    .optional(),
  image: z
    .string()
    .url('Image must be a valid URL') // Category banner/thumbnail
    .optional(),
  parent: z
    .string()
    .optional(), // Parent category for hierarchical structure
  isActive: z
    .boolean()
    .default(true), // Active/inactive status
  displayOrder: z
    .number()
    .int('Display order must be a whole number') // Custom category ordering
    .default(0)
    .or(z.string().transform((val) => parseInt(val, 10) || 0)), // Accept string input
});

/**
 * TypeScript type exports
 * Infer types from Zod schemas for type-safe usage
 */
export type ProductInput = z.infer<typeof productSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
