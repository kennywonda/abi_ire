/**
 * Stats New Component - Alternative Statistics Section
 *
 * @description Alternative statistics section with gradient background.
 * Displays key business metrics and achievements.
 *
 * @features
 * - Gradient background (beige tones)
 * - Decorative blur elements
 * - Multiple stat cards
 * - Achievement highlights
 * - Responsive grid layout
 * - Animated decorative elements
 *
 * @usage
 * Alternative to default stats component for homepage
 */
export default function StatsNew() {
  return (
    <section className="relative py-24 bg-linear-to-br from-beige-700 via-beige-800 to-beige-900 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-beige-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Achievements
            </h2>
            <p className="text-beige-100 text-lg">
              Numbers that speak for our excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-3xl"></div>
              <div className="relative text-center space-y-3">
                <div className="inline-block p-3 bg-white/20 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-6xl md:text-7xl font-bold text-white group-hover:scale-110 transition-transform">
                  5K+
                </h3>
                <p className="text-lg text-beige-100">
                  Satisfied clients wearing our custom designs
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-3xl"></div>
              <div className="relative text-center space-y-3">
                <div className="inline-block p-3 bg-white/20 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-6xl md:text-7xl font-bold text-white group-hover:scale-110 transition-transform">
                  300+
                </h3>
                <p className="text-lg text-beige-100">
                  Premium fabrics sourced from around the world
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-3xl"></div>
              <div className="relative text-center space-y-3">
                <div className="inline-block p-3 bg-white/20 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
                <h3 className="text-6xl md:text-7xl font-bold text-white group-hover:scale-110 transition-transform">
                  98%
                </h3>
                <p className="text-lg text-beige-100">
                  Clients recommend our bespoke tailoring services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
