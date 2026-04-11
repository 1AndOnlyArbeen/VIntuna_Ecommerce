import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import CartProvider from "./context/CartContext"
import ThemeProvider from "./context/ThemeContext"
import UserContextProvider from "./context/UserContextProvider"

// layouts
import Layout from "./components/Layout"
import AdminLayout from "./components/Admin/AdminLayout"

// store pages
import Home from "./components/Home/Home"
import Cart from "./components/Cart/Cart"
import ProductDetail from "./components/ProductDetail/ProductDetail"
import SearchResults from "./components/Categories/SearchResults"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ForgotPassword from "./components/ForgotPassword"
import Profile from "./components/Profile"
import Contact from "./components/Contact/Contact"
import Orders from "./components/Orders"
import Addresses from "./components/Addresses"

// admin pages
import AdminDashboard from "./components/Admin/AdminDashboard"
import AdminProducts from "./components/Admin/AdminProducts"
import AdminBanners from "./components/Admin/AdminBanners"
import AdminFeatured from "./components/Admin/AdminFeatured"
import AdminCategories from "./components/Admin/AdminCategories"
import AdminDiscounts from "./components/Admin/AdminDiscounts"
import AdminProfile from "./components/Admin/AdminProfile"

const router = createBrowserRouter([
  // store routes
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "cart", element: <Cart /> },
      { path: "product/:productId", element: <ProductDetail /> },
      { path: "search", element: <SearchResults /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "register", element: <Navigate to="/signup" replace /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "profile", element: <Profile /> },
      { path: "contact", element: <Contact /> },
      { path: "orders", element: <Orders /> },
      { path: "addresses", element: <Addresses /> },
    ],
  },
  // admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "banners", element: <AdminBanners /> },
      { path: "featured", element: <AdminFeatured /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "discounts", element: <AdminDiscounts /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <UserContextProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </UserContextProvider>
  </ThemeProvider>
)
