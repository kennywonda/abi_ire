/**
 * Authentication Validation Schemas
 * 
 * This module defines Zod validation schemas for all authentication-related
 * forms and operations. It ensures data integrity and provides user-friendly
 * error messages for form validation.
 * 
 * Features:
 * - Login credential validation
 * - User registration validation with password confirmation
 * - Profile update validation
 * - Password change validation
 * - Type-safe form inputs
 * 
 * @module lib/validations/auth
 */

import { z } from 'zod';

/**
 * Login validation schema
 * Validates email and password for user authentication
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required') // Ensure field is not empty
    .email('Please enter a valid email'), // Validate email format
  password: z
    .string()
    .min(1, 'Password is required') // Ensure field is not empty
    .min(6, 'Password must be at least 6 characters'), // Minimum security requirement
});

/**
 * Registration validation schema
 * Validates new user signup with password confirmation
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters') // Minimum name length
    .max(100, 'Name cannot exceed 100 characters'), // Prevent excessive length
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'), // Email format validation
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters') // Security requirement
    .max(100, 'Password cannot exceed 100 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'), // Require confirmation
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match', // Cross-field validation
  path: ['confirmPassword'], // Error appears on confirmPassword field
});

/**
 * Update profile validation schema
 * Validates user profile information updates
 * All fields are optional to allow partial updates
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(), // Optional field for partial updates
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')), // Allow empty string
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(), // Entire address object is optional
});

/**
 * Change password validation schema
 * Validates password change with current password verification
 * and new password confirmation
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'), // Verify user identity
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters') // Security requirement
    .max(100, 'Password cannot exceed 100 characters'),
  confirmNewPassword: z
    .string()
    .min(1, 'Please confirm your new password'), // Require confirmation
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match', // Cross-field validation
  path: ['confirmNewPassword'], // Error appears on confirm field
});

/**
 * TypeScript type exports
 * Infer types from Zod schemas for type-safe form handling
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
