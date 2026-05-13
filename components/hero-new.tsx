/**
 * Hero New Component - Alternative Hero Design
 *
 * @description Alternative hero section with enhanced visual design.
 * Features carousel, animations, and improved layout.
 *
 * @features
 * - Image carousel with navigation
 * - Loading skeleton states
 * - Feature highlights (Package, Shield, Headphones)
 * - Responsive design
 * - CTA buttons
 * - Auto-play carousel
 *
 * @usage
 * Alternative to default hero component for homepage
 */
"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Shield,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroNew() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImagesLoaded, setProductImagesLoaded] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const productImages = [
    {
      url: "https://res.cloudinary.com/drxvrz8he/image/upload/v1775213514/Screenshot_2026-04-03_115025_ljiip5.png",
      label: "Featured",
    },
    {
      url: "https://res.cloudinary.com/drxvrz8he/image/upload/v1775213514/Screenshot_2026-04-03_115014_dhrvk8.png",
      label: "New",
    },
    {
      url: "https://res.cloudinary.com/drxvrz8he/image/upload/v1775213514/Screenshot_2026-04-03_115120_bpcih3.png",
      label: "Trending",
    },
    {
      url: "https://res.cloudinary.com/drxvrz8he/image/upload/v1775213514/Screenshot_2026-04-03_115041_xoj7jx.png",
      label: "Sale",
    },
    {
      url: "https://res.cloudinary.com/drxvrz8he/image/upload/v1775213984/Screenshot_2026-04-03_115926_awsqd6.png",
      label: "Limited",
    },
    {
      url: "https://res.cloudinary.com/drxvrz8he/image/upload/v1775309837/abi_ire_products/nuwtlir2n9ssohqdfzfd.jpg",
      label: "Soft",
    },
  ];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
      setImageLoaded(false); // Reset for smooth transition
    }, 4000);

    return () => clearInterval(interval);
  }, [productImages.length]);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    setImageLoaded(false);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
    setImageLoaded(false);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoaded(false);
  };

  return (
    <section className="bg-linear-to-br from-beige-50/40 via-beige-50/30 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 mb-6">
                A mordern Nigerian
                <br />
                kidsware brand...
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                blending culture with everyday comfort.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  size="lg"
                  className="rounded-md px-8 py-6 text-base font-semibold bg-beige-700 hover:bg-beige-800 text-white"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-md px-8 py-6 text-base font-semibold border-2 border-beige-700 text-beige-700 hover:bg-beige-50"
                >
                  Explore Collection
                </Button>
              </div>

              {/* Product Preview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {productImages.slice(1).map((product, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-beige-300 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-beige-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                      {product.label}
                    </div>

                    {/* Image Container */}
                    <div className="relative aspect-square min-h-32 md:min-h-40 overflow-hidden bg-gray-50">
                      {/* Skeleton Loader */}
                      {!productImagesLoaded[index] && (
                        <div className="absolute inset-0">
                          <Skeleton className="w-full h-full" />
                        </div>
                      )}

                      {/* Actual Image */}
                      <img
                        src={product.url}
                        alt={`Product ${index + 1}`}
                        onLoad={() => {
                          const newLoaded = [...productImagesLoaded];
                          newLoaded[index] = true;
                          setProductImagesLoaded(newLoaded);
                        }}
                        onError={() => {
                          console.error(`Failed to load image: ${product.url}`);
                        }}
                        className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                          productImagesLoaded[index]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </div>

                    {/* Card Footer/Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">
                        View {product.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Image Carousel */}
            <div className="relative aspect-4/5 lg:aspect-auto lg:h-150 group">
              {/* Skeleton Loader */}
              {!imageLoaded && (
                <div className="absolute inset-0">
                  <Skeleton className="w-full h-full rounded-3xl" />
                </div>
              )}

              {/* Actual Image */}
              <div
                className={`absolute inset-0 rounded-3xl overflow-hidden bg-linear-to-br from-beige-100 to-beige-100 transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  key={currentImageIndex}
                  src={productImages[currentImageIndex].url}
                  alt={`Fashion ${productImages[currentImageIndex].label}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error("Failed to load hero image");
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Image Label Badge */}
                <div className="absolute top-4 left-4 bg-beige-700 text-white px-4 py-2 rounded-md text-sm font-bold shadow-lg">
                  {productImages[currentImageIndex].label}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-beige-700" />
              </button>

              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-beige-700" />
              </button>

              {/* Dots Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Shipping */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-beige-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    What we offer
                  </h3>
                  <p className="text-sm text-gray-600">
                    Family matching outfits.
                  </p>
                  <p className="text-sm text-gray-600">
                    Siblings matching outfits.
                  </p>
                  <p className="text-sm text-gray-600">
                    Lauxury occation wear.
                  </p>
                </div>
              </div>
            </div>

            {/* Secure Payment */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-beige-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Other offer's
                  </h3>
                  <p className="text-sm text-gray-600">Casual danshiki tops.</p>
                  <p className="text-sm text-gray-600">2-piece sets.</p>
                </div>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6 text-beige-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">24/7 Support</h3>
                  <p className="text-sm text-gray-600">
                    We're here whenever you need us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
