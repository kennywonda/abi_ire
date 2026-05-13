/**
 * MongoDB Database Connection Module
 * 
 * This module provides a singleton connection to MongoDB using Mongoose.
 * It implements connection pooling and caching to optimize performance
 * in serverless environments like Vercel.
 * 
 * Features:
 * - Connection caching to prevent multiple connections
 * - Environment variable validation
 * - Error handling and logging
 * - Optimized for Next.js serverless functions
 * 
 * @module lib/db/mongodb
 */

import mongoose from 'mongoose';

// Validate that MongoDB URI environment variable is set
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

// MongoDB connection string from environment variables
// MongoDB connection string from environment variables
const MONGODB_URI: string = process.env.MONGODB_URI;

/**
 * Interface for the cached Mongoose connection
 * Stores both the active connection and any pending connection promise
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global declaration to persist the connection across hot reloads
 * in development and lambda function invocations in production
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Cached connection object
 * Uses global scope to maintain connection across serverless function calls
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Initialize global cache if not already set
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and maintains a connection to MongoDB
 * 
 * This function implements a caching strategy to reuse database connections
 * across multiple serverless function invocations, improving performance
 * and reducing connection overhead.
 * 
 * Connection Strategy:
 * 1. Returns existing connection if available
 * 2. Reuses pending connection promise if connection is in progress
 * 3. Creates new connection only if necessary
 * 
 * @returns Promise<typeof mongoose> - The Mongoose instance with active connection
 * @throws Error if connection fails
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering for immediate errors
    };

    // Initiate connection and cache the promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    // Wait for connection promise to resolve
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on failure to allow retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
