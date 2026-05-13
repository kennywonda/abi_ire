/**
 * TypeScript Type Definitions
 * 
 * @description Central type export file for database models and enums.
 * Re-exports all model types for convenient importing throughout the app.
 * 
 * @exports
 * - IUser: User model interface
 * - IProduct: Product model interface
 * - IReview: Product review interface
 * - ICategory: Category model interface
 * - IOrder: Order model interface
 * - IOrderItem: Order item interface
 * - IShippingAddress: Shipping address interface
 * - ICart: Shopping cart interface
 * - ICartItem: Cart item interface
 * - UserRole: User role type ('admin' | 'customer')
 * 
 * @usage
 * import { IProduct, IOrder, UserRole } from '@/lib/types'
 */
// Re-export all model types for easy importing

// User types
export type { IUser } from './models/User';

// Product types
export type { IProduct, IReview } from './models/Product';

// Category types
export type { ICategory } from './models/Category';

// Order types
export type { IOrder, IOrderItem, IShippingAddress } from './models/Order';

// Cart types
export type { ICart, ICartItem } from './models/Cart';

// Role enum
export type UserRole = 'admin' | 'customer';

// Order status enums
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
