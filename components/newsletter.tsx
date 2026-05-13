/**
 * Newsletter Component
 * 
 * Email subscription section for collecting customer email addresses.
 * Features elegant design with decorative elements and call-to-action.
 * 
 * Features:
 * - Email input form with validation
 * - Decorative background elements
 * - Gift/reward icon
 * - Benefit highlights
 * - Responsive card design
 * - Gradient background effects
 * - Corner decorative elements
 * - Subscribe button
 * 
 * @component
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Gift, Sparkles } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="relative py-20 bg-linear-to-br from-beige-50 via-beige-50 to-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-beige-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-beige-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Newsletter Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-beige-100">
            {/* Decorative Corner Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-beige-700 rounded-full opacity-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-beige-700 rounded-full opacity-10"></div>

            <div className="relative text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-beige-100 rounded-full mb-6">
                <Gift className="w-8 h-8 text-beige-700" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                Subscribe to our newsletter
              </h2>

              {/* Discount Badge */}
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-beige-600 to-beige-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg font-bold">Get 30% OFF</span>
                <Sparkles className="w-5 h-5" />
              </div>

              <p className="text-gray-600 mb-8 text-lg">
                Join our fashion community and be the first to know about new
                arrivals, exclusive deals, and style tips!
              </p>

              {/* Email Form */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 max-w-lg mx-auto">
                <div className="flex-1 w-full relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-12 rounded-full h-14 border-2 border-gray-200 focus:border-beige-500 text-base shadow-sm"
                  />
                </div>
                <Button
                  size="lg"
                  className="rounded-full h-14 px-8 bg-beige-700 hover:bg-beige-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Subscribe Now
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
