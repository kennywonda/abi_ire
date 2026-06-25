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

import { Plus, Scissors, Sparkles, Palette, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const videos = [
  { id: "7647833011764989206", title: "Abi Ire Story" },
  { id: "7647675725201411350", title: "Abi Ire Collection" },
  { id: "7647540061596110102", title: "Abi Ire Behind the Scenes" },
];

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
  const [videoIndex, setVideoIndex] = useState(0);

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Video Section */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black flex items-center justify-center" style={{ minHeight: "560px" }}>
              <iframe
                key={videos[videoIndex].id}
                src={`https://www.tiktok.com/embed/v2/${videos[videoIndex].id}`}
                className="w-full h-full absolute inset-0"
                style={{ minHeight: "560px" }}
                allowFullScreen
                allow="encrypted-media"
                title={videos[videoIndex].title}
              />
              {/* Prev / Next buttons */}
              <button
                onClick={() => setVideoIndex((i) => (i - 1 + videos.length) % videos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={() => setVideoIndex((i) => (i + 1) % videos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition"
                aria-label="Next video"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center gap-2">
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setVideoIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === videoIndex ? "bg-beige-700 scale-125" : "bg-gray-300 hover:bg-beige-400"}`}
                  aria-label={`Video ${i + 1}`}
                />
              ))}
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
