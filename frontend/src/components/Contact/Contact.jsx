import { useScrollRevealAll } from "../../hooks/useScrollReveal"

export default function Contact() {
  const containerRef = useScrollRevealAll()

  return (
    <div ref={containerRef} className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="relative bg-velvet-gradient py-16 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: "28px 28px" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-headline font-extrabold text-white mb-3 animate-hero-text tracking-tight">Get in Touch</h1>
          <p className="text-white/60 font-body animate-fade-in" style={{ animationDelay: "0.2s" }}>Have a question or feedback? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6 reveal-left">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-7">
              <h2 className="text-lg font-headline font-bold text-primary mb-6">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: "call", label: "Phone", value: "+977 9818856764", href: "tel:9818856764" },
                  { icon: "mail", label: "Email", value: "Arbinthapa.@gmail.com", href: "mailto:Arbinthapa.@gmail.com" },
                  { icon: "location_on", label: "Location", value: "Kathmandu, Nepal", href: null },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary-container text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-primary hover:text-secondary cursor-pointer transition-colors font-body">{item.value}</a>
                      ) : (
                        <p className="text-sm text-primary font-body">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-7">
              <p className="text-sm font-headline font-bold text-primary mb-4">Follow us</p>
              <div className="flex items-center gap-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-surface-container-low hover:bg-primary/5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer group hover-lift">
                  <svg className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-surface-container-low hover:bg-primary/5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer group hover-lift">
                  <svg className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-7 reveal-right">
            <h2 className="text-lg font-headline font-bold text-primary mb-6">Send us a message</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
                <input type="text" placeholder="Your name"
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
                <input type="email" placeholder="you@example.com"
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone</label>
                <input type="tel" placeholder="+977 98XXXXXXXX"
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Message</label>
                <textarea placeholder="How can we help?" rows={4}
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-velvet-gradient text-on-primary font-headline font-bold py-4 rounded-full transition-all cursor-pointer btn-press uppercase tracking-widest text-sm shadow-lg">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
