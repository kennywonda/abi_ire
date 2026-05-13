/**
 * Admin Order Management API - Single Order Operations
 * 
 * @description API endpoint for viewing and managing individual orders.
 * Allows admins to view full order details and update order status.
 * 
 * @routes
 * - GET /api/admin/orders/[id] - Retrieve complete order details
 * - PATCH /api/admin/orders/[id] - Update order status
 * 
 * @features
 * - Admin-only access control via NextAuth
 * - Complete order data retrieval
 * - Order status updates (pending, processing, shipped, delivered, cancelled)
 * - Status validation via Zod schema
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { OrderService } from '@/lib/services/orderService';
import { updateOrderStatusSchema } from '@/lib/validations/order';
import { ZodError } from 'zod';

// GET /api/admin/orders/:id - Get single order (admin)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // Get order (no user filtering for admin)
    const order = await OrderService.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Admin Order API Error:', error);

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
}

// PUT /api/admin/orders/:id - Update order status (admin)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    // Validate request body
    const validatedData = updateOrderStatusSchema.parse(body);

    // Update order status
    const order = await OrderService.updateOrderStatus(id, validatedData);

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('Admin Order API Error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
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
}
