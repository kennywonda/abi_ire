import { auth } from '../auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to check if user is an admin
 * Use this in API routes that require admin access
 */
export async function withAdmin(
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

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden. Admin access required.',
        },
        { status: 403 }
      );
    }

    return handler(req, session);
  };
}

/**
 * Check if current user is an admin
 * Returns boolean
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'admin';
}

/**
 * Get admin session or throw error
 * Use this in server components that require admin access
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized. Please sign in.');
  }

  if (session.user.role !== 'admin') {
    throw new Error('Forbidden. Admin access required.');
  }

  return session;
}
