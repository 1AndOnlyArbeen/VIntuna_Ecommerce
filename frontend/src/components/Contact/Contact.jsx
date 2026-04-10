import { useScrollRevealAll } from "../../hooks/useScrollReveal"

export default function Contact() {
  const containerRef = useScrollRevealAll()

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* header */}
      <div className="relative bg-gradient-to-br from-green-700 to-emerald-600 dark:from-gray-900 dark:to-green-950 py-14 sm:py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "28px 28px"
        }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 animate-hero-text">Get in Touch</h1>
          <p className="text-green-100 dark:text-gray-400 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48V30C180 10 360 40 540 30C720 20 900 0 1080 10C1260 20 1380 35 1440 28V48H0Z" className="fill-gray-50 dark:fill-gray-900" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Contact Info */}
          <div className="space-y-5 reveal-left">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 sm:p-7">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Contact Information</h2>

              <div className="space-y-5">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                    label: "Phone",
                    value: "+977 9818856764",
                    href: "tel:9818856764"
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                    label: "Email",
                    value: "Arbinthapa.@gmail.com",
                    href: "mailto:Arbinthapa.@gmail.com"
                  },
                  {
                    icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>,
                    label: "Location",
                    value: "Kathmandu, Nepal",
                    href: null
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-800 dark:text-gray-200">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Follow us</p>
              <div className="flex items-center gap-2.5">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer group hover-lift">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer group hover-lift">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 sm:p-7 reveal-right">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone</label>
                <input
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Message</label>
                <textarea
                  placeholder="How can we help?"
                  rows={4}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-shadow"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer btn-press"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
