import logo from "../../assets/logo.png"

export default function Footer() {
  return (
    <footer className="relative bg-green-950/80 dark:bg-green-950/85 backdrop-blur-xl border-t border-green-800/25 dark:border-green-900/40 shadow-[0_-10px_50px_rgba(0,50,20,0.18),0_-3px_15px_rgba(0,50,20,0.1)] dark:shadow-[0_-10px_50px_rgba(0,30,10,0.5),0_-3px_15px_rgba(0,30,10,0.3)]">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

          {/* brand */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="VintunaStore" className="h-8 object-contain" />
            <p className="text-green-100/70 dark:text-green-200/50 text-xs max-w-[200px] leading-relaxed">
              Fresh groceries & daily essentials, delivered fast in Kathmandu.
            </p>
          </div>

          {/* contact details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs">
            <a href="tel:9818856764" className="flex items-center gap-2 text-green-100/80 dark:text-green-200/60 hover:text-white transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +977 9818856764
            </a>
            <a href="mailto:Arbinthapa.@gmail.com" className="flex items-center gap-2 text-green-100/80 dark:text-green-200/60 hover:text-white transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Arbinthapa.@gmail.com
            </a>
            <span className="flex items-center gap-2 text-green-100/80 dark:text-green-200/60">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Kathmandu, Nepal
            </span>
          </div>

          {/* social */}
          <div className="flex items-center gap-2.5">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-green-800/30 hover:bg-green-700/40 rounded-lg flex items-center justify-center transition-colors cursor-pointer group">
              <svg className="w-3.5 h-3.5 text-green-200/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-green-800/30 hover:bg-green-700/40 rounded-lg flex items-center justify-center transition-colors cursor-pointer group">
              <svg className="w-3.5 h-3.5 text-green-200/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>

        <div className="border-t border-green-800/15 dark:border-green-800/25 mt-5 pt-4 flex items-center justify-between">
          <p className="text-[10px] text-green-200/40 dark:text-green-300/30">&copy; 2026 VintunaStore. All rights reserved.</p>
          <p className="text-[10px] text-green-200/40 dark:text-green-300/30">For enquiry: +977 9818856764</p>
        </div>
      </div>
    </footer>
  )
}
