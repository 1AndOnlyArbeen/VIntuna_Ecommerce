import vinnyImg from "../assets/vinny-namaste.png"

// Vinny — the VintunaStore assistant: a boy in a Nepali Dhaka topi (ढाका टोपी)
// doing namaste 🙏. Rendered from a pre-cropped, circle-masked PNG asset so it
// drops straight into any rounded-full container (button, header, chat bubbles).
export default function VinnyAvatar({ className = "" }) {
  return (
    <img
      src={vinnyImg}
      alt="Vinny doing namaste"
      draggable={false}
      className={`block select-none ${className}`}
      // inline styles win over any global img reset (e.g. Tailwind Preflight's
      // `height:auto`), so the avatar always fills its round container fully.
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
    />
  )
}
