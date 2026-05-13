/**
 * Session Provider Component
 * 
 * @description Wrapper component providing NextAuth session context to the application.
 * Enables authentication state access throughout the app.
 * 
 * @features
 * - NextAuth session management
 * - Global authentication state
 * - Automatic session refresh
 * - Client-side session access
 * 
 * @props
 * - children: React nodes to wrap with session context
 * 
 * @usage
 * Wraps the entire application in root layout to provide auth context.
 */
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
