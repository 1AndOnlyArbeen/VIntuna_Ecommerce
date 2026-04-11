import { useScrollRevealAll } from "../../hooks/useScrollReveal"
import { Link } from "react-router-dom"

export default function About() {
  const containerRef = useScrollRevealAll()

  return (
    <div ref={containerRef} className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="relative bg-velvet-gradient py-20 sm:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: "28px 28px" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-white mb-4 animate-hero-text tracking-tight">About VintunaStore</h1>
          <p className="text-white/60 text-base sm:text-lg font-body animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Bringing fresh groceries and daily essentials to doorsteps across Kathmandu.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-24">
        {/* Our Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="reveal-left">
            <span className="text-xs font-label font-bold uppercase tracking-[0.3em] text-secondary block mb-3">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-primary tracking-tight mb-6">Started from a simple idea</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4 font-body">
              VintunaStore began with a straightforward question: why is getting groceries in Kathmandu still such a hassle? Between traffic, crowded markets, and limited hours, something as basic as buying rice and vegetables shouldn't eat up half your day.
            </p>
            <p className="text-on-surface-variant leading-relaxed font-body">
              So we built a platform that connects local shops and fresh produce suppliers directly to your doorstep. No middlemen, no inflated prices — just the same goods you'd find at your neighborhood store, delivered quickly.
            </p>
          </div>
          <div className="reveal-right">
            <div className="bg-surface-container-low rounded-2xl p-10 border border-outline-variant/10">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { num: "500+", label: "Products available" },
                  { num: "10min", label: "Average delivery" },
                  { num: "5000+", label: "Happy customers" },
                  { num: "24/7", label: "Order anytime" },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold text-primary">{stat.num}</p>
                    <p className="text-xs font-label text-on-surface-variant mt-2 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="reveal">
          <div className="text-center mb-12">
            <span className="text-xs font-label font-bold uppercase tracking-[0.3em] text-secondary block mb-3">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-primary tracking-tight">Why people choose us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "bolt", title: "Fast Delivery", desc: "Most orders arrive within 10-30 minutes. We work with local delivery partners who know the city inside out." },
              { icon: "verified_user", title: "Quality First", desc: "Every product is sourced from trusted local suppliers. If something's not fresh, we'll replace it — no questions asked." },
              { icon: "savings", title: "Honest Pricing", desc: "No hidden fees, no surge pricing. Free delivery on orders over Rs.200. What you see at checkout is what you pay." },
            ].map((item, i) => (
              <div key={item.title} className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-8 hover-lift reveal-scale" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 bg-primary/5 text-primary-container rounded-full flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-headline font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="reveal">
          <div className="bg-velvet-gradient rounded-2xl p-10 sm:p-14 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-headline font-extrabold mb-3 tracking-tight">Ready to skip the grocery run?</h2>
              <p className="text-white/60 text-sm sm:text-base mb-8 max-w-md mx-auto font-body">Browse hundreds of products and get them delivered to your door in minutes.</p>
              <Link to="/" className="inline-flex items-center gap-3 bg-gold text-primary-container font-headline font-bold px-8 py-4 rounded-full transition-colors text-sm btn-press uppercase tracking-widest shadow-lg">
                Start Shopping
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
