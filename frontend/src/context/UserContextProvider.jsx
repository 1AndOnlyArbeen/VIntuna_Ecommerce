import { useState, useEffect } from "react"
import UserContext from "./UserContext"
import { getUserDetailsAPI } from "../api"

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  // Only "loading" if there's a token to validate; otherwise we already know there's no user.
  const [loading, setLoading] = useState(() => !!localStorage.getItem("vintuna-token"))

  useEffect(() => {
    const token = localStorage.getItem("vintuna-token")
    if (!token) return

    getUserDetailsAPI()
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem("vintuna-token"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
