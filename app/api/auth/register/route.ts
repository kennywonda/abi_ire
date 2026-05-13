/**
 * User Registration API Route
 * 
 * POST /api/auth/register
 * 
 * Creates new user account with email and password.
 * Validates input using Zod schema and creates user via AuthService.
 * 
 * Request Body:
 * - name: string (min 2 chars)
 * - email: string (valid email format)
 * - password: string (min 6 chars)
 * - confirmPassword: string (must match password)
 * 
 * Response:
 * - 201: User created successfully
 * - 400: Validation error or duplicate email
 * - 500: Server error
 * 
 * @route POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { AuthService } from '@/lib/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Register user
    const user = await AuthService.register(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Duplicate user error
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 409 }
      );
    }

    // General error
    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
