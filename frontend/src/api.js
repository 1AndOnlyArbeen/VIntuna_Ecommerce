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

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: { ...headers, ...options.headers },
    ...options,
  })

  const data = await res.json()

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
export async function getUserDetailsAPI() {
  return apiCall("/users/login-user-details", { method: "GET" })
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

export default apiCall
