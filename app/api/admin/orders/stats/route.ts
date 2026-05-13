/**
 * Admin Order Statistics API
 * 
 * @description Provides aggregated order statistics and analytics for admin dashboard.
 * Delivers key metrics for business intelligence and reporting.
 * 
 * @route GET /api/admin/orders/stats
 * 
 * @returns
 * - Total orders count
 * - Revenue statistics
 * - Order status breakdown
 * - Recent orders summary
 * - Performance trends
 * 
 * @authentication Admin role required via NextAuth session
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { OrderService } from '@/lib/services/orderService';

// GET /api/admin/orders/stats - Get order statistics
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get order statistics
    const stats = await OrderService.getOrderStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Admin Order Stats API Error:', error);

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
