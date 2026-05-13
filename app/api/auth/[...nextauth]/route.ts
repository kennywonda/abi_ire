/**
 * NextAuth Authentication API Route Handler
 * 
 * @description Catch-all route handler for NextAuth v5 authentication.
 * Manages all authentication-related requests including sign-in, sign-out,
 * session management, and OAuth callbacks.
 * 
 * @routes
 * - GET /api/auth/* - Authentication GET requests (session, providers, csrf)
 * - POST /api/auth/* - Authentication POST requests (signin, signout, callback)
 * 
 * @features
 * - Credentials-based authentication
 * - JWT session management
 * - Automatic session refresh
 * - CSRF protection
 * - Configurable callbacks and events
 * 
 * @see /lib/auth.ts for NextAuth configuration
 */
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
