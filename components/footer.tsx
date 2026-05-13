/**
 * Footer Component
 *
 * Main website footer with navigation links and brand information.
 * Displays company branding, service links, newsletter signup,
 * social media icons, and copyright information.
 *
 * Features:
 * - Responsive grid layout (1 column mobile, 4 columns desktop)
 * - Brand logo and tagline
 * - Service links (Bespoke Tailoring, Alterations, Consultations)
 * - Newsletter subscription section
 * - Social media links
 * - Copyright notice
 *
 * @component
 */

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-xl">+</span>
              </div>
              <span className="text-xl font-semibold">Abi Ire</span>
            </div>
            <p className="text-gray-400 text-sm">
              Elevate your style with bespoke, quality fashion designs.
            </p>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-semibold mb-4">Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Bespoke Tailoring
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Alterations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Consultations
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Sign up
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Special Offers
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@abiire.com</li>
              <li>+234 XXX XXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Abi Ire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
