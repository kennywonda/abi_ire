/**
 * Product Service Layer
 * 
 * @description Business logic for product management and catalog operations.
 * Handles product CRUD, filtering, search, pagination, and inventory management.
 * 
 * @features
 * - Product creation and management
 * - Advanced filtering (category, price range, search)
 * - Pagination and sorting
 * - Featured products handling
 * - Stock management and validation
 * - Product reviews integration
 * - Multi-variant product support
 * 
 * @methods
 * - createProduct: Add new product to catalog
 * - getProducts: Retrieve products with filters and pagination
 * - getProductById: Get single product details
 * - getProductBySlug: Get product by URL-friendly slug
 * - updateProduct: Update product information
 * - deleteProduct: Remove product from catalog
 * - updateStock: Manage inventory levels
 * - getFeaturedProducts: Retrieve featured products for homepage
 */
import connectDB from '../db/mongodb';
import Product, { IProduct } from '../models/Product';
import { ProductInput, ProductQuery } from '../validations/product';
import { PaginatedResponse } from '../types';

export class ProductService {
  /**
   * Create a new product
   */
  static async createProduct(data: ProductInput): Promise<IProduct> {
    await connectDB();

    const product = await Product.create(data);
    return product;
  }

  /**
   * Get all products with filters and pagination
   */
  static async getProducts(query: ProductQuery): Promise<PaginatedResponse<IProduct>> {
    await connectDB();

    const {
      page = 1,
      limit = 10,
      category,
      search,
      featured,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
    } = query;

    // Build filter object
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return {
      success: true,
      data: products as IProduct[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<IProduct | null> {
    await connectDB();

    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .lean();

    return product as IProduct | null;
  }

  /**
   * Get a single product by slug (for future use)
   */
  static async getProductBySlug(slug: string): Promise<IProduct | null> {
    await connectDB();

    // Assuming we add slug to Product model in the future
    const product = await Product.findOne({ slug })
      .populate('category', 'name slug')
      .lean();

    return product as IProduct | null;
  }

  /**
   * Update a product
   */
  static async updateProduct(
    id: string,
    data: Partial<ProductInput>
  ): Promise<IProduct | null> {
    await connectDB();

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    return product;
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<boolean> {
    await connectDB();

    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Toggle product active status
   */
  static async toggleProductStatus(id: string): Promise<IProduct | null> {
    await connectDB();

    const product = await Product.findById(id);
    if (!product) return null;

    product.isActive = !product.isActive;
    await product.save();

    return product;
  }

  /**
   * Add a review to a product
   */
  static async addReview(
    productId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string
  ): Promise<IProduct | null> {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) return null;

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (review: any) => review.user.toString() === userId
    );

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Add review
    product.reviews.push({
      user: userId as any,
      userName,
      rating,
      comment,
      createdAt: new Date(),
    });

    // Update rating
    product.updateRating();
    await product.save();

    return product;
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<IProduct[]> {
    await connectDB();

    const products = await Product.find({ featured: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return products as IProduct[];
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(
    categoryId: string,
    limit?: number
  ): Promise<IProduct[]> {
    await connectDB();

    const query = Product.find({ category: categoryId, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    if (limit) {
      query.limit(limit);
    }

    const products = await query.lean();
    return products as IProduct[];
  }

  /**
   * Update product stock after order
   */
  static async updateStock(
    productId: string,
    quantity: number,
    operation: 'decrease' | 'increase' = 'decrease'
  ): Promise<IProduct | null> {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) return null;

    if (operation === 'decrease') {
      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }
      product.stock -= quantity;
      product.sold += quantity;
    } else {
      product.stock += quantity;
      product.sold = Math.max(0, product.sold - quantity);
    }

    await product.save();
    return product;
  }

  /**
   * Search products (text search)
   */
  static async searchProducts(
    searchTerm: string,
    limit: number = 20
  ): Promise<IProduct[]> {
    await connectDB();

    const products = await Product.find(
      { $text: { $search: searchTerm }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    return products as IProduct[];
  }
}
