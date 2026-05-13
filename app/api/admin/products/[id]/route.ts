/**
 * Admin Product Management API - Single Product Operations
 * 
 * @description API endpoint for updating and deleting individual products.
 * Restricted to admin users only via adminAuth middleware.
 * 
 * @routes
 * - PUT /api/admin/products/[id] - Update product details
 * - DELETE /api/admin/products/[id] - Remove product from catalog
 * 
 * @features
 * - Partial updates supported via Zod schema validation
 * - Admin-only access control
 * - Product existence validation
 * - Error handling with detailed messages
 */
import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/adminAuth';
import { ProductService } from '@/lib/services/productService';
import { productSchema } from '@/lib/validations/product';

/**
 * PUT /api/admin/products/[id]
 * Update a product (Admin only)
 */
const putHandler = async (
  req: NextRequest,
  session: any,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();

    // Validate input (partial update allowed)
    const validatedData = productSchema.partial().parse(body);

    // Update product
    const product = await ProductService.updateProduct(params.id, validatedData);

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
        message: 'Product updated successfully',
        data: product,
      },
      { status: 200 }
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

    // General error
    console.error('Update product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update product',
      },
      { status: 500 }
    );
  }
};

/**
 * DELETE /api/admin/products/[id]
 * Delete a product (Admin only)
 */
const deleteHandler = async (
  req: NextRequest,
  session: any,
  { params }: { params: { id: string } }
) => {
  try {
    const success = await ProductService.deleteProduct(params.id);

    if (!success) {
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
        message: 'Product deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete product',
      },
      { status: 500 }
    );
  }
};

/**
 * GET /api/admin/products/[id]
 * Get a single product by ID (Admin only)
 */
const getHandler = async (
  req: NextRequest,
  session: any,
  { params }: { params: { id: string } }
) => {
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
};

// Wrapper to pass params to withAdmin handlers
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const handler = await withAdmin((r, s) => putHandler(r, s, context));
  return handler(req);
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const handler = await withAdmin((r, s) => deleteHandler(r, s, context));
  return handler(req);
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const handler = await withAdmin((r, s) => getHandler(r, s, context));
  return handler(req);
}
