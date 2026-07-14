import vinnyImg from "../assets/vinny-avatar.png"

// Vinny — the VintunaStore assistant: a boy in a Nepali Dhaka topi (ढाका टोपी)
// doing namaste 🙏. Rendered from a pre-cropped, circle-masked PNG asset so it
// drops straight into any rounded-full container (button, header, chat bubbles).
export default function VinnyAvatar({ className = "" }) {
  return (
    <img
      src={vinnyImg}
      alt="Vinny doing namaste"
      draggable={false}
      className={`object-cover select-none ${className}`}
    />
  )
}
