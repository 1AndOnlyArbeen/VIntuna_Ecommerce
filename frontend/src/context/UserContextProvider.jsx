import { useState, useEffect } from "react"
import UserContext from "./UserContext"
import { getUserDetailsAPI } from "../api"

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // restore user from token on app load
  useEffect(() => {
    const token = localStorage.getItem("vintuna-token")
    if (!token) {
      setLoading(false)
      return
    }

    getUserDetailsAPI()
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem("vintuna-token"))
      .finally(() => setLoading(false))
  }, [])

  // don't render the app until we know if user is logged in or not
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
