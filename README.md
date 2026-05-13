# Abi Ire E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 16, TypeScript, and MongoDB.

## 🚀 Features

- **Product Management**: Browse, search, and filter products by categories
- **Shopping Cart**: Real-time cart updates with Zustand state management
- **User Authentication**: Secure login/registration with NextAuth v5
- **Admin Dashboard**: Complete product, category, and order management
- **Order Management**: Track orders from creation to delivery
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Image Upload**: Cloudinary and UploadThing integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.2, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth v5 with JWT
- **State Management**: Zustand
- **Validation**: Zod
- **File Upload**: Cloudinary, UploadThing
- **UI Components**: Radix UI, Lucide Icons

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kennywonda/abi_ire.git
cd abi_ire
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── admin/       # Admin dashboard pages
│   ├── auth/        # Authentication pages
│   └── ...
├── components/      # React components
├── lib/            # Utilities and configurations
│   ├── models/     # MongoDB models
│   ├── services/   # Business logic
│   └── validations/ # Zod schemas
└── docs/           # Documentation files
```

## 🔐 Admin Access

Create an admin user using the setup script:
```bash
node scripts/create-admin.js
```

## 📖 Documentation

Additional documentation can be found in the `/docs` folder:
- Architecture guides
- Setup instructions
- Development phases

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
