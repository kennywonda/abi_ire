/**
 * Category Service Layer
 * 
 * @description Business logic for category management operations.
 * Handles CRUD operations, slug generation, and hierarchical category structure.
 * 
 * @features
 * - Category creation with auto-generated slugs
 * - Hierarchical category support (parent-child relationships)
 * - Category retrieval with filtering options
 * - Category updates and deletion
 * - Slug generation from category names
 * 
 * @methods
 * - createCategory: Create a new category with validation
 * - getCategories: Retrieve all categories with optional filters
 * - getCategoryById: Get single category by ID
 * - getCategoryBySlug: Get category by URL-friendly slug
 * - updateCategory: Update category details
 * - deleteCategory: Remove category from database
 * - generateSlug: Convert category name to URL-safe slug
 */
import connectDB from '../db/mongodb';
import Category, { ICategory } from '../models/Category';
import { CategoryInput } from '../validations/product';

export class CategoryService {
  /**
   * Generate slug from name
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  /**
   * Create a new category
   */
  static async createCategory(data: CategoryInput): Promise<ICategory> {
    await connectDB();

    // Generate slug from name if not provided
    const categoryData = {
      ...data,
      slug: data.slug || this.generateSlug(data.name),
    };

    const category = await Category.create(categoryData);
    return category;
  }

  /**
   * Get all categories
   */
  static async getCategories(includeInactive: boolean = false): Promise<ICategory[]> {
    await connectDB();

    const filter = includeInactive ? {} : { isActive: true };

    const categories = await Category.find(filter)
      .populate('parent', 'name slug')
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return categories as ICategory[];
  }

  /**
   * Get a single category by ID
   */
  static async getCategoryById(id: string): Promise<ICategory | null> {
    await connectDB();

    const category = await Category.findById(id)
      .populate('parent', 'name slug')
      .lean();

    return category as ICategory | null;
  }

  /**
   * Get a single category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    await connectDB();

    const category = await Category.findOne({ slug })
      .populate('parent', 'name slug')
      .lean();

    return category as ICategory | null;
  }

  /**
   * Update a category
   */
  static async updateCategory(
    id: string,
    data: Partial<CategoryInput>
  ): Promise<ICategory | null> {
    await connectDB();

    // Generate slug from name if name is being updated and slug is not provided
    const updateData = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = this.generateSlug(data.name);
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    return category;
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string): Promise<boolean> {
    await connectDB();

    // Check if category has products
    const Product = (await import('../models/Product')).default;
    const productsCount = await Product.countDocuments({ category: id });

    if (productsCount > 0) {
      throw new Error(
        `Cannot delete category. It has ${productsCount} product(s) associated with it.`
      );
    }

    // Check if category has child categories
    const childrenCount = await Category.countDocuments({ parent: id });

    if (childrenCount > 0) {
      throw new Error(
        `Cannot delete category. It has ${childrenCount} subcategory(ies).`
      );
    }

    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Toggle category active status
   */
  static async toggleCategoryStatus(id: string): Promise<ICategory | null> {
    await connectDB();

    const category = await Category.findById(id);
    if (!category) return null;

    category.isActive = !category.isActive;
    await category.save();

    return category;
  }

  /**
   * Get top-level categories (no parent)
   */
  static async getTopLevelCategories(): Promise<ICategory[]> {
    await connectDB();

    const categories = await Category.find({ parent: null, isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return categories as ICategory[];
  }

  /**
   * Get child categories of a parent
   */
  static async getChildCategories(parentId: string): Promise<ICategory[]> {
    await connectDB();

    const categories = await Category.find({ parent: parentId, isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return categories as ICategory[];
  }
}
