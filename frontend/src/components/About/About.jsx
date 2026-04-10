import { useScrollRevealAll } from "../../hooks/useScrollReveal"
import { Link } from "react-router-dom"

export default function About() {
  const containerRef = useScrollRevealAll()

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* hero banner */}
      <div className="relative bg-gradient-to-br from-green-700 to-emerald-600 dark:from-gray-900 dark:to-green-950 py-16 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "28px 28px"
        }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 animate-hero-text">
            About VintunaStore
          </h1>
          <p className="text-green-100 dark:text-gray-400 text-base sm:text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Bringing fresh groceries and daily essentials to doorsteps across Kathmandu.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48V30C180 10 360 40 540 30C720 20 900 0 1080 10C1260 20 1380 35 1440 28V48H0Z" className="fill-gray-50 dark:fill-gray-900" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-16">

        {/* our story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="reveal-left">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Our Story</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Started from a simple idea
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              VintunaStore began with a straightforward question: why is getting groceries in Kathmandu still such a hassle? Between traffic, crowded markets, and limited hours, something as basic as buying rice and vegetables shouldn't eat up half your day.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              So we built a platform that connects local shops and fresh produce suppliers directly to your doorstep. No middlemen, no inflated prices — just the same goods you'd find at your neighborhood store, delivered quickly.
            </p>
          </div>
          <div className="reveal-right">
            <div className="bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-gray-800 rounded-2xl p-8 sm:p-10">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "500+", label: "Products available" },
                  { num: "10min", label: "Average delivery" },
                  { num: "5000+", label: "Happy customers" },
                  { num: "24/7", label: "Order anytime" },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl sm:text-3xl font-extrabold text-green-700 dark:text-green-400">{stat.num}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* what we offer */}
        <section className="reveal">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">What We Offer</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
              Why people choose us
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Fast Delivery",
                desc: "Most orders arrive within 10-30 minutes. We work with local delivery partners who know the city inside out."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Quality First",
                desc: "Every product is sourced from trusted local suppliers. If something's not fresh, we'll replace it — no questions asked."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Honest Pricing",
                desc: "No hidden fees, no surge pricing. Free delivery on orders over Rs.200. What you see at checkout is what you pay."
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 hover-lift reveal-scale"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-11 h-11 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="reveal">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-900 dark:to-emerald-900 rounded-2xl p-8 sm:p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "20px 20px"
            }} />
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to skip the grocery run?</h2>
              <p className="text-green-100 text-sm sm:text-base mb-5 max-w-md mx-auto">
                Browse hundreds of products and get them delivered to your door in minutes.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-7 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm btn-press"
              >
                Start Shopping
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
