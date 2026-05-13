/**
 * Single Product API Route
 * 
 * GET /api/products/[id] - Retrieve product by ID
 * Returns complete product details including images, pricing, and reviews.
 * 
 * @route GET /api/products/:id
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/productService';

/**
 * GET /api/products/[id]
 * Get a single product by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await ProductService.getProductById(params.id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}
