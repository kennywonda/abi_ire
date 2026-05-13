/**
 * Admin Orders API Route
 * 
 * GET /api/admin/orders - List all orders
 * Protected route for admin users to view and manage all orders.
 * 
 * @route GET /api/admin/orders
 * @protected Admin only
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { OrderService } from '@/lib/services/orderService';
import { updateOrderStatusSchema } from '@/lib/validations/order';
import { ZodError } from 'zod';

// GET /api/admin/orders - Get all orders (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    // Get all orders
    const result = await OrderService.getAllOrders({
      page,
      limit,
      status,
      search,
    });

    return NextResponse.json({
      success: true,
      data: result,
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
