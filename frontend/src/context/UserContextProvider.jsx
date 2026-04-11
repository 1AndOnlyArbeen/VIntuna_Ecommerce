import { useState, useEffect } from "react"
import UserContext from "./UserContext"
import { getUserDetailsAPI } from "../api"

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("vintuna-token")
    if (!token) return

    getUserDetailsAPI()
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem("vintuna-token"))
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
