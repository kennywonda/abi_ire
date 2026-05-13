/**
 * Categories API Route
 * 
 * GET /api/categories
 * 
 * Retrieves all active categories for public display.
 * Returns hierarchical category list.
 * 
 * Query Parameters: None
 * 
 * Response:
 * - 200: Array of category objects
 * - 500: Server error
 * 
 * @route GET /api/categories
 */

import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/services/categoryService';

/**
 * GET /api/categories
 * Get all active categories
 */
export async function GET(req: NextRequest) {
  try {
    const categories = await CategoryService.getCategories(false);

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
