import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

// quick hook so we dont have to import useContext everywhere
export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }) {
  // check if user had a preference saved before
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("vintuna-theme")
    return saved ? saved === "dark" : false
  })

  // toggle between dark and light
  function toggleDark() {
    setDark(prev => !prev)
  }

  // whenever dark changes, save to localStorage and update <html> class
  useEffect(() => {
    localStorage.setItem("vintuna-theme", dark ? "dark" : "light")
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}
