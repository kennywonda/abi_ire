# Phase 2 Setup: Authentication & Authorization

## ✅ Completed Features

### 1. NextAuth.js Integration (v5)
- Credentials provider for email/password authentication
- JWT-based session management  
- Custom user roles (admin/customer)
- Session callbacks for user data

### 2. Authentication Pages
- **Login Page**: `/auth/login` - User sign in
- **Register Page**: `/auth/register` - New user registration

### 3. API Routes
- **POST** `/api/auth/register` - User registration endpoint
- **NextAuth Routes**: `/api/auth/*` - Handled by NextAuth.js

### 4. Middleware
- `withAuth()` - Protect routes requiring authentication
- `withAdmin()` - Protect admin-only routes
- `getCurrentUser()` - Get current session user
- `isAuthenticated()` - Check auth status
- `isAdmin()` - Check admin role

### 5. Validation Schemas (Zod)
- Login validation
- Register validation
- Update profile validation
- Change password validation

### 6. Service Layer
- `AuthService.register()` - Create new user
- `AuthService.getUserById()` - Fetch user by ID
- `AuthService.getUserByEmail()` - Fetch user by email
- `AuthService.updateProfile()` - Update user info
- `AuthService.changePassword()` - Change password
- `AuthService.createAdmin()` - Create admin user

## 🚀 Setup Instructions

### 1. Install Dependencies (Already Done)
```bash
yarn add mongoose zod next-auth@beta bcryptjs uploadthing
yarn add -D @types/bcryptjs
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` - Random secret (generate with: `openssl rand -base64 32`)

### 3. Start MongoDB
#### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod --dbpath /path/to/data/db

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Atlas
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to `.env.local`

### 4. Create Admin User
Run the admin creation script:

```bash
node scripts/create-admin.js
```

Follow the prompts to create your first admin user.

### 5. Start Development Server
```bash
yarn dev
```

## 📍 Available Routes

### Public Routes
- `/` - Home page
- `/auth/login` - Sign in page
- `/auth/register` - Sign up page

### Protected Routes (Require Authentication)
- Coming in Phase 3+

### Admin Routes (Require Admin Role)
- Coming in Phase 3+

## 🔑 Usage Examples

### Protecting an API Route
```typescript
import { withAuth } from '@/lib/middleware/auth';

export const GET = withAuth(async (req, session) => {
  // User is authenticated
  const userId = session.user.id;
  // ... your logic
});
```

### Protecting an Admin Route
```typescript
import { withAdmin } from '@/lib/middleware/adminAuth';

export const POST = withAdmin(async (req, session) => {
  // User is admin
  const adminId = session.user.id;
  // ... your logic
});
```

### Using Session in Client Components
```typescript
'use client';
import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;
  
  return <div>Hello, {session.user.name}!</div>;
}
```

### Using Session in Server Components
```typescript
import { getCurrentUser } from '@/lib/middleware/auth';

export default async function MyPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

## 🧪 Testing Authentication

### Test User Registration
1. Go to http://localhost:3000/auth/register
2. Fill in the form
3. Submit - you'll be redirected to login

### Test User Login
1. Go to http://localhost:3000/auth/login
2. Enter credentials
3. Submit - you'll be redirected to home page

### Verify Admin Access
1. Create admin using script
2. Login with admin credentials
3. Admin-only routes will be accessible

## 📁 File Structure

```
lib/
├── auth.ts                    # NextAuth configuration
├── models/
│   └── User.ts               # User Mongoose model
├── services/
│   └── authService.ts        # Auth business logic
├── validations/
│   └── auth.ts               # Zod validation schemas
└── middleware/
    ├── auth.ts               # Authentication middleware
    └── adminAuth.ts          # Admin authorization middleware

app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       │   └── route.ts      # NextAuth handler
│       └── register/
│           └── route.ts      # Registration endpoint
└── auth/
    ├── login/
    │   └── page.tsx          # Login page
    └── register/
        └── page.tsx          # Register page

types/
└── next-auth.d.ts            # NextAuth type extensions

components/
└── providers/
    └── session-provider.tsx  # Session provider wrapper

scripts/
└── create-admin.js           # Admin creation script
```

## ⚠️ Security Notes

1. **Never commit** `.env.local` to git
2. **Use strong secrets** for NEXTAUTH_SECRET (minimum 32 characters)
3. **Hash all passwords** (done automatically via bcryptjs)
4. **Validate all inputs** (using Zod schemas)
5. **Use HTTPS** in production

## 🐛 Troubleshooting

### "Invalid credentials" error
- Check MongoDB is running
- Verify user exists in database
- Ensure password is correct

### "Session not found" error
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your app URL
- Clear browser cookies and try again

### TypeScript errors
- Run `yarn` to ensure all dependencies are installed
- Restart TypeScript server in VS Code

## ➡️ Next Phase

**Phase 3: Product Management Admin**
- Product CRUD operations
- Image upload functionality
- Admin dashboard UI
- Product listing API
