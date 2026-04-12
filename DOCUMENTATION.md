# VintunaStore — Complete Technical Documentation

---

## 1. Project Overview

**What:** Full-stack e-commerce grocery store for Nepali products (dal, momo, spices, etc.)
**Target users:** Customers in Kathmandu ordering groceries online; Admin managing inventory/orders
**Payment:** Cash on Delivery (COD) only — no payment gateway integration
**Two interfaces:**
- Customer storefront: browse, search, cart, checkout, order tracking
- Admin panel: manage products, categories, banners, featured items, discount codes, orders, dashboard stats

---

## 2. Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express | ^5.2.1 | Web framework (Express 5, not 4) |
| Mongoose | ^9.2.0 | MongoDB ODM |
| MongoDB Atlas | — | Cloud database |
| bcrypt | ^6.0.0 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT auth tokens |
| Cloudinary | ^2.9.0 | Image hosting/CDN |
| multer | ^2.0.2 | File upload handling (multipart) |
| Resend | ^6.9.2 | Transactional email (verification, password reset) |
| helmet | ^8.1.0 | HTTP security headers |
| cors | ^2.8.6 | Cross-origin resource sharing |
| cookie-parser | ^1.4.7 | Parse cookies for JWT |
| morgan | ^1.10.1 | HTTP request logging |
| dotenv | ^17.2.4 | Environment variables |
| nodemon | ^3.1.11 | Dev auto-restart |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.4 | UI framework |
| React DOM | ^19.2.4 | DOM rendering |
| React Router DOM | ^7.14.0 | Client-side routing (createBrowserRouter) |
| Tailwind CSS | ^4.2.2 | Utility-first CSS (v4 — theme in CSS, not config file) |
| @tailwindcss/vite | ^4.2.2 | Tailwind Vite plugin |
| Vite | ^8.0.1 | Build tool + dev server |
| @vitejs/plugin-react | ^6.0.1 | React fast refresh |

**No additional libraries:** No date library, toast library, chart library, form library, state management library. All vanilla React state + context.

### External Services

| Service | Purpose |
|---|---|
| MongoDB Atlas | Database hosting |
| Cloudinary | Image upload/hosting for products, categories, banners, avatars |
| Resend | Email delivery (verification emails, password reset OTPs) |
| Google Fonts | Manrope (headlines), Inter (body), Material Symbols Outlined (icons) |

---

## 3. Project Structure

