import HeroNew from "@/components/hero-new";
import StatsNew from "@/components/stats";
import ProductsNew from "@/components/products-new";
import WhyChooseUs from "@/components/why-choose-us";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroNew />
      <StatsNew />
      <ProductsNew />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </div>
  );
}
