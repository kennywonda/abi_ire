/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations including:
 * - User registration with password hashing
 * - User profile management
 * - Password changes with verification
 * - Admin user creation
 * - User retrieval by ID or email
 * 
 * Security Features:
 * - Bcrypt password hashing (12 rounds)
 * - Password exclusion from responses
 * - Email uniqueness validation
 * - Current password verification for changes
 * 
 * @module lib/services/authService
 */

import bcrypt from 'bcryptjs';
import connectDB from '../db/mongodb';
import User, { IUser } from '../models/User';
import { RegisterInput, UpdateProfileInput } from '../validations/auth';

/**
 * Authentication Service Class
 * Static methods for user authentication and management
 */
export class AuthService {
  /**
   * Register a new user
   * 
   * Process:
   * 1. Check for existing user with same email
   * 2. Hash password using bcrypt
   * 3. Create user with default 'customer' role
   * 4. Return user data without password
   * 
   * @param data - Registration form data (name, email, password)
   * @returns User object without password field
   * @throws Error if email already exists
   */
  static async register(data: RegisterInput): Promise<Omit<IUser, 'password'>> {
    await connectDB();

    // Check if user already exists (prevent duplicate accounts)
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password using bcrypt (12 salt rounds for security)
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user with hashed password
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'customer', // Default role for new registrations
    });

    // Return user without password (security best practice)
    const userObject = user.toObject();
    const { password, ...userWithoutPassword } = userObject;
    
    return userWithoutPassword as Omit<IUser, 'password'>;
  }

  /**
   * Get user by ID
   * 
   * Retrieves user data without password field for security.
   * Used for profile display and user data fetching.
   * 
   * @param userId - MongoDB ObjectId as string
   * @returns User object without password, or null if not found
   */
  static async getUserById(userId: string): Promise<Omit<IUser, 'password'> | null> {
    await connectDB();

    // Exclude password field using select('-password')
    const user = await User.findById(userId).select('-password');
    return user;
  }

  /**
   * Get user by email
   * 
   * Retrieves complete user data INCLUDING password.
   * Used for authentication purposes only.
   * 
   * @param email - User email address
   * @returns Complete user object with password, or null if not found
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    await connectDB();

    const user = await User.findOne({ email });
    return user; // Includes password for authentication
  }

  /**
   * Update user profile
   * 
   * Updates allowed profile fields (name, phone, address).
   * Email and role cannot be updated through this method.
   * 
   * @param userId - User ID to update
   * @param data - Profile data to update (partial update allowed)
   * @returns Updated user without password
   * @throws Error if user not found
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<Omit<IUser, 'password'>> {
    await connectDB();

    // Update and return new document, run validators
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data }, // Only update provided fields
      { new: true, runValidators: true } // Return updated doc & validate
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Change user password
   * 
   * Security process:
   * 1. Verify current password is correct
   * 2. Hash new password
   * 3. Update user record
   * 
   * @param userId - User ID changing password
   * @param currentPassword - Current password for verification
   * @param newPassword - New password to set
   * @throws Error if user not found or current password incorrect
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password before allowing change (security)
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password using bcrypt (12 salt rounds)
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and save
    user.password = hashedPassword;
    await user.save();
  }

  /**
   * Create admin user
   * 
   * Creates a user with 'admin' role for administrative access.
   * Used for initial system setup or creating additional admins.
   * 
   * @param name - Admin full name
   * @param email - Admin email address
   * @param password - Admin password (will be hashed)
   * @returns Admin user object without password
   * @throws Error if email already exists
   */
  static async createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<Omit<IUser, 'password'>> {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      throw new Error('User with this email already exists');
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user with 'admin' role
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Grant admin privileges
    });

    // Return admin without password
    const adminObject = admin.toObject();
    const { password: _, ...adminWithoutPassword } = adminObject;
    
    return adminWithoutPassword as Omit<IUser, 'password'>;
  }
}