```
VintunaStore/
├── backend/
│   ├── .env                        # Environment variables
│   ├── package.json
│   ├── public/
│   │   └── temp/                   # Multer temp upload directory
│   └── src/
│       ├── index.js                # Server entry — loads dotenv, connects DB, starts Express on port 5000
│       ├── app.js                  # Express app — middleware stack + all route mounts
│       ├── constants.js            # DB_NAME = "backend"
│       ├── db/
│       │   └── index.js            # Mongoose connection to MongoDB Atlas
│       ├── models/
│       │   ├── user.model.js       # User schema (auth, roles, profile)
│       │   ├── product.model.js    # Product schema (name, price, images, tags, featured)
│       │   ├── category.model.js   # Category schema (name, image)
│       │   ├── subCategory.model.js# SubCategory schema (UNUSED — no routes/controller)
│       │   ├── order.model.js      # Order schema (items, address, status, COD)
│       │   ├── cartProduct.model.js# Cart item schema (productId, quantity, userId)
│       │   ├── address.model.js    # Address schema (userId-scoped)
│       │   ├── banner.model.js     # Banner schema (title, image, link, active)
│       │   └── discount.model.js   # Discount code schema (code, amount, type, usage)
│       ├── controllers/
│       │   ├── user.controller.js      # Auth: register, login, logout, forgot password, profile
│       │   ├── product.controller.js   # CRUD + search + toggle featured
│       │   ├── category.controller.js  # CRUD
│       │   ├── cartProduct.controller.js # Cart CRUD (server-side)
│       │   ├── order.controller.js     # Create order (COD), get orders, update status
│       │   ├── address.controller.js   # User address CRUD
│       │   ├── banner.controller.js    # Banner CRUD + toggle active
│       │   ├── discount.controller.js  # Discount CRUD + toggle active
│       │   └── admin.controller.js     # Dashboard stats, all orders (paginated)
│       ├── routes/
│       │   ├── user.route.js
│       │   ├── product.route.js
│       │   ├── category.route.js
│       │   ├── cart.route.js
│       │   ├── order.route.js
│       │   ├── address.route.js
│       │   ├── banner.route.js
│       │   ├── discount.route.js
│       │   └── admin.route.js
│       ├── middlewares/
│       │   ├── auth.js             # verifyJWT — token from cookie or Authorization header
│       │   ├── admin.js            # verifyAdmin — checks req.user.role === "ADMIN"
│       │   └── multer.middleware.js # File upload config (disk storage → public/temp)
│       ├── utils/
│       │   ├── apiError.js         # Custom error class (statusCode, message, errors)
│       │   ├── apiResponse.js      # Standardized response (success, statusCode, data, message)
│       │   ├── asyncHandler.js     # Try-catch wrapper for async route handlers
│       │   ├── cloudinary.js       # Cloudinary config + upload function
│       │   ├── generateAccessAndRefreshToken.js # JWT token generation
│       │   ├── generateOtp.js      # 6-digit OTP + 10-min expiry
│       │   ├── verifyEmailTemplate.js   # HTML email template
│       │   └── forgetPasswordTemplate.js # HTML email template
│       └── config/
│           └── sendEmail.js        # Resend email client
│
├── frontend/
│   ├── index.html                  # Entry HTML (fonts, Material Symbols)
│   ├── package.json
│   ├── vite.config.js              # Vite + Tailwind + proxy /api → localhost:5000
│   └── src/
│       ├── main.jsx                # Router definition + context providers
│       ├── App.jsx                 # Not used (routing in main.jsx)
│       ├── api.js                  # All API call functions (fetch wrapper)
│       ├── index.css               # Tailwind v4 theme, animations, dark mode
│       ├── context/
│       │   ├── UserContext.js      # React.createContext()
│       │   ├── UserContextProvider.jsx # Auth state (user object + auto-fetch on mount)
│       │   ├── CartContext.jsx     # Cart state (localStorage-based, not server-synced)
│       │   └── ThemeContext.jsx    # Dark/light mode toggle
│       ├── hooks/
│       │   └── useScrollReveal.js  # IntersectionObserver scroll animations
│       ├── assets/
│       │   ├── logo.png
│       │   └── empty_cart.webp
│       └── components/
│           ├── Layout.jsx          # Store layout: Header + Outlet + Footer + CartSidebar + BottomNav
│           ├── Header/Header.jsx   # Fixed top nav: logo, search, user dropdown, cart icon
│           ├── Footer/Footer.jsx   # Desktop-only footer (hidden md:hidden)
│           ├── BottomNav.jsx       # Mobile bottom nav (md:hidden)
│           ├── DarkToggle.jsx      # Light/dark mode button
│           ├── Home/Home.jsx       # Homepage: banner slider, product grid, filters, pagination
│           ├── ProductCard/ProductCard.jsx # Reusable product card with cart controls
│           ├── ProductDetail/ProductDetail.jsx # Single product view with tabs
│           ├── Cart/
│           │   ├── Cart.jsx        # Full cart page + checkout modal (4-step: address → payment → review → success)
│           │   └── CartSidebar.jsx # Slide-in cart panel
│           ├── Categories/
│           │   └── SearchResults.jsx # Search results with sidebar filters
│           ├── Login.jsx
│           ├── Signup.jsx
│           ├── ForgotPassword.jsx  # 3-step: email → OTP → new password
│           ├── Profile.jsx         # View/edit profile
│           ├── Orders.jsx          # Order list with status progress tracker
│           ├── Addresses.jsx       # Address CRUD
│           ├── Contact/Contact.jsx # Static contact page with form (non-functional)
│           ├── Card.jsx            # Unused file
│           ├── User/User.jsx       # Unused file
│           ├── About/About.jsx     # Unused file
│           └── Admin/
│               ├── AdminLayout.jsx     # Sidebar + topbar layout for admin
│               ├── AdminDashboard.jsx  # Stats tables + recent orders
│               ├── AdminProducts.jsx   # Product CRUD table + modal
│               ├── AdminCategories.jsx # Category CRUD table + modal
│               ├── AdminBanners.jsx    # Banner CRUD table + modal
│               ├── AdminFeatured.jsx   # Featured toggle table
│               ├── AdminOrders.jsx     # Order management table + status dropdown
│               ├── AdminDiscounts.jsx  # Discount CRUD table + modal
│               └── AdminProfile.jsx    # Admin profile view + logout
```

---

## 4. Environment Setup

### Backend `.env` Variables

