/**
 * User Model
 * 
 * This module defines the User schema and model for the application.
 * It handles both admin and customer user accounts with authentication
 * and profile management capabilities.
 * 
 * Features:
 * - Role-based access control (admin/customer)
 * - Email validation and uniqueness
 * - Password hashing (handled by authentication service)
 * - Optional profile information (phone, address, image)
 * - Automatic timestamps (createdAt, updatedAt)
 * 
 * @module lib/models/User
 */

import mongoose, { Schema, model, models, Document } from 'mongoose';

/**
 * User document interface extending Mongoose Document
 * Defines the structure and types for user data
 */
export interface IUser extends Document {
  name: string; // Full name of the user
  email: string; // Unique email address for authentication
  password: string; // Hashed password (never store plain text)
  role: 'admin' | 'customer'; // User role for authorization
  image?: string; // Profile image URL
  phone?: string; // Contact phone number
  address?: { // Optional shipping/billing address
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: Date; // Auto-generated account creation timestamp
  updatedAt: Date; // Auto-generated last update timestamp
}

/**
 * Mongoose schema definition for User collection
 * 
 * Schema Configuration:
 * - Email validation with regex pattern
 * - Unique email constraint for authentication
 * - Password minimum length requirement
 * - Default role set to 'customer'
 * - Automatic timestamp generation
 * - Indexed email field for query optimization
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // Remove leading/trailing whitespace
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensure no duplicate accounts
      lowercase: true, // Store in lowercase for case-insensitive matching
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'], // Email format validation
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'], // Minimum security requirement
    },
    role: {
      type: String,
      enum: ['admin', 'customer'], // Only allow these two roles
      default: 'customer', // New users default to customer role
    },
    image: {
      type: String, // URL to profile image
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Index for faster queries by email (used in authentication)
UserSchema.index({ email: 1 });

/**
 * User model export
 * Uses existing model if available (prevents recompilation in development)
 */
const User = models.User || model<IUser>('User', UserSchema);

export default User;
