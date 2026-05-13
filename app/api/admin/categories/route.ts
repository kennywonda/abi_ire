/**
 * Admin Categories API Route
 * 
 * POST /api/admin/categories - Create category
 * Protected route for admin users to create new categories.
 * 
 * @route POST /api/admin/categories
 * @protected Admin only
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/adminAuth';
import { CategoryService } from '@/lib/services/categoryService';
import { categorySchema } from '@/lib/validations/product';

/**
 * POST /api/admin/categories
 * Create a new category (Admin only)
 */
const postHandler = async (req: NextRequest, session: any) => {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = categorySchema.parse(body);

    // Create category
    const category = await CategoryService.createCategory(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      { status: 201 }
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
    console.error('Create category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create category',
      },
      { status: 500 }
    );
  }
};

/**
 * GET /api/admin/categories
 * Get all categories including inactive ones (Admin only)
 */
const getHandler = async (req: NextRequest, session: any) => {
  try {
    // Admin can see all categories including inactive
    const categories = await CategoryService.getCategories(true);

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
};

export const POST = withAdmin(postHandler);
export const GET = withAdmin(getHandler);
