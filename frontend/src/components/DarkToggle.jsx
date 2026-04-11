import { useTheme } from "../context/ThemeContext"

export default function DarkToggle() {
  const { dark, toggleDark } = useTheme()

  return (
    <button
      onClick={toggleDark}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-gray-800 transition-all cursor-pointer active:scale-90 duration-200"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="material-symbols-outlined text-primary dark:text-yellow-400 text-[20px] transition-transform duration-300"
        style={{
          transform: dark ? "rotate(0deg)" : "rotate(180deg)",
          fontVariationSettings: "'FILL' 1",
        }}
      >
        {dark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  )
}
