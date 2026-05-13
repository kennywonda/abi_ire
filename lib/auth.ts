/**
 * NextAuth Configuration
 * 
 * This module configures authentication for the application using NextAuth v5.
 * It handles user authentication, session management, and JWT token generation.
 * 
 * Features:
 * - Email/password authentication with bcrypt
 * - JWT-based sessions for stateless auth
 * - Role-based access control (admin/customer)
 * - Custom sign-in/sign-out pages
 * - Session persistence (30 days)
 * - Secure password comparison
 * 
 * @module lib/auth
 */

import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './db/mongodb';
import User from './models/User';

/**
 * NextAuth configuration object
 * Defines authentication providers, callbacks, and session settings
 */
export const authConfig: NextAuthConfig = {
  providers: [
    /**
     * Credentials Provider
     * Handles email/password authentication
     */
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Authentication logic
       * Validates user credentials against database
       * 
       * @param credentials - User email and password
       * @returns User object if authentication succeeds
       * @throws Error if authentication fails
       */
      async authorize(credentials: any) {
        // Validate input presence
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        // Connect to database
        await connectDB();
        
        // Find user by email
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Invalid email or password'); // Generic error for security
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password'); // Generic error for security
        }

        // Return user data for session
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * JWT Callback
     * Adds custom fields to JWT token
     * 
     * @param token - Current JWT token
     * @param user - User object (only on sign-in)
     * @returns Updated token with user ID and role
     */
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id; // Add user ID to token
        token.role = user.role; // Add role for authorization
      }
      return token;
    },
    /**
     * Session Callback
     * Adds custom fields to session object
     * 
     * @param session - Current session object
     * @param token - JWT token with custom fields
     * @returns Updated session with user ID and role
     */
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string; // Add ID to session
        session.user.role = token.role as string; // Add role for client-side access
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login', // Custom login page
    signOut: '/auth/login', // Redirect after sign out
    error: '/auth/login', // Error redirect
  },
  session: {
    strategy: 'jwt', // Use JWT for stateless sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days session lifetime
  },
  secret: process.env.NEXTAUTH_SECRET, // JWT encryption secret
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in dev
};

/**
 * NextAuth handlers and helpers
 * Export configured authentication functions
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
