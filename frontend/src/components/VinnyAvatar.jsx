// Vinny — the VintunaStore assistant.
// A friendly boy wearing a Nepali Dhaka topi (ढाका टोपी) doing namaste 🙏.
// Pure inline SVG so it stays crisp at every size (28px chip → 56px button)
// and needs no external image asset.
export default function VinnyAvatar({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vinny doing namaste">
      {/* soft cream backdrop */}
      <rect width="100" height="100" fill="#FBF6E9" />

      {/* shoulders — green daura (traditional kurta) */}
      <path d="M14 100 C14 80 30 71 50 71 C70 71 86 80 86 100 Z" fill="#1a3b1e" />
      <path d="M50 71 C63 71 74 76 80 86 L78 100 L22 100 L20 86 C26 76 37 71 50 71 Z" fill="#2e7d32" />
      {/* kurta wrap trim */}
      <path d="M50 72 L61 88 L50 100 L39 88 Z" fill="#1a3b1e" opacity="0.55" />

      {/* neck */}
      <rect x="43.5" y="57" width="13" height="16" rx="6" fill="#D99B6C" />

      {/* head */}
      <circle cx="50" cy="44" r="18" fill="#E9B584" />
      {/* ears */}
      <circle cx="32.5" cy="45" r="3.4" fill="#E9B584" />
      <circle cx="67.5" cy="45" r="3.4" fill="#E9B584" />

      {/* eyes */}
      <circle cx="43" cy="45" r="2.3" fill="#3a2a1a" />
      <circle cx="57" cy="45" r="2.3" fill="#3a2a1a" />
      {/* eyebrows */}
      <path d="M39.5 40 Q43 38.3 46.5 40" stroke="#3a2a1a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M53.5 40 Q57 38.3 60.5 40" stroke="#3a2a1a" strokeWidth="1.6" strokeLinecap="round" />
      {/* smile */}
      <path d="M44 52 Q50 57.5 56 52" stroke="#9a4f28" strokeWidth="2.1" strokeLinecap="round" />

      {/* ── Dhaka topi ── */}
      <g>
        {/* cap body — taller on one side, angled like a real topi */}
        <path d="M30 36 C27.5 25 32 17 42 15 L65 19 C72.5 21.5 73 30 70 37 C60 40.5 39 40.5 30 36 Z"
          fill="#F4EDD8" stroke="#D8CDA6" strokeWidth="1.1" />
        {/* patterned base band */}
        <path d="M30.6 33.5 C40 37.5 60 37.5 69.4 34.4 L68.2 39 C59 41.8 40.5 41.8 31.6 38.4 Z" fill="#9B2226" />
        {/* geometric diamonds on the band */}
        <path d="M40 36.6 l2.4 2 -2.4 2 -2.4 -2 Z" fill="#F4EDD8" />
        <path d="M50 37.2 l2.4 2 -2.4 2 -2.4 -2 Z" fill="#F4EDD8" />
        <path d="M60 36.6 l2.4 2 -2.4 2 -2.4 -2 Z" fill="#F4EDD8" />
        {/* accent stripe near the top */}
        <path d="M35 22 C45 19.5 58 20.5 67 24" stroke="#BB3E03" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ── Namaste hands (pressed palms at the chest) 🙏 ── */}
      <g stroke="#C88A5A" strokeWidth="0.9" strokeLinejoin="round">
        <path d="M50 60 C44 63 41.5 73 44.5 84 L50 82 Z" fill="#E9B584" />
        <path d="M50 60 C56 63 58.5 73 55.5 84 L50 82 Z" fill="#EDBB8C" />
      </g>
      {/* finger creases + center seam */}
      <g stroke="#C88A5A" strokeWidth="0.8" strokeLinecap="round" opacity="0.7">
        <path d="M50 61 L50 80" />
        <path d="M47 64 L45 65.5" />
        <path d="M53 64 L55 65.5" />
        <path d="M46.5 68 L44.3 69.5" />
        <path d="M53.5 68 L55.7 69.5" />
      </g>
    </svg>
  )
}
