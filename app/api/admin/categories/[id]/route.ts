/**
 * Admin Category Management API - Single Category Operations
 * 
 * @description API endpoint for updating and deleting individual categories.
 * Restricted to admin users only via adminAuth middleware.
 * 
 * @routes
 * - PUT /api/admin/categories/[id] - Update category details
 * - DELETE /api/admin/categories/[id] - Remove category
 * 
 * @features
 * - Partial updates supported via Zod schema validation
 * - Admin-only access control
 * - Category existence validation
 * - Hierarchical category support
 */
import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/adminAuth';
import { CategoryService } from '@/lib/services/categoryService';
import { categorySchema } from '@/lib/validations/product';

/**
 * PUT /api/admin/categories/[id]
 * Update a category (Admin only)
 */
const putHandler = async (
  req: NextRequest,
  session: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await req.json();

    // Validate input (partial update allowed)
    const validatedData = categorySchema.partial().parse(body);

    // Update category
    const category = await CategoryService.updateCategory(id, validatedData);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Category updated successfully',
        data: category,
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
    console.error('Update category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update category',
      },
      { status: 500 }
    );
  }
};

/**
 * DELETE /api/admin/categories/[id]
 * Delete a category (Admin only)
 */
const deleteHandler = async (
  req: NextRequest,
  session: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const success = await CategoryService.deleteCategory(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Category deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete category',
      },
      { status: 500 }
    );
  }
};

// Wrapper to pass params to withAdmin handlers
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const handler = await withAdmin((r, s) => putHandler(r, s, context));
  return handler(req);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const handler = await withAdmin((r, s) => deleteHandler(r, s, context));
  return handler(req);
}
