/**
 * Home Page
 *
 * Main landing page displaying all homepage sections.
 * Composed of multiple reusable components.
 *
 * Sections:
 * - Navbar: Main navigation with cart
 * - Hero: Main banner with CTA
 * - Featured Products: Highlighted products from database
 * - Products Grid: Product catalog display
 * - Stats: Business metrics and achievements
 * - Why Choose Us: Feature highlights
 * - Newsletter: Email subscription form
 * - Footer: Site footer with links
 *
 * @page
 */

import Navbar from "@/components/navbar";
import HeroNew from "@/components/hero-new";
import StatsNew from "@/components/stats-new";
import FeaturedProducts from "@/components/featured-products";
import ProductsNew from "@/components/products-new";
import WhyChooseUs from "@/components/why-choose-us";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroNew />
      <FeaturedProducts />
      <ProductsNew />
      <StatsNew />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </div>
  );
}
