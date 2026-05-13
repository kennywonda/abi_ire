# ABI IRE E-COMMERCE - FULL STACK ARCHITECTURE PLAN

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB + Mongoose
- **Authentication**: NextAuth.js (JWT)
- **File Upload**: Cloudinary / UploadThing
- **Payment**: Stripe / Paystack
- **Validation**: Zod
- **State Management**: Zustand / React Context

### Folder Structure
```
abi_ire/
├── app/
│   ├── (auth)/                    # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (customer)/                # Customer routes
│   │   ├── products/
│   │   ├── product/[id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── orders/
│   ├── (admin)/                   # Admin routes
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   └── [id]/edit/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   └── analytics/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── products/
│   │   │   ├── route.ts         # GET, POST
│   │   │   └── [id]/route.ts    # GET, PUT, DELETE
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── upload/
│   │   └── payment/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                        # ShadCN components
│   ├── admin/
│   │   ├── ProductForm.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── DashboardStats.tsx
│   │   └── Sidebar.tsx
│   ├── customer/
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   └── CheckoutForm.tsx
│   └── shared/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── db/
│   │   └── mongodb.ts            # DB connection
│   ├── models/                   # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Category.ts
│   ├── services/                 # Business logic
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── userService.ts
│   │   └── uploadService.ts
│   ├── controllers/              # Request handlers
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   └── authController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── adminAuth.ts
│   │   └── errorHandler.ts
│   ├── validations/              # Zod schemas
│   │   ├── productSchema.ts
│   │   ├── orderSchema.ts
│   │   └── userSchema.ts
│   └── utils/
│       ├── apiResponse.ts
│       ├── errors.ts
│       └── helpers.ts
├── hooks/
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useAuth.ts
├── types/
│   ├── product.ts
│   ├── order.ts
│   └── user.ts
└── store/
    └── cartStore.ts              # Zustand store
```

---

## 📊 DATABASE SCHEMA

