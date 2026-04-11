import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import CartSidebar from "./Cart/CartSidebar"
import BottomNav from "./BottomNav"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />
      <main className="flex-1 pt-[72px] pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
      <BottomNav />
    </div>
  )
}