| Variable | Description | Example |
|---|---|---|
| `FRONTEND_URL` | CORS allowed origin (Vite dev server) | `http://localhost:5173` |
| `PORT` | Server port (optional, defaults to 5000) | `5000` |
| `MONGO_DB_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `GENERATE_ACCESSTOKEN_KEY` | JWT secret for access tokens (1-day expiry) | Any random string |
| `GENERATE_REFRESHTOKEN_KEY` | JWT secret for refresh tokens (100-day expiry) | Any random string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `dsf17ygga` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `591837283242942` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `uCyfxi5gRQ_...` |
| `RESEND_API` | Resend email service API key | `re_...` |

### Frontend

No `.env` required. API calls go to `/api/v1/*` which Vite proxies to `http://localhost:5000`.

---

## 5. Installation & Running

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Resend account (for emails)

### Backend Setup
```bash
cd backend
npm install
# Create .env with all variables listed above
mkdir -p public/temp
npm start          # Starts nodemon on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts Vite on port 5173 (proxies /api → localhost:5000)
```

### Production Build
```bash
cd frontend
npm run build      # Output in frontend/dist/
```

### Creating an Admin User
No admin creation UI exists. Set a user's role to `"ADMIN"` directly in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "ADMIN" } })
```

---

## 6. Database Schema

### Database: `backend` (MongoDB)

### 6.1 `users` Collection

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | String | yes | — | |
| `email` | String | yes (unique) | — | |
| `password` | String | yes | — | bcrypt hashed (salt=10) |
| `avatar` | String | no | `""` | Cloudinary URL |
| `mobileNumber` | String | no | `null` | |
| `refreshToken` | String | no | `""` | JWT refresh token stored in DB |
| `verify_email` | Boolean | no | `false` | Set true via email verification link |
| `last_login_date` | Date | no | `""` | Never actually updated |
| `status` | String (enum) | no | `"Active"` | `Active`, `Inactive`, `Suspended` |
| `address_details` | ObjectId → Address | no | — | Not used by current address system |
| `shopping_cart` | ObjectId → CartProduct | no | — | Not used (cart is per-item, not per-user ref) |
| `orderHistory` | [ObjectId → Order] | no | — | Not used (orders queried by userId instead) |
| `forgot_password_otp` | String | no | `null` | bcrypt-hashed OTP |
| `forgot_password_expiry` | Date | no | `null` | OTP valid for 10 min |
| `role` | String (enum) | no | `"USER"` | `USER`, `ADMIN` |
| `createdAt`, `updatedAt` | Date | auto | — | |

### 6.2 `products` Collection

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | String | yes | — | |
| `image` | Array | no | `[]` | Array of Cloudinary URLs |
| `category` | String | no | `""` | Plain string (not ObjectId ref) |
| `unit` | String | no | `""` | "kg", "pcs", etc. |
| `stock` | Number | no | `0` | |
| `price` | Number | no | `0` | Selling price |
| `originalPrice` | Number | no | `0` | Compare/MRP price |
| `discount` | Number | no | `0` | Not computed automatically |
| `description` | String | no | `""` | |
| `tags` | [String] | no | `[]` | "Best Seller", "Popular Now", "Healthy", "Organic", "New Arrival", "Limited" |
| `inStock` | Boolean | no | `true` | |
| `deliveryTime` | String | no | `""` | e.g. "15 mins" |
| `featured` | Boolean | no | `false` | Toggleable by admin |
| `publish` | Boolean | no | `true` | Not used in any query/filter |
| `createdAt`, `updatedAt` | Date | auto | — | |

### 6.3 `categories` Collection

| Field | Type | Required | Default |
|---|---|---|---|
| `name` | String | no | `""` |
| `image` | String | no | `""` |
| `createdAt`, `updatedAt` | Date | auto | — |

### 6.4 `subcategories` Collection (UNUSED — no routes/controller)

| Field | Type | Default | Notes |
|---|---|---|---|
| `name` | String | `""` | |
| `image` | String | `""` | |
| `category` | ObjectId → Category | — | |

### 6.5 `addresses` Collection

| Field | Type | Required | Default |
|---|---|---|---|
| `userId` | ObjectId → User | yes | — |
| `fullName` | String | no | `""` |
| `phone` | String | no | `""` |
| `street` | String | no | `""` |
| `city` | String | no | `""` |
| `landmark` | String | no | `""` |
| `label` | String (enum) | no | `"home"` |
| `status` | Boolean | no | `true` |
| `createdAt`, `updatedAt` | Date | auto | — |

Label enum: `home`, `work`, `other`

### 6.6 `cartproducts` Collection

| Field | Type | Required | Default |
|---|---|---|---|
| `productId` | ObjectId → Product | yes | — |
| `quantity` | Number | no | `1` |
| `userId` | ObjectId → User | yes | — |
| `createdAt`, `updatedAt` | Date | auto | — |

### 6.7 `orders` Collection

**Embedded sub-document — order item** (no `_id`):

| Field | Type |
|---|---|
| `productId` | ObjectId → Product |
| `name` | String |
| `image` | String |
| `price` | Number |
| `quantity` | Number |

**Order document:**

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `userId` | ObjectId → User | yes | — | |
| `orderId` | String | yes (unique) | — | `VNT-` + base36 timestamp + 4 random chars |
| `items` | [orderItem] | no | `[]` | Embedded, not refs |
| `deliveryAddress` | Object | — | — | Embedded: fullName, phone, street, city, landmark, label |
| `paymentMethod` | String (enum) | no | `"cod"` | Only `cod` |
| `paymentStatus` | String (enum) | no | `"pending"` | `pending`, `paid` |
| `status` | String (enum) | no | `"pending"` | `pending`, `warehouse`, `delivering`, `delivered`, `cancelled` |
| `subtotal` | Number | no | `0` | |
| `deliveryFee` | Number | no | `0` | |
| `totalAmount` | Number | no | `0` | |
| `createdAt`, `updatedAt` | Date | auto | — | |

### 6.8 `banners` Collection

| Field | Type | Required | Default |
|---|---|---|---|
| `title` | String | yes | — |
| `subtitle` | String | no | `""` |
| `buttonText` | String | no | `"Shop Now"` |
| `link` | String | no | `"/"` |
| `image` | String | no | `""` |
| `active` | Boolean | no | `true` |
| `createdAt`, `updatedAt` | Date | auto | — |

### 6.9 `discounts` Collection

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `code` | String | yes (unique) | — | Always uppercase |
| `discount` | Number | yes | — | |
| `type` | String (enum) | no | `"percent"` | `percent`, `flat` |
| `minOrder` | Number | no | `0` | |
| `active` | Boolean | no | `true` | |
| `usageLimit` | Number | no | `100` | |
| `used` | Number | no | `0` | Never auto-incremented |
| `createdAt`, `updatedAt` | Date | auto | — | |

---

## 7. API Endpoints

### Standard Response Wrapper

**Success:**
```json
{ "success": true, "statusCode": 200, "message": "...", "data": <payload> }
```

**Paginated list data shape** (products, categories, banners, discounts, admin orders):
```json
{ "data": [...], "total": 48, "page": 1, "totalPages": 5 }
```
This is nested inside `response.data`, so full shape is `response.data.data` for the array.

**Error:**
```json
{ "success": false, "message": "...", "errors": [] }
```

### 7.1 Users — `/api/v1/users`

| Method | Path | Auth | Body / Params | Response `data` |
|---|---|---|---|---|
| POST | `/register` | — | `{ name, email, password }` | User doc (no password/refreshToken) |
| POST | `/verify-email` | — | `{ code }` (user's _id) | String message |
| POST | `/login` | — | `{ email, password }` | `{ user, accessToken, refreshToken }` + sets cookies |
| POST | `/logout` | JWT | — | `{}` + clears cookies |
| POST | `/upload-avatar` | JWT | Multipart: `avatar` file | Updated user doc |
| PUT | `/update-user` | JWT | `{ name, email, mobile, password }` | Mongoose updateOne result |
| POST | `/forget-password` | — | `{ email }` | Resend data object |
| POST | `/verify-forget-password-otp` | — | `{ email, otp }` | `{}` |
| POST | `/reset-password` | — | `{ email, newPassword, confirmPassword }` | String message |
| POST | `/refresh-token` | — (cookie) | — | `{ accessToken, refreshToken }` + new cookies |
| GET | `/login-user-details` | JWT | — | User doc (no password/refreshToken) |

### 7.2 Products — `/api/v1/products`

| Method | Path | Auth | Body / Query | Response `data` |
|---|---|---|---|---|
| GET | `/` | — | `?category=&featured=true&page=1&limit=50` | `{ data: [...], total, page, totalPages }` |
| GET | `/search` | — | `?q=<query>&page=1&limit=50` | `{ data: [...], total, page, totalPages }` |
| GET | `/:id` | — | — | Product doc |
| POST | `/` | JWT+Admin | Multipart: `images[]` (up to 10) + `{ name*, price*, category, originalPrice, description, unit, stock, tags (JSON string), inStock, deliveryTime }` | Product doc |
| PUT | `/:id` | JWT+Admin | Same as POST (all optional) | Updated product doc |
| PATCH | `/:id/featured` | JWT+Admin | — | Product doc (featured toggled) |
| DELETE | `/:id` | JWT+Admin | — | `{}` |

### 7.3 Categories — `/api/v1/categories`

| Method | Path | Auth | Body / Query | Response `data` |
|---|---|---|---|---|
| GET | `/` | — | `?page=1&limit=100` | `{ data: [...], total, page, totalPages }` |
| GET | `/:id` | — | — | Category doc |
| POST | `/` | JWT+Admin | Multipart: `image` + `{ name* }` | Category doc |
| PUT | `/:id` | JWT+Admin | Multipart: `image` (optional) + `{ name }` | Updated category doc |
| DELETE | `/:id` | JWT+Admin | — | `{}` |

### 7.4 Cart — `/api/v1/cart` (all JWT required)

| Method | Path | Body / Params | Response `data` |
|---|---|---|---|
| GET | `/` | — | `[{ productId: {...populated}, quantity, userId }]` |
| POST | `/` | `{ productId*, quantity }` | Cart item doc |
| PUT | `/:productId` | `{ quantity* }` | Updated cart item |
| DELETE | `/clear` | — | `{}` |
| DELETE | `/:productId` | — | `{}` |

### 7.5 Addresses — `/api/v1/addresses` (all JWT required)

| Method | Path | Body / Params | Response `data` |
|---|---|---|---|
| GET | `/` | — | `[...addresses]` (not paginated) |
| POST | `/` | `{ fullName*, phone*, street*, city*, landmark, label }` | Address doc |
| PUT | `/:id` | Same fields (all optional) | Updated address |
| DELETE | `/:id` | — | `{}` |

### 7.6 Orders — `/api/v1/orders` (all JWT required)

| Method | Path | Auth | Body / Params | Response `data` |
|---|---|---|---|---|
| POST | `/` | JWT | `{ items: [{productId, name, image, price, quantity}], deliveryAddress: {fullName*, street*, city*, phone, landmark, label}, subtotal, deliveryFee, totalAmount }` | Order doc |
| GET | `/` | JWT | — | `[...orders]` (user's orders, not paginated) |
| GET | `/:id` | JWT | — | Order doc (user-scoped) |
| PUT | `/:id/status` | JWT+Admin | `{ status }` enum: pending/warehouse/delivering/delivered/cancelled | Order doc |

### 7.7 Banners — `/api/v1/banners`

| Method | Path | Auth | Body / Query | Response `data` |
|---|---|---|---|---|
| GET | `/` | — | `?active=true&page=1&limit=50` | `{ data: [...], total, page, totalPages }` |
| POST | `/` | JWT+Admin | Multipart: `image` + `{ title*, subtitle, buttonText, link }` | Banner doc |
| PUT | `/:id` | JWT+Admin | Multipart: `image` (optional) + `{ title, subtitle, buttonText, link }` | Updated banner |
| PATCH | `/:id/toggle` | JWT+Admin | — | Banner doc (active toggled) |
| DELETE | `/:id` | JWT+Admin | — | `{}` |

### 7.8 Discounts — `/api/v1/discounts` (all JWT+Admin required)

| Method | Path | Body / Query | Response `data` |
|---|---|---|---|
| GET | `/` | `?page=1&limit=20` | `{ data: [...], total, page, totalPages }` |
| POST | `/` | `{ code*, discount*, type, minOrder, usageLimit }` | Discount doc |
| PUT | `/:id` | Same fields (all optional) | Updated discount |
| PATCH | `/:id/toggle` | — | Discount doc (active toggled) |
| DELETE | `/:id` | — | `{}` |

### 7.9 Admin — `/api/v1/admin` (all JWT+Admin required)

| Method | Path | Query | Response `data` |
|---|---|---|---|
| GET | `/stats` | — | `{ totalProducts, inStock, outOfStock, featuredCount, totalCategories, totalOrders, pendingOrders, deliveringOrders, deliveredOrders, totalUsers, totalBanners, activeBanners, totalDiscounts, activeDiscounts, recentOrders: [5 orders with userId populated] }` |
| GET | `/orders` | `?status=&page=1&limit=20` | `{ data: [...orders populated], total, page, totalPages }` |
| PUT | `/orders/:id/status` | `{ status }` | Order doc |

### 7.10 AI Chat — `/api/v1/chat`

| Method | Path | Auth | Body | Response `data` |
|---|---|---|---|---|
| POST | `/` | — (public) | `{ message*, history: [{role, text}] }` | `{ reply: "AI response text", productsFound: 3 }` |

---

## 8. Authentication & Authorization

### JWT Strategy

**Two tokens:**
- **Access token** — 1-day expiry, payload: `{ id: userId }`, signed with `GENERATE_ACCESSTOKEN_KEY`
- **Refresh token** — 100-day expiry, payload: `{ _id: userId }`, signed with `GENERATE_REFRESHTOKEN_KEY`, stored in DB on user document

**Token delivery:**
- On login: both tokens set as httpOnly secure cookies (`sameSite: "None"`) AND returned in response body
- Frontend stores accessToken in `localStorage["vintuna-token"]` and sends it as `Authorization: Bearer <token>` header

**Token extraction (verifyJWT middleware):**
1. Tries `req.cookies.accessToken`
2. Falls back to `req.header("Authorization")?.replace("Bearer ", "")`
3. Verifies with `GENERATE_ACCESSTOKEN_KEY`
4. Loads user from DB (excluding password + refreshToken)
5. Sets `req.user = user`

**Refresh flow:**
1. Frontend calls `POST /api/v1/users/refresh-token`
2. Backend reads `refreshToken` from cookie
3. Verifies with `GENERATE_REFRESHTOKEN_KEY`
4. Validates token matches stored `user.refreshToken`
5. Issues new access + refresh tokens, updates cookies

### Roles

| Role | Value | Access |
|---|---|---|
| Customer | `"USER"` | Store browsing, cart, checkout, orders, addresses, profile |
| Admin | `"ADMIN"` | Everything above + admin panel (product/category/banner/discount/order management, dashboard) |

### verifyAdmin Middleware

- Runs after verifyJWT
- Checks `req.user.role !== "ADMIN"` → throws 403
- No frontend route guard — admin pages render for all users; backend rejects unauthorized API calls

### Protected Route Summary

| Protection | Routes |
|---|---|
| Public (no auth) | GET products, categories, banners, product search, product by id, user register/login/forgot-password |
| JWT required | Logout, upload avatar, update profile, cart CRUD, address CRUD, order creation, get orders |
| JWT + Admin | All POST/PUT/DELETE on products/categories/banners/discounts, toggle featured, admin stats, admin orders, update order status |

---

## 9. Core E-commerce Features

### 9.1 Product Listing, Filtering, Search

**Home page (Home.jsx):**
- Fetches ALL products from `GET /api/v1/products` on mount (no server pagination params)
- Client-side filtering: category, sidebar text search (name + description), price range slider, tag filter
- Client-side sorting: price asc/desc (featured/newest don't change order)
- Client-side pagination: 50 per page
- Category sidebar shows dynamic counts from loaded products

**Search page (SearchResults.jsx):**
- Triggered by search form in Header → navigates to `/search?q=<query>`
- Calls `GET /api/v1/products/search?q=<query>`
- Client-side refinement: category filter (from results), price range, text search within results
- Client-side pagination: 50 per page

### 9.2 Product Detail

**ProductDetail.jsx:**
- Fetches product by ID: `GET /api/v1/products/:productId`
- Fetches similar products: `GET /api/v1/products?category=<category>` then filters out current
- Image gallery: cycles through `product.image` array
- Tabs: Description (product.description + deliveryTime), Additional Info (static table), Reviews (hardcoded fake data)
- Cart controls: add to cart, qty increment/decrement (via CartContext)

### 9.3 Cart

**Entirely client-side via CartContext (localStorage):**
- `addToCart(product)` — adds with `id = product._id || product.id`, deduplicates
- `increaseQty(id)`, `decreaseQty(id)` — removes at 0
- `removeFromCart(id)`, `clearCart()`
- Persisted in `localStorage["vintuna-cart"]`
- NOT synced with server — backend cart API (`/api/v1/cart`) exists but is never called by frontend
- Cart count badge in header, sidebar cart panel
- Delivery fee: free if cart total >= Rs.200, else Rs.25

### 9.4 Checkout Flow (Cart.jsx)

**4-step modal:**

1. **Address** — full name, phone, street, city, landmark, label (home/work/other). Client-side validation.
2. **Payment** — 3 options displayed:
   - Cash on Delivery — **enabled, default selected**
   - eSewa — **disabled**, shows "Coming soon"
   - Khalti — **disabled**, shows "Coming soon"
3. **Review** — shows address (editable), payment method (editable), item list, price breakdown (subtotal + delivery fee + total)
4. **Success** — order number, total, payment method, "Continue Shopping" + "View Orders" links

### 9.5 Order Placement (COD)

On "Place Order" click:
```
POST /api/v1/orders
{
  items: [{ productId, name, image, price, quantity }],
  deliveryAddress: { fullName, phone, street, city, landmark, label },
  subtotal, deliveryFee, totalAmount
}
```
Backend generates `orderId` (`VNT-<base36timestamp><random>`), saves order with `paymentMethod: "cod"`, `status: "pending"`, `paymentStatus: "pending"`.

After success: clears cart (localStorage), closes modal, shows success screen.

### 9.6 Order Management (Admin)

**AdminOrders.jsx:**
- Fetches from `GET /api/v1/admin/orders?page=&limit=10&status=`
- Server-side pagination (10 per page)
- Filter by status: All, Pending, In Warehouse, Delivering, Delivered, Cancelled
- Inline status dropdown per row → `PUT /api/v1/admin/orders/:id/status` → re-fetches

### 9.7 User Profile / Address

**Profile.jsx:** View name/email/phone/role/status. Edit mode sends all 4 fields (name, email, mobile, password) to `PUT /api/v1/users/update-user`. No avatar upload UI (API exists but not wired).

**Addresses.jsx:** Full CRUD via `GET/POST/PUT/DELETE /api/v1/addresses`. Fields: fullName, phone, street, city, landmark, label.

---

## 10. Order Flow — Full COD Lifecycle

```
1. CART (client-side localStorage)
   ├── Customer browses products → adds to cart via ProductCard/ProductDetail
   ├── Cart persisted in localStorage["vintuna-cart"]
   └── CartSidebar or /cart page shows items + totals

2. CHECKOUT (Cart.jsx modal)
   ├── Step 1: Enter delivery address
   ├── Step 2: Select payment (COD only functional)
   ├── Step 3: Review order details
   └── Step 4: Click "Place Order"

3. ORDER CREATED (Backend)
   ├── POST /api/v1/orders → creates Order document
   │   ├── orderId: "VNT-<generated>"
   │   ├── status: "pending"
   │   ├── paymentMethod: "cod"
   │   ├── paymentStatus: "pending"
   │   ├── items: [...cart items embedded]
   │   └── deliveryAddress: {...embedded}
   └── Frontend: clears localStorage cart, shows success

4. CUSTOMER TRACKING (Orders.jsx)
   ├── GET /api/v1/orders → lists user's orders
   └── Progress bar: Ordered → Warehouse → On the way → Delivered

5. ADMIN MANAGEMENT (AdminOrders.jsx)
   ├── GET /api/v1/admin/orders → all orders (paginated, filterable)
   ├── Admin changes status via dropdown:
   │   pending → warehouse → delivering → delivered
   │   (or pending → cancelled)
   └── PUT /api/v1/admin/orders/:id/status
       └── If status = "delivered" → paymentStatus auto-set to "paid"

6. CUSTOMER SEES UPDATE
   └── Next time customer visits /orders, updated status is reflected
```

---

## 11. State Management

### Frontend State Architecture

**No external state library** — all React Context + local component state.

| State Scope | Mechanism | Persistence | Key Data |
|---|---|---|---|
| Auth/User | `UserContext` (React Context) | `localStorage["vintuna-token"]` | `user` object or null |
| Cart | `CartContext` (React Context) | `localStorage["vintuna-cart"]` | `cart` array, `cartCount`, `cartTotal`, `sidebarOpen` |
| Theme | `ThemeContext` (React Context) | `localStorage["vintuna-theme"]` | `dark` boolean |
| Page data | Local `useState` per component | None | Products, categories, orders, etc. |

### Key Data Flows

**Login flow:**
1. User submits email/password → `loginAPI()` → gets `{ accessToken, user }`
2. Token saved to localStorage → `setUser(res.data.user)` → context updates
3. All components reading `UserContext` re-render
4. Subsequent API calls read token from localStorage for `Authorization` header

**Cart flow:**
1. User clicks add → `addToCart(product)` in CartContext
2. Cart state updates → `useEffect` persists to localStorage
3. `cartCount` and `cartTotal` are computed values (reduce over cart array)
4. Header badge, sidebar, cart page all read from same context

**Product loading:**
1. Component mounts → calls API (e.g. `getProductsAPI()`)
2. Response: `res.data` may be `{ data: [...], total, page, totalPages }` (paginated) or direct array
3. Components handle both: `res.data?.data || res.data || []`
4. Local state updated → renders list

---

## 12. Error Handling

### Backend

**asyncHandler wrapper** (`src/utils/asyncHandler.js`):
- Wraps every controller function in try-catch
- Catches thrown `apiError` instances + any other errors
- Returns `{ success: false, message: err.message, errors: [] }` with `err.statusCode || 500`

**apiError class** (`src/utils/apiError.js`):
- Extends Error with `statusCode`, `success: false`, `errors: []`
- Thrown in controllers for validation failures, not found, unauthorized

**Express 5 behavior:** Thrown errors in sync middleware (like `verifyAdmin`) are automatically caught by Express 5's error handling.

### Frontend

**api.js fetch wrapper:**
- Network failures → `"Network error — server may be offline"`
- AbortError → `"Request timed out"`
- Non-ok responses → `data.message || "Something went wrong"`
- All thrown as `new Error(message)`

**Component-level handling:**
- Each component that calls APIs has local `error` or `saveError` state
- Errors displayed as red banners/messages in the UI
- Empty catch blocks (`catch {}`) on non-critical fetches (e.g. initial data load — shows empty state)
- `loading` state shows skeleton shimmer during fetches
- No global error boundary, no toast notification system

---

## 13. AI Chatbot (Ollama + Llama 3.1)

### Overview

VintunaStore includes an AI-powered shopping assistant chatbot running **Llama 3.1 8B** locally via **Ollama**. No API key, no cloud service, no cost — runs entirely on the developer's machine. The chatbot helps customers find products, check prices, and get store information using real product data from MongoDB.

### How It Works — Step by Step

```
CUSTOMER                    BACKEND (port 5000)              OLLAMA (port 11434)
   |                           |                               Llama 3.1 8B
   |  "show me spices          |                               |
   |   under Rs.200"           |                               |
   | ────────────────────────> |                               |
   |                           |                               |
   |                    1. Extract keywords                    |
   |                       ["spices", "under", "200"]          |
   |                           |                               |
   |                    2. Search MongoDB                      |
   |                       Product.find({                      |
   |                         name/category/description         |
   |                         matches "spices"                  |
   |                       })                                  |
   |                           |                               |
   |                    3. Found: Timur Rs.180,                |
   |                       Jimbu Rs.250, Haldi Rs.120          |
   |                           |                               |
   |                    4. Build system prompt +                |
   |                       product context                     |
   |                           |                               |
   |                           |  POST localhost:11434/api/chat|
   |                           | ───────────────────────────> |
   |                           |                               |
   |                           |     5. DeepSeek generates     |
   |                           |        response using         |
   |                           |        REAL product data      |
   |                           |                               |
   |                           | <─────────────────────────── |
   |                           |                               |
   |                    6. Clean <think> tags                   |
   |                           |                               |
   |  "We have Timur            |                               |
   |   (Rs.180) and Haldi      |                               |
   |   (Rs.120) under Rs.200!" |                               |
   | <──────────────────────── |                               |
```

### Prerequisites

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull Llama 3.1 8B (~4.9GB)
ollama pull llama3.1:8b

# Ollama auto-starts as a service, or run manually:
ollama serve
```

Ollama must be running at `http://localhost:11434` before starting the backend.

### Key Design Decisions

1. **Fully local** — No cloud API, no API key, no cost, no rate limits, no data leaves the machine
2. **Real data only** — AI only recommends products that exist in MongoDB
3. **No auth required** — Guests can chat too
4. **Conversation memory** — Full chat history sent each request
5. **Thinking cleanup** — If using a reasoning model (DeepSeek R1), the controller strips `<think>...</think>` tags before returning the response
6. **60-second timeout** — Prevents hanging if model is slow; returns friendly error
7. **Fallback** — If no products match query, sends 10 newest products as context

### Files

| File | Purpose |
|---|---|
| `backend/src/controllers/chat.controller.js` | Searches MongoDB, builds prompt, calls Ollama API via `fetch`, cleans `<think>` tags |
| `backend/src/routes/chat.route.js` | `POST /api/v1/chat` (public, no auth) |
| `frontend/src/components/ChatWidget.jsx` | Floating brown chat bubble + chat panel UI |
| `frontend/src/api.js` → `sendChatMessageAPI()` | API function for chat |

### API Endpoint

```
POST /api/v1/chat
Auth: None (public)
Body: {
  "message": "do you have organic spices?",
  "history": [
    { "role": "user", "text": "hello" },
    { "role": "model", "text": "Namaste! How can I help?" }
  ]
}
Response: {
  "success": true,
  "data": {
    "reply": "Yes! We have Timur (Rs.180) and Nepali Haldi (Rs.120)...",
    "productsFound": 3
  }
}
```

### Environment Setup

No API key needed. Just ensure Ollama is running:
```bash
ollama serve        # if not running as system service
ollama list         # verify llama3.1:8b is available
```

The controller connects to `http://localhost:11434/api/chat` using the `llama3.1:8b` model. To change the model, edit `MODEL` constant in `chat.controller.js`.

### System Prompt

The AI is instructed to:
- Be a friendly Nepali grocery store assistant
- Only recommend products from the database
- Show prices in Rs.
- Mention out-of-stock items
- Know that delivery is free above Rs.200
- Know that payment is COD only
- Keep responses short (2-3 sentences unless listing products)
- Not include thinking/reasoning in its response

### Frontend Component (ChatWidget.jsx)

- **Floating button** — bottom-right corner, brown (`#7f5700`) with robot icon
- **Chat panel** — 340px wide, max 520px tall, slides in with scale animation
- **Chat header** — brown gradient matching the button
- **Messages** — user messages (right, dark green), AI messages (left, gray)
- **Typing indicator** — 3 bouncing dots while waiting for AI
- **Auto-scroll** — scrolls to latest message automatically
- **Mobile** — positioned above BottomNav (bottom-24 on mobile, bottom-6 on desktop)

### Limitations

- **First response is slow** — Llama 3.1 8B needs ~5-15 seconds for the first response while the model loads into memory. Subsequent responses are faster (~2-5s).
- **Hardware dependent** — Needs ~5GB RAM for the 8B model. If your machine is slow, use `llama3.2:3b` instead (change `MODEL` in controller).
- **No streaming** — Waits for full response before displaying.
- **No persistent history** — Conversation resets on page refresh.
- **Context window** — Sends up to 15 matching products. Very large catalogs may miss some results.
- **Must run Ollama** — Chatbot won't work if Ollama service isn't running.

---

## 14. Known Limitations / TODOs

### Not Built / Non-Functional

| Feature | Status |
|---|---|
| **Online payment** (eSewa, Khalti) | UI shown as "Coming soon" (disabled), no API integration |
| **Product reviews/ratings** | ProductDetail shows 2 hardcoded fake reviews, no review model/API |
| **Wishlist/Favorites** | Heart button renders on ProductDetail but has no onClick handler |
| **"Buy Now" button** | Renders on ProductDetail but non-functional |
| **Discount code at checkout** | Admin can CRUD discount codes, but no input field in Cart.jsx to apply them |
| **Discount `used` counter** | Never auto-incremented — no endpoint to validate/apply a code |
| **Server-side cart sync** | Backend cart API exists (`/api/v1/cart`) with full CRUD, but frontend never calls it. Cart is localStorage only — not synced across devices |
| **Cart merge after login** | `getCartForMerge()` exists in CartContext but is never called |
| **Order detail page** | Orders.jsx renders link to `/orders/:id` but that route is not registered in the router — dead link |
| **Email verification flow** | Backend sends verification email with link to `/verify-email?code=<userId>`, but no `/verify-email` route exists in the frontend router to handle it |
| **Contact form submission** | Contact.jsx has a form but no onSubmit handler — non-functional |
| **Avatar upload UI** | `uploadAvatarAPI` exists in api.js but Profile.jsx has no upload interface |
| **SubCategory** | Model exists (`subCategory.model.js`) but no controller, no routes — dead code |
| **Admin route protection** | No frontend guard — any logged-in user can navigate to `/admin/*`; only backend rejects non-admin API calls |

### Bugs / Issues

| # | Severity | Location | Issue |
|---|---|---|---|
| 1 | Critical | `user.model.js` | `import { mongoose }` (named import) should be `import mongoose` — may crash on startup |
| 2 | Medium | `category.model.js` | Unused `{ mongo }` import |
| 3 | Medium | JWT tokens | Access token payload key is `id`, refresh token is `_id` — inconsistent (works but fragile) |
| 4 | Medium | `uploadAvatarController` | Response includes `password` and `refreshToken` (not filtered) |
| 5 | Medium | `updateUSerDetailController` | Returns mongoose `updateOne` result, not the updated user doc; requires all 4 fields even for partial update |
| 6 | Medium | `forgetPasswordController` | Hashes OTP then immediately bcrypt-compares it in the same function — wasteful no-op |
| 7 | Medium | `asyncHandler.js` | Uses `err.error` instead of `err.errors` — error details never forwarded to client |
| 8 | Low | `cloudinary.js` | Logs Cloudinary API key to console on startup |
| 9 | Low | `multer.middleware.js` | Uses `file.originalname` — concurrent uploads with same filename overwrite each other |
| 10 | Low | `.env` | Uses `//` comments (not valid dotenv syntax — use `#` instead) |
| 11 | Low | `user.model.js` | `last_login_date` default is `""` (empty string for Date type); field is never updated on login |
| 12 | Low | `Product.category` | Plain string, not ObjectId ref — no referential integrity with Category collection |
| 13 | Low | `Signup.jsx` | Form collects phone, address, gender, DOB but only sends name/email/password to API |
| 14 | Low | `AdminProducts` | `weight` field collected in form but never sent in FormData |
| 15 | Low | Footer | Hardcoded personal contact info (real phone number, email) |
| 16 | Info | Routes | `updateOrderStatus` exposed at both `/api/v1/orders/:id/status` and `/api/v1/admin/orders/:id/status` — redundant |

### Hardcoded Values

| Location | What |
|---|---|
| `CartSidebar.jsx` / `Cart.jsx` | Delivery fee: free if >= Rs.200, else Rs.25 |
| `ProductDetail.jsx` | Brand always "VintunaStore", rating always 4.9 (245 Reviews), review summary bars hardcoded |
| `Footer.jsx` | Phone: +977 9818856764, Email: Arbinthapa.@gmail.com, Location: Kathmandu, Copyright 2026 |
| `Home.jsx` | Tag options: Best Seller, Popular Now, Healthy, Organic, New Arrival, Limited |
| `sendEmail.js` | From address: `VintunaStore <onboarding@resend.dev>` |
| `generateAccessAndRefreshToken.js` | Access token: 1-day expiry, Refresh token: 100-day expiry |
