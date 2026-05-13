/**
 * Order Service Layer
 * 
 * @description Business logic for order management and transaction processing.
 * Handles order creation, status updates, inventory validation, and order tracking.
 * 
 * @features
 * - Order creation with stock validation
 * - Unique order number generation
 * - Order status management (pending → processing → shipped → delivered)
 * - Order history tracking
 * - Stock reduction on order placement
 * - Order statistics and analytics
 * - User-specific order retrieval
 * 
 * @methods
 * - createOrder: Create new order with inventory validation
 * - getOrders: Retrieve all orders with filters
 * - getOrderById: Get single order details
 * - getUserOrders: Get orders for specific user
 * - updateOrderStatus: Change order status
 * - generateOrderNumber: Create unique order identifier
 * - getOrderStats: Calculate order statistics for admin dashboard
 */
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import connectDB from '@/lib/db/mongodb';
import { CreateOrderInput, UpdateOrderStatus } from '@/lib/validations/order';

export class OrderService {
  /**
   * Generate unique order number
   */
  private static generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Create a new order
   */
  static async createOrder(
    userId: string,
    orderData: CreateOrderInput
  ): Promise<any> {
    await connectDB();

    // Validate stock availability and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Product ${item.name} not found`);
      }

      if (!product.isActive) {
        throw new Error(`Product ${item.name} is no longer available`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.name}. Only ${product.stock} available`
        );
      }

      // Verify price hasn't changed (prevent manipulation)
      if (product.price !== item.price) {
        throw new Error(
          `Price for ${item.name} has changed. Please refresh and try again`
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        productName: item.name,
        productImage: item.image || (product.images && product.images[0]) || '',
        price: product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
      });

      // Update product stock and sold count
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    // Calculate shipping (free for now, can be enhanced)
    const shippingFee = 0;
    
    // Calculate tax (0% for now, can be enhanced)
    const tax = 0;
    
    const total = subtotal + shippingFee + tax;

    // Map validation schema fields to Order model fields
    const shippingAddress = {
      fullName: orderData.shippingAddress.fullName,
      phone: orderData.shippingAddress.phone,
      street: orderData.shippingAddress.addressLine1 + (orderData.shippingAddress.addressLine2 ? `, ${orderData.shippingAddress.addressLine2}` : ''),
      city: orderData.shippingAddress.city,
      state: orderData.shippingAddress.state,
      postalCode: orderData.shippingAddress.postalCode,
      country: orderData.shippingAddress.country,
    };

    // Create order
    const order = await Order.create({
      orderNumber: this.generateOrderNumber(),
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      orderStatus: 'pending',
      subtotal,
      shippingFee,
      discount: 0,
      total,
      notes: orderData.notes,
    });

    return order;
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string, userId?: string): Promise<any> {
    await connectDB();

    const query: any = { _id: orderId };
    if (userId) {
      query.user = userId;
    }

    const order = await Order.findOne(query).populate('user', 'name email');

    return order;
  }

  /**
   * Get orders by user
   */
  static async getUserOrders(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<{ data: any[]; pagination: any }> {
    await connectDB();

    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const query: any = { user: userId };
    if (status) {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all orders (admin)
   */
  static async getAllOrders(options: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{ data: any[]; pagination: any }> {
    await connectDB();

    const { page = 1, limit = 20, status, search } = options;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update order status (admin)
   */
  static async updateOrderStatus(
    orderId: string,
    statusData: UpdateOrderStatus
  ): Promise<any> {
    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = statusData.status;

    if (statusData.trackingNumber) {
      order.trackingNumber = statusData.trackingNumber;
    }

    if (statusData.status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid';
    }

    if (statusData.status === 'cancelled') {
      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        });
      }
    }

    await order.save();

    return order;
  }

  /**
   * Cancel order (customer)
   */
  static async cancelOrder(orderId: string, userId: string): Promise<any> {
    await connectDB();

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be cancelled');
    }

    order.status = 'cancelled';

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    await order.save();

    return order;
  }

  /**
   * Get order statistics (admin)
   */
  static async getOrderStats(): Promise<any> {
    await connectDB();

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }
}
