import { auth } from '../auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to check if user is authenticated
 * Use this in API routes that require authentication
 */
export async function withAuth(
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Please sign in.',
        },
        { status: 401 }
      );
    }

    return handler(req, session);
  };
}

/**
 * Get the current user session
 * Use this in server components or API routes
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Check if user is authenticated
 * Returns boolean
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}