### 1. User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  role: "customer" | "admin",
  phone?: string,
  address?: {
    street: string,
    city: string,
    postcode: string,
    country: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Product Model
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string (unique),
  description: string,
  price: number,
  compareAtPrice?: number,
  images: [
    {
      url: string,
      alt: string,
      isPrimary: boolean
    }
  ],
  category: ObjectId (ref: Category),
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: [
    {
      name: string,
      hex: string,
      stock: number
    }
  ],
  stock: number,
  sold: number,
  rating: number (default: 0),
  reviews: [{
    user: ObjectId (ref: User),
    rating: number,
    comment: string,
    createdAt: Date
  }],
  tags: [string],
  isActive: boolean (default: true),
  isFeatured: boolean (default: false),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Category Model
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string (unique),
  description?: string,
  image?: string,
  parentCategory?: ObjectId (ref: Category),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Order Model
```typescript
{
  _id: ObjectId,
  orderNumber: string (unique),
  customer: ObjectId (ref: User),
  items: [
    {
      product: ObjectId (ref: Product),
      name: string,
      price: number,
      quantity: number,
      size: string,
      color: string,
      image: string
    }
  ],
  subtotal: number,
  discount: number,
  shipping: number,
  total: number,
  discountCode?: string,
  shippingAddress: {
    name: string,
    phone: string,
    street: string,
    city: string,
    postcode: string,
    country: string
  },
  paymentMethod: "card" | "paypal" | "bank_transfer",
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  paymentDetails?: {
    transactionId: string,
    paidAt: Date
  },
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
  statusHistory: [
    {
      status: string,
      timestamp: Date,
      note?: string
    }
  ],
  notes?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Cart Model (Optional - can use localStorage)
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: number,
      size: string,
      color: string
    }
  ],
  updatedAt: Date
}
```

---

## 🎯 ATOMIC PHASE PLAN

## **PHASE 1: PROJECT FOUNDATION** (Week 1)

### Step 1.1: Environment Setup
**Substeps:**
1. Install dependencies:
   ```bash
   yarn add mongoose zod bcryptjs next-auth@beta
   yarn add -D @types/bcryptjs
   ```
2. Create `.env.local` file with:
   - MONGODB_URI
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - CLOUDINARY_* (or UPLOADTHING_*)
3. Setup TypeScript strict mode
4. Configure ESLint and Prettier

### Step 1.2: Database Connection
**Substeps:**
1. Create `lib/db/mongodb.ts` - connection singleton
2. Test connection in API route
3. Add connection error handling
4. Create database indexes

### Step 1.3: Base Models
**Substeps:**
1. Create User model with enum roles
2. Create Product model with virtuals
3. Create Category model with nested support
4. Create Order model with status tracking
5. Add model validation and middleware
6. Create TypeScript types from models

---

## **PHASE 2: AUTHENTICATION & AUTHORIZATION** (Week 1-2)

### Step 2.1: NextAuth Setup
**Substeps:**
1. Configure `app/api/auth/[...nextauth]/route.ts`
2. Add Credentials provider
3. Add JWT callbacks
4. Create session management
5. Add bcrypt password hashing

### Step 2.2: Auth Pages
**Substeps:**
1. Create login page with form validation
2. Create register page
3. Add forgot password flow
4. Create email verification (optional)
5. Add social auth (Google, Facebook - optional)

### Step 2.3: Middleware & Guards
**Substeps:**
1. Create `lib/middleware/auth.ts` - verify JWT
2. Create `lib/middleware/adminAuth.ts` - check admin role
3. Add role-based route protection
4. Create auth hooks (useSession, useUser)
5. Add unauthorized error handling

---

## **PHASE 3: PRODUCT MANAGEMENT (ADMIN)** (Week 2-3)

### Step 3.1: Product Service Layer
**Substeps:**
1. Create `lib/services/productService.ts`:
   - `createProduct(data)`
   - `getProducts(filters, pagination)`
   - `getProductById(id)`
   - `getProductBySlug(slug)`
   - `updateProduct(id, data)`
   - `deleteProduct(id)`
   - `updateStock(id, quantity)`

### Step 3.2: Product Controller
**Substeps:**
1. Create `lib/controllers/productController.ts`
2. Wrap service calls with try-catch
3. Add input validation with Zod
4. Return standardized responses
5. Add error logging

### Step 3.3: Product API Routes
**Substeps:**
1. `app/api/products/route.ts`:
   - GET: List products (with filters)
   - POST: Create product (admin only)
2. `app/api/products/[id]/route.ts`:
   - GET: Get single product
   - PUT: Update product (admin only)
   - DELETE: Delete product (admin only)
3. Add query params: ?category=, ?search=, ?sort=, ?page=

### Step 3.4: Image Upload
**Substeps:**
1. Setup Cloudinary/UploadThing
2. Create `lib/services/uploadService.ts`
3. Create `app/api/upload/route.ts`
4. Add image optimization
5. Add multiple image support

### Step 3.5: Admin Product UI
**Substeps:**
1. Create admin layout with sidebar
2. Create products list page (table view)
3. Create product form component:
   - Basic info (name, description, price)
   - Image uploader (drag & drop)
   - Category selector
   - Size checkboxes
   - Color picker with stock
   - Tags input
4. Create product edit page
5. Add delete confirmation modal
6. Add success/error toasts

---

## **PHASE 4: ADMIN DASHBOARD** (Week 3)

### Step 4.1: Dashboard Analytics
**Substeps:**
1. Create analytics service:
   - Total revenue
   - Total orders
   - Total customers
   - Top products
   - Sales chart data
2. Create dashboard stats cards
3. Add sales chart (Chart.js/Recharts)
4. Add recent orders table
5. Add low stock alerts

### Step 4.2: Order Management
**Substeps:**
1. Create orders list page (filterable)
2. Create order detail view
3. Add status update functionality
4. Add order search
5. Add export to CSV

### Step 4.3: Category Management
**Substeps:**
1. Create category CRUD API
2. Create category management page
3. Add category selector component
4. Add nested category support

---

## **PHASE 5: CUSTOMER PRODUCT BROWSING** (Week 4)

### Step 5.1: Product Display
**Substeps:**
1. Update homepage with featured products
2. Create products listing page:
   - Grid layout
   - Category filter sidebar
   - Price range filter
   - Size filter
   - Color filter
   - Sort options (price, popularity, newest)
   - Pagination
3. Add search functionality
4. Add loading skeletons

### Step 5.2: Product Detail Page
**Substeps:**
1. Create dynamic route: `app/products/[slug]/page.tsx`
2. Add image gallery with zoom
3. Add size/color selection
4. Add quantity selector
5. Add "Add to Cart" button
6. Add reviews section
7. Add related products

---

## **PHASE 6: SHOPPING CART** (Week 4-5)

### Step 6.1: Cart State Management
**Substeps:**
1. Create Zustand cart store:
   - `addItem(product, size, color, quantity)`
   - `removeItem(itemId)`
   - `updateQuantity(itemId, quantity)`
   - `clearCart()`
   - `getTotal()`
2. Add localStorage persistence
3. Create cart hooks

### Step 6.2: Cart UI
**Substeps:**
1. Update cart page with real data
2. Add mini cart dropdown in navbar
3. Add cart item validation (stock check)
4. Add discount code functionality
5. Show shipping calculation

---

## **PHASE 7: CHECKOUT & ORDERS** (Week 5-6)

### Step 7.1: Checkout Flow
**Substeps:**
1. Create multi-step checkout:
   - Step 1: Shipping address
   - Step 2: Delivery method
   - Step 3: Payment
   - Step 4: Review
2. Add address form validation
3. Save addresses to user profile
4. Add guest checkout option

### Step 7.2: Order Service
**Substeps:**
1. Create `lib/services/orderService.ts`:
   - `createOrder(data)`
   - `getUserOrders(userId)`
   - `getOrderById(id)`
   - `updateOrderStatus(id, status)`
   - `cancelOrder(id)`
2. Add order number generation
3. Add stock reduction on order
4. Add email notifications

### Step 7.3: Payment Integration
**Substeps:**
1. Setup Stripe/Paystack
2. Create payment intent API
3. Add payment form
4. Handle payment success/failure
5. Create payment webhooks
6. Add order confirmation page

### Step 7.4: Order History
**Substeps:**
1. Create customer orders page
2. Add order status tracking
3. Add order details view
4. Add reorder functionality
5. Add invoice download

---

## **PHASE 8: ADVANCED FEATURES** (Week 7)

### Step 8.1: Product Reviews
**Substeps:**
1. Add review API endpoints
2. Create review form component
3. Add review moderation (admin)
4. Calculate average ratings
5. Add helpful votes

### Step 8.2: Wishlist
**Substeps:**
1. Create wishlist model/store
2. Add heart icon toggle
3. Create wishlist page
4. Add move to cart functionality

### Step 8.3: Search & Filters
**Substeps:**
1. Add MongoDB text search
2. Create search API with autocomplete
3. Improve filter performance
4. Add search suggestions

### Step 8.4: Notifications
**Substeps:**
1. Setup email service (Resend/SendGrid)
2. Create email templates
3. Send order confirmation emails
4. Send shipping notifications
5. Add in-app notifications (optional)

---

## **PHASE 9: OPTIMIZATION & TESTING** (Week 8)

### Step 9.1: Performance
**Substeps:**
1. Add image optimization
2. Implement caching (Redis optional)
3. Add pagination everywhere
4. Optimize database queries
5. Add loading states

### Step 9.2: Security
**Substeps:**
1. Add rate limiting
2. Sanitize user inputs
3. Add CORS properly
4. Implement CSP headers
5. Add request validation

### Step 9.3: Testing
**Substeps:**
1. Write API integration tests
2. Write component tests
3. Add E2E tests (Playwright)
4. Test payment flow
5. Test order flow

---

## **PHASE 10: DEPLOYMENT** (Week 8)

### Step 10.1: Deployment Prep
**Substeps:**
1. Setup MongoDB Atlas
2. Configure environment variables
3. Build and test production
4. Setup CI/CD (GitHub Actions)

### Step 10.2: Deploy
**Substeps:**
1. Deploy to Vercel
2. Configure custom domain
3. Setup monitoring (Sentry)
4. Add analytics (Google Analytics)
5. Final testing

---

## 📋 ADDITIONAL FEATURES (Future Enhancements)

1. **Customer Features:**
   - Size guide
   - Virtual try-on (AR)
   - Product comparison
   - Gift cards
   - Loyalty program

2. **Admin Features:**
   - Bulk product upload (CSV)
   - Inventory management
   - Sales reports
   - Customer segmentation
   - Marketing campaigns

3. **Technical:**
   - Multi-language support
   - Multi-currency
   - Progressive Web App (PWA)
   - Real-time order tracking
   - Chat support

---

## 🎯 PRIORITY CHECKLIST

### Must Have (MVP):
- [ ] User authentication
- [ ] Admin product management
- [ ] Customer product browsing
- [ ] Shopping cart
- [ ] Checkout & payment
- [ ] Order management
- [ ] Basic dashboard

### Should Have:
- [ ] Product reviews
- [ ] Wishlist
- [ ] Advanced search
- [ ] Email notifications
- [ ] Order tracking

### Nice to Have:
- [ ] Social auth
- [ ] Multi-language
- [ ] Advanced analytics
- [ ] Marketing tools
- [ ] AR features

---

## 📚 KEY TECHNOLOGIES TO INSTALL

```bash
# Core
yarn add mongoose zod next-auth@beta bcryptjs

# UI
yarn add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
yarn add @radix-ui/react-select @radix-ui/react-tabs
yarn add recharts react-hot-toast

# File Upload
yarn add uploadthing @uploadthing/react

# Payment
yarn add stripe @stripe/stripe-js

# Email
yarn add resend react-email

# Utils
yarn add date-fns slugify

# Dev
yarn add -D @types/bcryptjs @types/node
```

---

**Ready to start building?** Let me know which phase you want to begin with, and I'll help you implement it step by step! 🚀
