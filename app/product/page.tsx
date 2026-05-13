import ProductDetail from "@/components/product-detail";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ProductPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ProductDetail />
      <Footer />
    </div>
  );
}
