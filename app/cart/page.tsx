/**
 * Cart Page
 *
 * Shopping cart page displaying user's cart items.
 * Composed page with navigation and footer.
 *
 * Features:
 * - Cart items display from CartPage component
 * - Navigation bar with cart count
 * - Footer for consistent layout
 * - Remove items functionality
 * - Update quantities
 * - Calculate totals
 * - Proceed to checkout button
 *
 * @page
 */

import CartPage from "@/components/cart-page";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Cart() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartPage />
      <Footer />
    </div>
  );
}
