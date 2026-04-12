// Uses Vite proxy in dev — requests to /api are forwarded to http://localhost:5000
const BASE_URL = "/api/v1"

// reusable fetch wrapper
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("vintuna-token")

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  // don't set Content-Type for FormData (browser sets multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const { signal, ...restOptions } = options

  let res
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: { ...headers, ...restOptions.headers },
      signal,
      ...restOptions,
    })
  } catch (err) {
    throw new Error(err.name === "AbortError" ? "Request timed out" : "Network error — server may be offline")
  }

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error("Invalid response from server")
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

// ========================
// AUTH
// ========================
export async function loginAPI(email, password) {
  return apiCall("/users/login", { method: "POST", body: JSON.stringify({ email, password }) })
}
export async function signupAPI(formData) {
  return apiCall("/users/register", { method: "POST", body: JSON.stringify(formData) })
}
export async function verifyEmailAPI(code) {
  return apiCall("/users/verify-email", { method: "POST", body: JSON.stringify({ code }) })
}
export async function logoutAPI() {
  return apiCall("/users/logout", { method: "POST" })
}
export async function getUserDetailsAPI(opts = {}) {
  return apiCall("/users/login-user-details", { method: "GET", ...opts })
}
export async function forgetPasswordAPI(email) {
  return apiCall("/users/forget-password", { method: "POST", body: JSON.stringify({ email }) })
}
export async function verifyForgetPasswordOtpAPI(email, otp) {
  return apiCall("/users/verify-forget-password-otp", { method: "POST", body: JSON.stringify({ email, otp }) })
}
export async function resetPasswordAPI(email, newPassword, confirmPassword, otp) {
  return apiCall("/users/reset-password", { method: "POST", body: JSON.stringify({ email, newPassword, confirmPassword, otp }) })
}
export async function refreshTokenAPI() {
  return apiCall("/users/refresh-token", { method: "POST" })
}
export async function updateUserAPI(userData) {
  return apiCall("/users/update-user", { method: "PUT", body: JSON.stringify(userData) })
}
export async function uploadAvatarAPI(formData) {
  return apiCall("/users/upload-avatar", { method: "POST", body: formData })
}

// ========================
// PRODUCTS
// ========================
export async function getProductsAPI(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/products${query ? `?${query}` : ""}`)
}
export async function getProductByIdAPI(id) {
  return apiCall(`/products/${id}`)
}
export async function createProductAPI(formData) {
  return apiCall("/products", { method: "POST", body: formData })
}
export async function updateProductAPI(id, formData) {
  return apiCall(`/products/${id}`, { method: "PUT", body: formData })
}
export async function deleteProductAPI(id) {
  return apiCall(`/products/${id}`, { method: "DELETE" })
}
export async function searchProductsAPI(query) {
  return apiCall(`/products/search?q=${encodeURIComponent(query)}`)
}

// ========================
// CATEGORIES
// ========================
export async function getCategoriesAPI() {
  return apiCall("/categories")
}
export async function getCategoryByIdAPI(id) {
  return apiCall(`/categories/${id}`)
}
export async function createCategoryAPI(formData) {
  return apiCall("/categories", { method: "POST", body: formData })
}
export async function updateCategoryAPI(id, formData) {
  return apiCall(`/categories/${id}`, { method: "PUT", body: formData })
}
export async function deleteCategoryAPI(id) {
  return apiCall(`/categories/${id}`, { method: "DELETE" })
}

// ========================
// ORDERS
// ========================
export async function getOrdersAPI() {
  return apiCall("/orders")
}
export async function getOrderByIdAPI(id) {
  return apiCall(`/orders/${id}`)
}
export async function createOrderAPI(orderData) {
  return apiCall("/orders", { method: "POST", body: JSON.stringify(orderData) })
}
export async function updateOrderStatusAPI(id, status) {
  return apiCall(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) })
}

// ========================
// ADDRESSES
// ========================
export async function getAddressesAPI() {
  return apiCall("/addresses")
}
export async function createAddressAPI(addressData) {
  return apiCall("/addresses", { method: "POST", body: JSON.stringify(addressData) })
}
export async function updateAddressAPI(id, addressData) {
  return apiCall(`/addresses/${id}`, { method: "PUT", body: JSON.stringify(addressData) })
}
export async function deleteAddressAPI(id) {
  return apiCall(`/addresses/${id}`, { method: "DELETE" })
}

// ========================
// CART (server-synced)
// ========================
export async function getCartAPI() {
  return apiCall("/cart")
}
export async function addToCartAPI(productId, quantity = 1) {
  return apiCall("/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) })
}
export async function updateCartItemAPI(productId, quantity) {
  return apiCall(`/cart/${productId}`, { method: "PUT", body: JSON.stringify({ quantity }) })
}
export async function removeFromCartAPI(productId) {
  return apiCall(`/cart/${productId}`, { method: "DELETE" })
}
export async function clearCartAPI() {
  return apiCall("/cart/clear", { method: "DELETE" })
}

// ========================
// BANNERS
// ========================
export async function getBannersAPI(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/banners${query ? `?${query}` : ""}`)
}
export async function createBannerAPI(formData) {
  return apiCall("/banners", { method: "POST", body: formData })
}
export async function updateBannerAPI(id, formData) {
  return apiCall(`/banners/${id}`, { method: "PUT", body: formData })
}
export async function toggleBannerAPI(id) {
  return apiCall(`/banners/${id}/toggle`, { method: "PATCH" })
}
export async function deleteBannerAPI(id) {
  return apiCall(`/banners/${id}`, { method: "DELETE" })
}

