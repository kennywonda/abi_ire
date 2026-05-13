/**
 * Why Choose Us Component
 *
 * Feature highlights section showcasing company's unique selling points.
 * Interactive cards with expandable details using accordion pattern.
 *
 * Features:
 * - Bespoke tailoring description
 * - Premium fabrics sourcing
 * - Diverse collections showcase
 * - Expert craftsmanship highlight
 * - Interactive expand/collapse cards
 * - Color-coded icons for each feature
 * - Responsive grid layout
 * - Plus button for expanding details
 *
 * @component
 */

"use client";

import { Plus, Scissors, Sparkles, Palette, Award } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Bespoke Tailoring",
    description:
      "Every piece is custom-made to your exact measurements and style preferences, ensuring a perfect fit every time.",
    icon: Scissors,
    color: "purple",
  },
  {
    title: "Premium Fabrics",
    description:
      "We source only the finest materials from around the world - silk, wool, cotton, and traditional African fabrics.",
    icon: Sparkles,
    color: "violet",
  },
  {
    title: "Diverse Collections",
    description:
      "From contemporary western styles to traditional Nigerian attire, we design for every occasion and preference.",
    icon: Palette,
    color: "purple",
  },
  {
    title: "Expert Craftsmanship",
    description:
      "Our skilled designers and tailors bring years of experience and attention to detail to every garment we create.",
    icon: Award,
    color: "violet",
  },
];

export default function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Video Section */}
          <div className="space-y-6">
            <div className="relative bg-linear-to-br from-beige-200 via-beige-200 to-beige-300 rounded-3xl overflow-hidden h-112 lg:h-130 shadow-2xl group">
              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-beige-600/40 to-beige-600/40 group-hover:from-beige-600/50 group-hover:to-beige-600/50 transition-all">
                <Button
                  size="icon"
                  className="w-20 h-20 rounded-full bg-white hover:bg-white shadow-2xl hover:scale-110 transition-transform"
                >
                  <div className="w-0 h-0 border-t-10 border-t-transparent border-l-16 border-l-beige-700 border-b-10 border-b-transparent ml-1"></div>
                </Button>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold text-beige-700">
                  Watch Our Story
                </span>
              </div>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-md">
              <p className="text-gray-700 font-medium text-lg">
                Watch the video and discover
              </p>
              <p className="text-beige-700 font-bold text-xl">
                the Abi Ire Experience
              </p>
            </div>
          </div>

          {/* Right - Features */}
          <div>
            <div className="mb-10">
              <span className="inline-block px-4 py-2 bg-beige-100 text-beige-700 rounded-full text-sm font-semibold mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Excellence in Every Stitch
              </h2>
              <p className="text-gray-600 text-lg">
                Dedicated to creating bespoke fashion pieces with premium
                fabrics, expert craftsmanship, and timeless elegance.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`group border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                      openIndex === index
                        ? "border-beige-300 bg-beige-50/50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-beige-200 hover:shadow-md"
                    }`}
                  >
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-transparent transition-colors h-auto"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-beige-100 flex items-center justify-center shrink-0 group-hover:bg-beige-200 transition-colors`}
                        >
                          <Icon className="w-6 h-6 text-beige-700" />
                        </div>
                        <span className="font-bold text-left text-lg text-gray-900">
                          {feature.title}
                        </span>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          openIndex === index
                            ? "bg-beige-700"
                            : "bg-gray-100 group-hover:bg-beige-100"
                        } transition-colors`}
                      >
                        <Plus
                          className={`w-5 h-5 transition-all duration-300 ${
                            openIndex === index
                              ? "rotate-45 text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                    </Button>
                    {openIndex === index && (
                      <div className="px-6 pb-6 text-gray-600 text-base leading-relaxed animate-fadeIn">
                        {feature.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
