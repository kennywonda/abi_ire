/**
 * Admin Products API Route
 * 
 * POST /api/admin/products - Create product
 * Protected route for admin users to create new products.
 * 
 * @route POST /api/admin/products
 * @protected Admin only
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/adminAuth';
import { ProductService } from '@/lib/services/productService';
import { productSchema } from '@/lib/validations/product';

/**
 * POST /api/admin/products
 * Create a new product (Admin only)
 */
const postHandler = async (req: NextRequest, session: any) => {
  try {
    const body = await req.json();
    
    console.log('Received product data:', body);

    // Validate input
    const validatedData = productSchema.parse(body);
    
    console.log('Validated data:', validatedData);

    // Create product
    const product = await ProductService.createProduct(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Validation error
    if (error.name === 'ZodError') {
      console.error('Validation errors:', error.errors);
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
    console.error('Create product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create product',
      },
      { status: 500 }
    );
  }
};

/**
 * GET /api/admin/products
 * Get all products including inactive ones (Admin only)
 */
const getHandler = async (req: NextRequest, session: any) => {
  try {
    const { searchParams } = new URL(req.url);

    const queryParams: any = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Admin can see all products including inactive
    const result = await ProductService.getProducts(queryParams);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
};

export const POST = withAdmin(postHandler);
export const GET = withAdmin(getHandler);