// ========================
// DISCOUNTS
// ========================
export async function getDiscountsAPI(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/discounts${query ? `?${query}` : ""}`)
}
export async function createDiscountAPI(data) {
  return apiCall("/discounts", { method: "POST", body: JSON.stringify(data) })
}
export async function updateDiscountAPI(id, data) {
  return apiCall(`/discounts/${id}`, { method: "PUT", body: JSON.stringify(data) })
}
export async function toggleDiscountAPI(id) {
  return apiCall(`/discounts/${id}/toggle`, { method: "PATCH" })
}
export async function deleteDiscountAPI(id) {
  return apiCall(`/discounts/${id}`, { method: "DELETE" })
}

// ========================
// FEATURED
// ========================
export async function toggleFeaturedAPI(id) {
  return apiCall(`/products/${id}/featured`, { method: "PATCH" })
}

// ========================
// ADMIN
// ========================
export async function getAdminStatsAPI() {
  return apiCall("/admin/stats")
}
export async function getAdminOrdersAPI(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/admin/orders${query ? `?${query}` : ""}`)
}
export async function updateAdminOrderStatusAPI(id, status) {
  return apiCall(`/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) })
}

// ========================
// REVIEWS
// ========================
export async function getProductReviewsAPI(productId, params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/reviews/product/${productId}${query ? `?${query}` : ""}`)
}
export async function createReviewAPI(data) {
  return apiCall("/reviews", { method: "POST", body: JSON.stringify(data) })
}
export async function deleteReviewAPI(id) {
  return apiCall(`/reviews/${id}`, { method: "DELETE" })
}
export async function getAllReviewsAPI(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/reviews/admin/all${query ? `?${query}` : ""}`)
}

// ========================
// CONTACT
// ========================
export async function submitContactAPI(data) {
  return apiCall("/contact", { method: "POST", body: JSON.stringify(data) })
}
export async function getAllContactsAPI(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/contact${query ? `?${query}` : ""}`)
}
export async function toggleContactReadAPI(id) {
  return apiCall(`/contact/${id}/read`, { method: "PATCH" })
}
export async function deleteContactAPI(id) {
  return apiCall(`/contact/${id}`, { method: "DELETE" })
}

// ========================
// COUPON VALIDATION
// ========================
export async function validateCouponAPI(code, cartTotal) {
  return apiCall("/discounts/validate", { method: "POST", body: JSON.stringify({ code, cartTotal }) })
}

// ========================
// AI CHAT
// ========================
export async function sendChatMessageAPI(message, history = []) {
  return apiCall("/chat", { method: "POST", body: JSON.stringify({ message, history }) })
}

export default apiCall
