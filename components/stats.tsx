/**
 * Stats Component
 *
 * Statistics section displaying key business metrics and achievements.
 * Shows social proof and company accomplishments.
 *
 * Features:
 * - Three key statistics display
 * - Satisfied clients count (5K+)
 * - Premium fabrics count (300+)
 * - Client recommendation rate (98%)
 * - Responsive grid layout (1 column mobile, 3 columns desktop)
 * - Large bold numbers with descriptive text
 *
 * @component
 */

export default function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-bold mb-2 text-gray-900">5K+</h3>
            <p className="text-gray-600">
              Satisfied clients wearing our custom designs
            </p>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-2 text-gray-900">300+</h3>
            <p className="text-gray-600">
              Premium fabrics sourced from around the world
            </p>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-2 text-gray-900">98%</h3>
            <p className="text-gray-600">
              Clients recommend our bespoke tailoring services
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
