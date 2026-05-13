/**
 * Products API Route
 * 
 * GET /api/products
 * 
 * Retrieves products with filtering, sorting, and pagination.
 * Validates query parameters and returns paginated results.
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - category: string (filter by category ID)
 * - search: string (full-text search)
 * - featured: boolean (only featured products)
 * - sortBy: 'createdAt'|'price'|'name'|'sold'|'rating'
 * - sortOrder: 'asc'|'desc'
 * - minPrice: number
 * - maxPrice: number
 * 
 * Response:
 * - 200: Paginated product list with metadata
 * - 400: Invalid query parameters
 * - 500: Server error
 * 
 * @route GET /api/products
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/productService';
import { productQuerySchema } from '@/lib/validations/product';

/**
 * GET /api/products
 * Get all products with filters and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const queryParams: any = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Validate query parameters
    const validatedQuery = productQuerySchema.parse(queryParams);

    // Get products
    const result = await ProductService.getProducts(validatedQuery);

    return NextResponse.json(result, { status: 200 });
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

    // General error
    console.error('Get products error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
