/**
 * Product Details Page
 * 
 * @description Dynamic page displaying complete product information.
 * Shows product details, pricing, images, reviews, and add-to-cart functionality.
 * 
 * @route /product/[id]
 * 
 * @features
 * - Product information display (name, description, price)
 * - Product image gallery
 * - Stock availability indicator
 * - Add to cart functionality
 * - Product reviews and ratings
 * - Related products suggestions
 * - Server-side rendering for SEO
 * 
 * @params
 * - id: Product unique identifier
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import { ProductService } from "@/lib/services/productService";
import ProductDetails from "@/components/product/product-details";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await ProductService.getProductById(id);
    if (!product) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  // Serialize the product for Client Components
  const serializedProduct = {
    ...product,
    _id: product._id.toString(),
    category: product.category
      ? {
          ...product.category,
          _id: product.category._id.toString(),
        }
      : null,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
                {serializedProduct.images &&
                serializedProduct.images.length > 0 ? (
                  <img
                    src={serializedProduct.images[0]}
                    alt={serializedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <p>No Image Available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {serializedProduct.images &&
                serializedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {serializedProduct.images
                      .slice(0, 4)
                      .map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={image}
                            alt={`${serializedProduct.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <ProductDetails product={serializedProduct} />
            </div>
          </div>

          {/* Reviews Section */}
          {serializedProduct.reviews &&
            serializedProduct.reviews.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Customer Reviews ({serializedProduct.reviews.length})
                </h2>
                <div className="space-y-6">
                  {serializedProduct.reviews
                    .slice(0, 5)
                    .map((review: any, index: number) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-6"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {review.user?.name || "Anonymous"}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
