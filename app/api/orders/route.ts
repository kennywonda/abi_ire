/**
 * Orders API Route
 * 
 * POST /api/orders
 * 
 * Creates new order for authenticated user.
 * Protected route requiring valid session.
 * 
 * Request Body:
 * - items: array of order items
 * - shippingAddress: complete shipping address object
 * - paymentMethod: 'cash_on_delivery'|'card'|'bank_transfer'
 * - notes: string (optional)
 * 
 * Response:
 * - 201: Order created successfully
 * - 400: Validation error
 * - 401: Unauthorized
 * - 500: Server error
 * 
 * @route POST /api/orders
 * @protected Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { OrderService } from '@/lib/services/orderService';
import { createOrderSchema } from '@/lib/validations/order';
import { ZodError } from 'zod';

// POST /api/orders - Create new order
export const POST = withAuth(async (req: NextRequest, session: any) => {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = createOrderSchema.parse(body);

    // Create order
    const order = await OrderService.createOrder(session.user.id, validatedData);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: order,
    }, { status: 201 });
  } catch (error) {
    console.error('Order API Error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// GET /api/orders - Get user's orders  
export const GET = withAuth(async (req: NextRequest, session: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;

    const result = await OrderService.getUserOrders(session.user.id, {
      page,
      limit,
      status,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Order API Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});
